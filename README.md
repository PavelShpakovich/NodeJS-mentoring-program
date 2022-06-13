# Node.js Global Mentoring Program
## About the project
--------------------
RESTful API web server
## How To Run
-------------
`npm run start`
## Endpoints
* /users/ :
  * Method: POST
    * Description: Create a new user.
    * Body: login, password, age
  * Method: GET
    * Description: Return all users data
    * Query string: loginSubstring, limit
* /users/:id
  * Method: GET
    * Description: Return a user data
  * Method: DELETE
    * Description: Delete a user data from the database
  * Method: PUT
    * Description: Change a user data in the database
    * Body: login, password, age