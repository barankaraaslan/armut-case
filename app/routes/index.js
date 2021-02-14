const express = require('express')
const router = express.Router()

const isLoggedIn = require('../util/auth').isLoggedIn

const db = require('../db')

router.post('/sendMessage', isLoggedIn, async function (req, res) {
  const mongoClient = db.get()
  const database = mongoClient.db('armut')
  const userCollection = database.collection('users')
  const messageCollection = database.collection('messages')
  const banCollection = database.collection('bans')
  let response
  // Invalid request body
  if (!(req.body.peer && req.body.message)) {
    res.json('invalid request body')
    return
  }
  // Check if reciever is self
  if (req.body.peer === req.session.username) {
    res.json({success:false, message:'Cant send message to yourself'})
    return
  }
  // Check if reciever exists
  response = await userCollection.findOne({
    username: req.body.peer,
  })
  if (!response) {
    res.json({success:false, message:'Cant send message, reciever doesnt exist'})
    return
  }
  // Check if reciever banned sender
  response = await banCollection.findOne({
    banner: req.session.username,
    bannee: req.body.peer
  })
  if (response) {
    res.json({success:false, message:'Cant send message, you banned your peer'})
    return
  }
  // or vice-versa
  response = await banCollection.findOne({
    banner: req.body.peer,
    bannee: req.session.username
  })
  if (response) {
    res.json({success:false, message:'Cant send message, you are banned'})
    return
  }
  // Finally, json message
  response = await messageCollection.insertOne(
    {
      sender: req.session.username,
      reciever: req.body.peer,
      message: req.body.message,
      timestamp: Date.now()
    }
  )
  // Message sent
  if (response.result.ok === 1) {
    res.json({success:true, message:'Sent message'})
  } else {
    // DB error
    res.json({success:false, message:'Couldnt send message'})
    console.error('Couldnt send message', response)
  }
})

router.post('/unbanUser', isLoggedIn,  async function (req, res) {
  const mongoClient = db.get()
  const database = mongoClient.db('armut')
  const userCollection = database.collection('users')
  const banCollection = database.collection('bans')
  let response

  // Chech request body
  if (!(req.body.peer)) {
    res.json({success:false, message:'invalid request body'})
    return
  }
  // Check if peer exists
  response = await userCollection.findOne(
    {
      username: req.body.peer
    }
  )
  if (!response)
  {
    res.json({success:false, message:'User doesnt exist'})
  }
  // Try to unban
  response = await banCollection.findOneAndDelete(
    {
      banner: req.session.username,
      bannee: req.body.peer
    }
  )
  if (response.ok === 1) {
    res.json({success:true, message:'UnBanned user'})
  } else {
    res.json({success:false, message:'Couldnt Unban user'})
    console.error('Couldnt Unban user', response)
  }
})

router.post('/banUser', isLoggedIn,  async function (req, res) {
  const mongoClient = db.get()
  const database = mongoClient.db('armut')
  const banCollection = database.collection('bans')
  const userCollection = database.collection('users')
  let response

  // Check request body
  if (!(req.body.peer)) {
    res.json({success:false, message:'invalid request body'})
  } 
   // Check if peer exists
  response = await userCollection.findOne(
    {
      username: req.body.peer
    }
  )
  if (!response)
  {
    res.json({success:false, message:'User doesnt exist'})
  }
  
  // Check If already banned
  response = await banCollection.findOne({
    banner: req.session.username,
    bannee: req.body.peer
  })
  if (response) {
    res.json({success:false, message:'Already banned'})
    return
  }

  // Try to ban
  response = await banCollection.insertOne(
    {
      banner: req.session.username,
      bannee: req.body.peer
    }
  )
  if (response.result.ok === 1) {
    res.json({success:true, message:'Banned user'})
  } else {
    res.json({success:false, message:'Couldnt ban user'})
    console.error('Couldnt ban user', response)
  }
})

router.get('/messages', isLoggedIn, async function (req, res) {
  const mongoClient = db.get()
  const database = mongoClient.db('armut')
  const collection = database.collection('messages')

  const cursor = await collection.find(
    {
      $or: [
        {
          sender: req.session.username
        },
        {
          reciever: req.session.username
        }
      ]
    }
  )
  res.json(await cursor.project({ _id: 0 }).toArray())
})
module.exports = router
