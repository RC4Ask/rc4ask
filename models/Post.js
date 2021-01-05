const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    upvote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    downvote: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
    ],
    nOfUpvote: {
      type: Number
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    authorName: {
      type: String
    },
    comments: [
      {
        author: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
        },
        text: String,
        date: {
          type: Date
        },
        authorName: {
          type: String
        },
        avatar: {
          type: String
        }
      }
    ],
    module: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Module',
      required: true
    },
    moduleName: {
      type: String
    },
    avatar: {
      type: String
    }, 
    categoryName: {
      type: String
    },
    categoryAcronym: {
      type: String
    },
    date: {
      type: Date
    }
  }
)

module.exports = mongoose.model('Post', PostSchema)
