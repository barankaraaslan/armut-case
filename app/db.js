// db connection
const MongoClient = require('mongodb').MongoClient
const uri = process.env.DB_URI
let mongoClientarmut

function connect () {
  MongoClient.connect(
    uri,
    {
      useNewUrlParser: true
    },
    (err, client) => {
      if (err) throw err
      mongoClient = client
    }
  )
}

function close () {
  mongoClient.close()
}

function get () {
  return mongoClient
}

module.exports = {
  connect,
  get,
  close,
}
