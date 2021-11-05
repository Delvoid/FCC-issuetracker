const mongoose = require('mongoose')
const IssueSchema = require('./IssueSchema')
const { Schema } = mongoose

const ProjectSchema = new Schema({
  name: { type: String, required: true },
  issue: [IssueSchema],
})

module.exports = model('Project', ProjectSchema)
