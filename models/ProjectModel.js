const mongoose = require('mongoose')
const IssueModel = require('./IssueModel')

const Schema = mongoose.Schema

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  issues: [
    {
      type: Schema.Types.Mixed,
      ref: 'Issue',
    },
  ],
})

module.exports = mongoose.model('Project', ProjectSchema)
