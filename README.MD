# Messaging service

All post requests require "Content-Type" header set to "application/json"

run 'docker-compose up' to start the service

run 'docker-compose -f docker-compose-test up' to test the service. After testing, remove the containers and volumes with 'docker-compose -f docker-compose-test.yml rm -fsv'. Some test cases require empty database in order to succeed 

## Sign up
POST /signup 

example request body:

{
    "username": "guest",
    "password": "1234",
}

## Login

POST /signup 

example request body:

{
    "username": "guest",
    "password": "1234",
}

## Logout

POST /logout

Requires login

no need for a request body

## Send Message

POST /sendMessage

Requires login

example request body:

{
    "peer": "username",
    "message": "message",
}

## Ban a User

POST /banUser 

Requires login

example request body:

{
    "peer": "guest",
}

## Unban a User

POST /unbanUser 

Requires login

example request body:

{
    "peer": "guest",
}

## View past messages 

GET /messages

Requires login

no need for request parameters
