const mongoose = require('mongoose')

const Schema = new mongoose.Schema(
  {
    queries: {
      type: Number,
      required: true,
      default: 0
    },
    blacklists: {
      type: Number,
      required: true,
      default: 0
    }
  },
  {
    timestamps: true
  }
)

module.exports = Schema
