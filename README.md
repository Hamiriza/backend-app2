# Backend Application 2

## This is to fulfill the following requirements

1. Main requirements

2. Advanced requirements

   1. Provide a complete user auth strategy(using token authentication, bearer scheme, jwt, bcrypt)
   2. Provide a complete logging strategy
   3. New requirement for the user instances. User needs to link to a list of "followers/following/friends"

## About the app

This backend app is created so that it provides RESTful HTTP API. it can execute different operations on resources.
The operation to be executed is defined by the HTTP verb:

| URL      | verb   | functionality                                                    |
| -------- | ------ | ---------------------------------------------------------------- |
| users/11 | GET    | fetches a single resource                                        |
| users    | GET    | fetches all resources in the collection                          |
| users    | POST   | creates a new resource based on the request data                 |
| users/11 | DELETE | removes the identified resource                                  |
| users/11 | PUT    | replaces the entire identified resource with the request data    |
| users/11 | Patch  | replaces a part of the identified resource with the request data |

1. index.js file purpose is to launch the application at the specified port(3003) with Node's built-in http object
2. app.js contains the main Express application and middleware loading
3. mongo.js is the file that was used to test the connection to mongodb before the app was built
4. .env contains all the environment URI that are needed during production or test, as well as the port being used
5. all mongoose models and schemas are located inside models folder with the appropriate naming (e.g user.js for user model)
6. all route handlers and controllers are located inside controllers folders with the appropriate naming (e.g users.js serving /api/users has methods to get,create,delete,update resources)
7. all tests related files are located inside tests folder
8. config.js inside utils folder is the file that determines which url/uri is gonna used according to the environment
9. logger.js inside utils folder provides the logging necessary for the middlewares and the execution of the application
10. middleware.js contains all the custom middlewares used on the app

## Start

1. npm install
2. npm start
3. The API will become available at http://localhost:3003
4. http://localhost:3003/api will display the available routes
5. http://localhost:3003/api/users will display all the users
6. http://localhost3003/api/users/:id will display a particular user with the related id
   ```json
   {
     "name": "Ramos",
     "dob": "1996-12-26T16:00:00.000Z",
     "address": "92 Jurong West",
     "description": "description here",
     "createdAt": "2022-09-09T08:04:26.263Z",
     "username": "ramos",
     "relationshipId": "621bf38a05e5c399c08736e8",
     "id": "631af38a05e5c933c09938d6"
   }
   ```
7. http://localhost3003/api/relationships will display all the relationships
8. http://localhost3003/api/relationships/:id will display a particular relationship with the user id in friends populated

## Making Requests

Some of the ways to make requests:

1. Postman desktop client
2. Visual Studio REST client
   1. example requests are provided in the requests folder
3. curl
   1. GET => curl http://localhost:3003
   2. POST => curl -d '{"name":"arash","dob":"1990-11-22","address":"Silvian Lane","description":"", "username":"arash", "password":"1234"}' -H "Content-Type: application/json" -X POST http://localhost:3003/api/users
   3. PUT => curl -d '{"name":"arash","dob":"1990-11-22","address":"Silvian Lane","description":""}' -H "Content-Type: application/json" -X PUT http://localhost:3003/api/users/:id
   4. DELETE => curl -X DELETE http://localhost:3003/api/users/:id
4. when making POST request. The following format is used for the dob property: year-m-d => 1978-3-25 with no leading zero

## Testing

1. To test all => npm test
2. To test a particular test cases => npm test -- -t "describe"

## Authentication & Authorization

Token authentication and password hashing are provided in the app. jsonwebtoken is used for the token verification and bcrypt is used for password verification. Bearer scheme is used to verify the user making the request and if the user has authorization to modify any friends(i.e add friend, delete friend)

1. Browser --> HTTP POST /api/login {username, password} --> backend
2. backend generates TOKEN that identifies user
3. Browser <-- TOKEN returned as message body <-- backend
4. user pressed button to add friend on frontend
5. Browser --> HTTP PUT /api/relationships/:relationshipId TOKEN in header --> backend
6. backend identifies user from the TOKEN
7. Browser <-- 201 created <-- backend

## Adding friend or deleting friend

1. the user must login by making POST request to /api/login with {username, password}
2. TOKEN will be generated for that user. TOKEN should be provided in the authorization header when making add friend or delete friend requests
3. delete request will need relationshipId in the url parameter and userId to delete in the body:

   ```json
   DELETE http://localhost:3003/api/relationships/631c8f6301f5f3b7c27956ce
   Content-Type: application/json
   Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI2MzFjOGY2MzAxZjVmM2I3YzI3OTU2ZDAiLCJpYXQiOjE2NjI4Nzc3MzAsImV4cCI6MTY2Mjg4MTMzMH0.fPA3jbWluqqnAb8uHOshieoYgpDOLilL2a7VXCIiG6Y

   {
      "userId":"631c90e401f5f3b7c27956db"
   }
   ```

4. put request will need relationshipId in the url parameter and userId to delete in the body:

   ```json
   PUT http://localhost:3003/api/relationships/631c8f6301f5f3b7c27956ce
   Content-Type: application/json
   Authorization: bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwiaWQiOiI2MzFjOGY2MzAxZjVmM2I3YzI3OTU2ZDAiLCJpYXQiOjE2NjI4Nzc3MzAsImV4cCI6MTY2Mjg4MTMzMH0.fPA3jbWluqqnAb8uHOshieoYgpDOLilL2a7VXCIiG6Y

   {
      "userId":"631c90e401f5f3b7c27956db"
   }
   ```
