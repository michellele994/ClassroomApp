# Sch00led App
Sch00l App is a class management app. Sch00led allows users to create classes or join classes created by other users. As instructors, users can post assignments,grade assignments and see all previous assignment submissions along with the students who have submitted the assignement. As students, users can submit a link and a comment for their assignments and can see their last submission for that specific assignment. Sch00l aims to solve the need for a simpler/concise classroom management system where everything needed can be accessed in one platform.

![Demo gif](./public/assets/imgs/schoolApp.gif)
* [Live Demo](https://sch00led.herokuapp.com/)
* [Video Demo](https://youtu.be/scpvt3I9q3I)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites
1. Install Node.js  (https://nodejs.org/en/download/)
2. Install MySQL (https://www.mysql.com/downloads/)

### Installing
1. Clone the github repo using command line:
```
git clone https://github.com/michellele994/ClassroomApp.git
``` 
2. Using command line go to the ClassroomApp directory
```
cd ClassroomApp
```
3. Reset Database: Copy the schema,in the db folder,paste it into your desired mysql interface/command line.
4. Once in the ClassroomApp directory install the package.json
```
npm install
```
5. Run the application
```
node server.js
```
6. If successfull you should see the following message on you command line, 
```
App listening on PORT 8080
```

## Running the tests

1. Go to ClassroomApp directory run in command line
```
npm test
```

## Deployment
Follow Heroku's deployment instructions
* https://devcenter.heroku.com/articles/git
* Add JawsDB MySQL add-on

## Built With
* [Handlebars](http://handlebarsjs.com/) -Templating language used
* [Sequelize](http://docs.sequelizejs.com/) - Promised-based ORM 
* [Express](http://expressjs.com/) - Web framework used
* [Mocha](https://mochajs.org/) - Used as testing framework
* [chai](http://www.chaijs.com/) - Assertion library paired with Mocha for testing

## New Technologies Used

## Authors
* **Michelle Le** - *Team Lead* - [GitHub](https://github.com/michellele994)
* **Brandon Haines** - *Team:Front-end* - [GitHub](https://github.com/bhaines3)
* **Ernesto Samaniego** - *Team:Front-end* - [GitHub](https://github.com/ernesto13)
* **Perla Ballesteros** - *Team:Front-end/Back-end* - [GitHub](https://github.com/perlaballesteros)

## Acknowledgments
* BootcampSpot
* Classroom Sequelize Examples
