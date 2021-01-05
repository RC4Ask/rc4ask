const mongoose = require('mongoose')

const CategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true
    },
    acronym: {
      type: String,
      required: true
    },
    logo: {
      type: String,
      required: true
    },
    overview: {
      type: String,
      required: true
    },
    website: {
      type: String,
      required: true
    }, 
    modules: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Module'
      }
    ]
  }
)

module.exports = mongoose.model('Category', CategorySchema)
