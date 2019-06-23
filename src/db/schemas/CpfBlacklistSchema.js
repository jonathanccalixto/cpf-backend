const mongoose = require('mongoose')

const Schema = new mongoose.Schema(
  {
    document: {
      type: String,
      required: true,
      trim: true
    },
    removedAt: {
      type: Date,
      default: null
    }
  },
  {
    timestamps: true
  }
)

module.exports = Schema
