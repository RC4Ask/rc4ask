import axios from 'axios';
import { setAlert } from './alert';
import {
  GET_POSTS_FROM_MODULE,
  GET_POSTS_RECOMMENDATIONS,
  GET_MOST_RECENT_POSTS,
  GET_MOST_LIKED_POSTS,
  GET_MOST_DISCUSSED_POSTS,
  GET_SAVED_POSTS,
  GET_POSTS_BY_USER,
  POST_ERROR,
  UPDATE_VOTES,
  DELETE_POST,
  ADD_POST,
  UPDATE_POST,
  GET_POST,
  ADD_COMMENT,
  REMOVE_COMMENT,
} from './types';

// Get posts from a module
export const getPostsFromModule = (modId) => async (dispatch) => {
  try {
    const res = await axios.get(`/modules/posts/${modId}`);

    dispatch({
      type: GET_POSTS_FROM_MODULE,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get most recent posts
export const getMostRecentPosts = (moduleId) => async (dispatch) => {
  try {
    const res = await axios.get(`/filters/most-recent/${moduleId}`);
    dispatch({
      type: GET_MOST_RECENT_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get most liked posts
export const getMostLikedPosts = (moduleId) => async (dispatch) => {
  try {
    const res = await axios.get(`/filters/most-liked/${moduleId}`);

    dispatch({
      type: GET_MOST_LIKED_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get most discussed posts
export const getMostDiscussedPosts = (moduleId) => async (dispatch) => {
  try {
    const res = await axios.get(`/filters/most-discussed/${moduleId}`);

    dispatch({
      type: GET_MOST_DISCUSSED_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get posts recommendation
export const getPostsRecommendations = () => async (dispatch) => {
  try {
    const res = await axios.get(`/posts/recommendations`);

    dispatch({
      type: GET_POSTS_RECOMMENDATIONS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get saved posts
export const getSavedPosts = () => async (dispatch) => {
  try {
    const res = await axios.get(`/posts/saved`);

    dispatch({
      type: GET_SAVED_POSTS,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add post
export const addPost = (formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(`/posts/add`, formData, config);

    dispatch({
      type: ADD_POST,
      payload: res.data,
    });

    dispatch(setAlert('Post Created', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Update post
export const updatePost = (formData, postId) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.post(`/posts/edit/${postId}`, formData, config);

    dispatch({
      type: UPDATE_POST,
      payload: { post: res.data, id: postId },
    });

    dispatch(setAlert('Post Updated', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete post
export const deletePost = (id) => async (dispatch) => {
  try {
    await axios.delete(`/posts/delete/${id}`);

    dispatch({
      type: DELETE_POST,
      payload: id,
    });

    dispatch(setAlert('Post Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Upvote
export const upvotePost = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/posts/upvote/${id}`);

    dispatch({
      type: UPDATE_VOTES,
      payload: { id, upvote: res.data.upvote, downvote: res.data.downvote },
    });
  } catch (err) {
    console.log(err.response.data);
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Downvote
export const downvotePost = (id) => async (dispatch) => {
  try {
    const res = await axios.put(`/posts/downvote/${id}`);

    dispatch({
      type: UPDATE_VOTES,
      payload: { id, upvote: res.data.upvote, downvote: res.data.downvote },
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get post
export const getPost = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/posts/${id}`);

    dispatch({
      type: GET_POST,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Add Comment
export const addComment = (postId, formData) => async (dispatch) => {
  const config = {
    headers: {
      'Content-Type': 'application/json',
    },
  };

  try {
    const res = await axios.put(`/posts/comment/${postId}`, formData, config);

    dispatch({
      type: ADD_COMMENT,
      payload: res.data,
    });

    dispatch(setAlert('Comment Added', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Delete Comment
export const deleteComment = (postId, commentId) => async (dispatch) => {
  try {
    const res = await axios.delete(`/posts/${postId}/${commentId}`);

    dispatch({
      type: REMOVE_COMMENT,
      payload: commentId,
    });

    dispatch(setAlert('Comment Removed', 'success'));
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get post by user
export const getPostsByUser = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/users/posts/${id}`);

    dispatch({
      type: GET_POSTS_BY_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};

// Get post by current user
export const getPostsByCurrentUser = () => async (dispatch) => {
  try {
    // console.log(id);
    const res = await axios.get(`/users/posts`);

    // console.log(res.data);
    dispatch({
      type: GET_POSTS_BY_USER,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: POST_ERROR,
      payload: { msg: err.response.statusText, status: err.response.status },
    });
  }
};
