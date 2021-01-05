const mongoose = require('mongoose')

const RequestSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true
    },
    module: {
      type: String,
      required: true
    },
    counter: [
      { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User'
      }
    ],
    description: {
      type: String
    },
    date: {
      type: Date
    }
  }
)

module.exports = mongoose.model('Request', RequestSchema)
