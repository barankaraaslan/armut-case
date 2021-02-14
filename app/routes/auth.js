const express = require('express')
const router = express.Router()

const bcrypt = require('bcrypt');
const db = require('../db')

async function logAndRespond (req, res, collection, message) {
  const response = await collection.insertOne({
    user: {
      username: req.body.username,
      password: req.body.password
    },
    message: message
  })
  if (response.result.ok === 1) {
    res.json(message)
  } else {
    console.error('logging error', req, response)
  }
}

router.post('/signup', async function (req, res, next) {
  const mongoClient = db.get()
  const database = mongoClient.db('armut')
  const userCollection = database.collection('users')
  const logAuthCollection = database.collection('log_auth')

  let result
  if (!(req.body.username && req.body.password)) {
    logAndRespond(req, res, logAuthCollection, {success:false, message:'Send both credentials'})
  } else {
    result = await userCollection.findOne({
      username: req.body.username
    })
    if (result) {
      logAndRespond(req, res, logAuthCollection, {success:false, message:'already registered'})
    } else {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(req.body.password, salt);

      result = await userCollection.insertOne({ 
        username: req.body.username, 
        password: hashedPassword,
      })

      if (result.insertedCount === 1) {
        logAndRespond(req, res, logAuthCollection, {success:true, message:'Signed Up'})
      } else {
        logAndRespond(req, res, logAuthCollection, {success:false, message:'Error in registering'})
      }
    }
  }
})

router.post('/login', async function (req, res) {
  const mongoClient = db.get()
  const database = mongoClient.db('armut')
  const userCollection = database.collection('users')
  const logAuthCollection = database.collection('log_auth')

  if (!(req.body.username && req.body.password)) {
    // Not enough info
    logAndRespond(req, res, logAuthCollection, {success:false, message:'Send both credentials}'})
    return
  } 
  if (req.session.username === req.body.username) {
    // Already logged in 
    logAndRespond(req, res, logAuthCollection, {success:false, message:'Already Logged in'})
    return
  }
  const response = await userCollection.findOne({
    username: req.body.username,
  })
  if (response) {
    if (await bcrypt.compare(req.body.password, response.password)) {
      // User exists and provided password is correct
      req.session.username = req.body.username
      logAndRespond(req, res, logAuthCollection, {success:true, message:'Logged in'})
      return
    } 
  } 
  // User does not exist or password is invalid
  logAndRespond(req, res, logAuthCollection, {success:false, message:'Invaild Credentials'})
})

router.post('/logout', function (req, res) {
  const mongoClient = db.get()
  const database = mongoClient.db('armut')
  const logAuthCollection = database.collection('log_auth')

  if (!req.session.username) {
    logAndRespond(req, res, logAuthCollection, {success:false, message:'already logged out'})
  } else {
    req.session.username = null
    logAndRespond(req, res, logAuthCollection, {success:true, message:'logged out'})
  }
})

module.exports = router
