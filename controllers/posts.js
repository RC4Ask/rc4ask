const Post = require('../models/Post');
const User = require('../models/User');
const Module = require('../models/Module');
const Category = require('../models/Category');

const notif = require('../middleware/notification')
const {
  handleError,
  handleSuccess,
  buildErrObject,
  buildSuccObject,
  roundDate
} = require('../middleware/utils');

/*********************
 * Private functions *
 *********************/

/* Finds user by id  */
const findUserById = async (id) => {
  return new Promise((resolve, reject) => {
    User.findOne({ _id: id })
      .select('_id name avatar saved notifications contributions')
      .then((user) => {
        if (!user) {
          reject(buildErrObject(422, 'User does not exist'));
        } else {
          resolve(user); // returns mongoose object
        }
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/* Finds module by id */
const findModuleyById = async (id) => {
  return new Promise((resolve, reject) => {
    Module.findOne({ _id: id })
      .select('_id name posts category')
      .then((mod) => {
        if (!mod) {
          reject(buildErrObject(422, 'Module does not exist'));
        } else {
          resolve(mod); // returns mongoose object
        }
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/* Finds post by id*/
const findPostById = async (id) => {
  return new Promise((resolve, reject) => {
    Post.findOne({ _id: id })
      .select('_id text author title module moduleName authorName upvote downvote comments avatar categoryName categoryAcronym nOfUpvote')
      .then(post => {
        if (!post) {
          reject(buildErrObject(422, 'Post does not exist'));
        } else {
          resolve(post); // returns mongoose object
        }
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/* Deletes post from database */
const deletePostFromDb = async (id) => {
  return new Promise((resolve, reject) => {
    Post.deleteOne({ _id: id })
      .then((result) => {
        if (result.n) resolve(buildSuccObject('Post deleted'));
        else reject(buildErrObject(422, 'Post not found'));
      })
      .catch((error) => handleError(res, buildErrObject(422, error.message)));
  });
};

/* Finds university by name  */
const findUniversityById = async (id) => {
  return new Promise((resolve, reject) => {
    Category.findOne({ _id: id })
      .select('name modules _id acronym')
      .then((uni) => {
        if (!uni) {
          reject(buildErrObject(422, 'Category does not exist'));
        } else {
          resolve(uni); // returns mongoose object
        }
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/* Returns all post sorted from upvote */
const sortedPostUpvote = async () => {
  return new Promise((resolve, reject) => {
    Post.find()
      .sort({ nOfUpvote: -1 })
      .lean()
      .then((postList) => {
        resolve(postList);
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/* Returns all post sorted from date */
const sortedPostDate = async () => {
  return new Promise((resolve, reject) => {
    Post.find()
      .sort({ date: -1 })
      .lean()
      .then((postList) => {
        resolve(postList);
      })
      .catch((err) => reject(buildErrObject(422, err.message)));
  });
};

/* Returns all post sorted from date */
const sortedPostComments = async () => {
  return new Promise((resolve, reject) => {
    Post.find().exec(function (err, post) {
      resolve(
        post.sort(function (doc1, doc2) {
          return doc2.comments.length - doc1.comments.length;
        })
      );
    });
  });
};

/********************
 * Public functions *
 ********************/

exports.getPostList = async (req, res) => {
  Post.find()
    .lean()
    .then((postList) => handleSuccess(res, buildSuccObject(postList)))
    .catch((err) => handleError(res, buildErrObject(422, err.message)));
};

exports.createPost = async (req, res) => {
  try {
    var newPost = new Post({
      text: req.body.post.text,
      title: req.body.post.title,
      author: req.body._id,
      module: req.body.post.module,
      date: Date.now(),
      nOfUpvote: 0,
    });

    const author = await findUserById(newPost.author);
    const mod = await findModuleyById(newPost.module);
    const uni = await findUniversityById(mod.category);

    const date = roundDate(new Date())
    if (author.contributions) {
      if (author.contributions[`${date}`]) {
        const data = {
          ...author.contributions
        }
        const n = author.contributions[`${date}`] + 1
        data[`${date}`] = n
        author.contributions = data
      } else {
        author.contributions = {
          ...author.contributions,
          [date]: 1
        }
      }
    } else {
      author.contributions = {
        [date]: 1
      }
    }

    author.save()
    newPost.authorName = author.name;
    newPost.moduleName = mod.name;
    newPost.avatar = author.avatar;
    newPost.categoryName = uni.name;
    newPost.categoryAcronym = uni.acronym;
    mod.posts.unshift(newPost._id);

    mod.save();
    newPost
      .save()
      .then((post) => handleSuccess(res, buildSuccObject(post)))
      .catch((error) => handleError(res, buildErrObject(422, error.message)));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.updatePost = async (req, res) => {
  try {
    const post = await findPostById(req.params.postId);

    post.text = req.body.post.text;
    post.title = req.body.post.title;

    post.save();
    handleSuccess(res, buildSuccObject(post));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.deletePost = async (req, res) => {
  try {
    const post = await findPostById(req.params.postId);
    const mod = await findModuleyById(post.module);

    const post_idx = mod.posts.indexOf('' + post._id);

    if (post_idx > -1) {
      const temp = [];
      for (i = 0; i < mod.posts.length; i++) {
        if (i != post_idx) {
          temp.push(mod.posts[i]);
        }
      }
      mod.posts = temp;
    } else {
      handleError(
        res,
        buildErrObject(422, 'Post does not belong to ' + mod.name)
      );
      return;
    }

    mod.save();
    await deletePostFromDb(post._id);
    handleSuccess(
      res,
      buildSuccObject('Post delete and removed from ' + mod.name)
    );
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.getPostInfo = async (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .lean()
    .then((post) => {
      if (post) handleSuccess(res, buildSuccObject(post));
      else handleError(res, buildErrObject(422, 'Post not found'));
    })
    .catch((err) => handleError(res, buildErrObject(422, err.message)));
};

exports.upvote = async (req, res) => {
  try {
    const post = await findPostById(req.params.postId);
    const user = await findUserById(req.body._id);
    const targetUser = await findUserById(post.author)
    const downvote_idx = post.downvote.indexOf(user._id);
    const upvote_idx = post.upvote.indexOf(user._id);

    if (downvote_idx > -1) {
      const temp = [];
      for (i = 0; i < post.downvote.length; i++) {
        if (i != downvote_idx) {
          temp.push(post.downvote[i]);
        }
      }
      post.downvote = temp;
    }

    if (upvote_idx <= -1) {
      post.upvote.unshift(user._id);
      const data = {
        type: 'upvote',
        action: post._id
      }
      
      if ("" + targetUser._id != "" + user._id) {
        await notif.createNotification(data, targetUser, user._id)
      }
      
    } else {
      const temp = [];
      for (i = 0; i < post.upvote.length; i++) {
        if (i != upvote_idx) {
          temp.push(post.upvote[i]);
        }
      }
      post.upvote = temp;
    }

    
    post.nOfUpvote = post.upvote.length;
    post.save();
    handleSuccess(res, buildSuccObject(post));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.downvote = async (req, res) => {
  try {
    const post = await findPostById(req.params.postId);
    const user = await findUserById(req.body._id);

    const upvote_idx = post.upvote.indexOf(user._id);
    const downvote_idx = post.downvote.indexOf(user._id);

    if (upvote_idx > -1) {
      const temp = [];
      for (i = 0; i < post.upvote.length; i++) {
        if (i != upvote_idx) {
          temp.push(post.upvote[i]);
        }
      }
      post.upvote = temp;
    }

    if (downvote_idx <= -1) {
      post.downvote.unshift(user._id);
    } else {
      const temp = [];
      for (i = 0; i < post.downvote.length; i++) {
        if (i != downvote_idx) {
          temp.push(post.downvote[i]);
        }
      }
      post.downvote = temp;
    }

    post.nOfUpvote = post.upvote.length;
    post.save();
    handleSuccess(res, buildSuccObject(post));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.comment = async (req, res) => {
  try {
    const post = await findPostById(req.params.postId);
    const user = await findUserById(req.body._id);
    const targetUser = await findUserById(post.author)

    var comment = {
      author: user._id,
      text: req.body.text,
      authorName: user.name,
      avatar: user.avatar,
      date: new Date()
    };

    const data = {
      type: 'comment',
      action: post._id
    }

    const date = roundDate(new Date())
    if (user.contributions) {
      if (user.contributions[`${date}`]) {
        const data = {
          ...user.contributions
        }
        const n = user.contributions[`${date}`] + 1
        data[`${date}`] = n
        user.contributions = data
      } else {
        user.contributions = {
          ...user.contributions,
          [date]: 1
        }
      }
    } else {
      user.contributions = {
        [date]: 1
      }
    }

    if ("" + targetUser._id != "" + user._id) {
      await notif.createNotification(data, targetUser, user._id)
    }
    
    post.comments.push(comment);
    user.save()
    post.save();
    handleSuccess(res, buildSuccObject(post.comments));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const post = await findPostById(req.params.postId);
    const commentId = req.params.commentId;
    const temp = [];

    for (i = 0; i < post.comments.length; i++) {
      if (post.comments[i]._id != commentId) {
        temp.push(post.comments[i]);
      }
    }

    post.comments = temp;
    post.save();
    handleSuccess(res, buildSuccObject(post.comments));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.givePostRecommendations = async (req, res) => {
  try {
    const postList = await sortedPostUpvote();
    const temp = [];
    for (i = 0; i < 3; i++) {
      temp.push(postList[i]);
    }

    handleSuccess(res, buildSuccObject(temp));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.savePost = async (req, res) => {
  try {
    const user = await findUserById(req.body._id);
    const post = await findPostById(req.params.postId);

    if (user.saved.indexOf(post._id) > -1) {
      handleError(res, buildErrObject(422, 'User already saved this post'));
    } else {
      user.saved.unshift(post._id);
    }

    user.save();
    handleSuccess(res, buildSuccObject(user));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.unsavePost = async (req, res) => {
  try {
    const user = await findUserById(req.body._id);
    const post = await findPostById(req.params.postId);

    if (user.saved.indexOf(post._id) > -1) {
      user.saved = user.saved.filter(
        (element) => '' + element != '' + post._id
      );
    } else {
      handleError(res, buildErrObject(422, 'User does not save this Post'));
      return;
    }

    user.save();
    handleSuccess(res, buildSuccObject(user));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.getSavedPosts = async (req, res) => {
  try {
    const user = await findUserById(req.body._id);
    const temp = [];

    for (const element of user.saved) {
      const post = await findPostById(element);

      temp.push(post);
    }

    handleSuccess(res, buildSuccObject(temp));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.mostLiked = async (req, res) => {
  try {
    const postList = await sortedPostUpvote();
    const moduleId = req.params.moduleId;

    var temp = [];
    for (const element of postList) {
      if (element.module == moduleId) {
        temp.push(element);
      }
    }

    handleSuccess(res, buildSuccObject(temp));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.mostRecent = async (req, res) => {
  try {
    const postList = await sortedPostDate();
    const moduleId = req.params.moduleId;

    var temp = [];
    for (const element of postList) {
      if (element.module == moduleId) {
        temp.push(element);
      }
    }

    handleSuccess(res, buildSuccObject(temp));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};

exports.mostDiscussed = async (req, res) => {
  try {
    const postList = await sortedPostComments();
    const moduleId = req.params.moduleId;

    var temp = [];
    for (const element of postList) {
      if (element.module == moduleId) {
        temp.push(element);
      }
    }

    handleSuccess(res, buildSuccObject(temp));
  } catch (err) {
    handleError(res, buildErrObject(422, err.message));
  }
};
