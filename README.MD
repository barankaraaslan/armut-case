#Messaging service

All post requests require "Content-Type" header set to "application/json"

#Sign up

POST /signup 

example request body:

{
    "username": "guest",
    "password": "1234",
}

#Login

POST /signup 

example request body:

{
    "username": "guest",
    "password": "1234",
}

#Logout

POST /logout

Requires login

no need for a request body

#Send Message

POST /sendMessage

Requires login

example request body:

{
    "peer": "username",
    "message": "message",
}

#Ban a User

POST /banUser 

Requires login

example request body:

{
    "peer": "guest",
}

#Unban a User

POST /unbanUser 

Requires login

example request body:

{
    "peer": "guest",
}

#View past messages 

GET /messages

Requires login

no need for request parameters