const Job = require('../models/job')
const Post = require('../models/post')

async function createJob(req, res) {
  if (!req.user.company) return res.sendStatus(403)

  const {title, location, role} = req.body

  if (!title || !location || !role) return res.sendStatus(400)

  const job = await Job.create({user: req.user._id, title, location, role})

  res.json(job)
}

async function removeJob(req, res) {
  const {jobId} = req.body

  const job = await Job.findById(jobId)

  if (!job || job.user != req.user._id) {
    res.json({
      error: 'an error occurred'
    })
    return
  }

  await Job.findByIdAndRemove(jobId)

  res.json({
    success: 'Successfully deleted the job'
  })
}

async function getJobs(req, res) {
  const {title, location, role} = req.query

  const options = {}

  if (title) options.title = new RegExp(title, 'i')
  if (location) options.location = new RegExp(location, 'i')
  if (role) options.role = new RegExp(role, 'i')

  const jobs = await Job.find(options).sort({_id: -1}).populate('user')
  res.json(jobs)
}

module.exports = {
  createJob,
  removeJob,
  getJobs
}
