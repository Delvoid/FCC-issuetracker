'use strict'
const mongoose = require('mongoose')
const IssueModel = require('../models/IssueModel')
const ProjectModel = require('../models/ProjectModel')

module.exports = function (app) {
  app
    .route('/api/issues/:project')

    .get(async (req, res) => {
      const project = req.params.project
      const { _id, open, issue_title, issue_text, created_by, assigned_to, status_text } = req.query

      const data = await ProjectModel.aggregate([
        { $match: { name: project } },
        { $unwind: '$issues' },
        _id != undefined ? { $match: { 'issues._id': _id } } : { $match: {} },
        open != undefined ? { $match: { 'issues.open': open } } : { $match: {} },
        issue_title != undefined
          ? { $match: { 'issues.issue_title': issue_title } }
          : { $match: {} },
        issue_text != undefined ? { $match: { 'issues.issue_text': issue_text } } : { $match: {} },
        created_by != undefined ? { $match: { 'issues.created_by': created_by } } : { $match: {} },
        assigned_to != undefined
          ? { $match: { 'issues.assigned_to': assigned_to } }
          : { $match: {} },
        status_text != undefined
          ? { $match: { 'issues.status_text': status_text } }
          : { $match: {} },
      ]).exec()
      if (!data) return res.json([])
      // return array of issues only
      const mappedData = data.map((item) => item.issues)
      res.json(mappedData)
    })

    .post(async (req, res) => {
      const project = req.params.project
      const { issue_title, issue_text, created_by, assigned_to, status_text } = req.body
      if (!issue_title || !issue_text || !created_by)
        return res.json({ error: 'required field(s) missing' })

      const newIssue = new IssueModel({
        issue_title: issue_title || '',
        issue_text: issue_text || '',
        created_on: new Date(),
        updated_on: new Date(),
        created_by: created_by || '',
        assigned_to: assigned_to || '',
        open: true,
        status_text: status_text || '',
      })
      try {
        // find project if exists
        const proj = await ProjectModel.findOne({ name: project })
        if (!proj) {
          const newProject = new ProjectModel({ name: project })
          newProject.issues.push(newIssue)
          await newProject.save()
          return res.json(newIssue)
        }

        proj.issues.push(newIssue)
        await proj.save()
        res.json(newIssue)
      } catch (error) {
        console.log(error)
        res.send('There was an error saving the post')
      }
    })

    .put(function (req, res) {
      let project = req.params.project
    })

    .delete(function (req, res) {
      let project = req.params.project
    })
}
