const mongoose = require('mongoose')

const ModuleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    logo: {
      type: String,
    },
    posts: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Post' 
      }
    ],
    followers: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
      }
    ],
    nOfFollowers: {
      type: Number
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true
    },
    categoryAcronym: {
      type: String
    }
  }
)

module.exports = mongoose.model('Module', ModuleSchema)
