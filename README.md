# kanban-app
A KanBan swim lane application based on BackBoneJS and MarionetteJS


## Core framework Concepts

#### BackBoneJS
     https://backbonejs.org

#### MarionetteJS
     https://marionettejs.com/docs/current/

#### Jquery
     https://api.jquery.com

#### Underscore
     https://underscorejs.org/


## Testing Framework and tools

#### MochaJS
     https://mochajs.org/

#### ChaiJS
     https://chaijs.com/


## Mocked Server

#### json-server
     https://www.npmjs.com/package/json-server


# Running Program

- Copy url:- https://github.com/sajalshres/kanban-app.git
- Clone into a directory.After cloning you will get a similar folder structure like this:
- kanban-app

 ┣ app  
 ┃ ┣ collections  
 ┃ ┣ models  
 ┃ ┣ services  
 ┃ ┣ templates  
 ┃ ┣ views  
 ┃ ┗ index.js  
 ┣ backend  
 ┃ ┗ api  
 ┃ ┃ ┣ api  
 ┃ ┃ ┣ backendapi  
 ┃ ┃ ┣ manage. py  
 ┃ ┃ ┗ requirements.txt  
 ┣ public  
 ┃ ┣ css  
 ┃ ┣ bundle.js  
 ┃ ┗ index.html  
 ┣ test  
 ┃ ┣ frontend_tests  
 ┃ ┗ model.tests.js  
 ┣ .gitignore  
 ┣ README. md  
 ┣ db.json  
 ┣ docker-compose.yml
 ┣ dockerfile    
 ┣ package-lock.json  
 ┣ package.json  
 ┗ webpack.config.js  

- Open kanban-app directory and open command prompt or powershell(for windows) or terminal(linux)
- Type following code:
  * npm install
  * node_modules/.bin/json-server --watch db.json
- Open up a new terminal and type:
  * npm start
- For Testing:
  * npm run test 


## Backend

Backend is built using django (3.1) and  django rest framework (3.11.1).




## Installing Backend

  
__Make sure you have docker installed.__

Goto root folder called kan-ban app.
Run the following code:

    `docker-compose up`

By default, the server will be running on ***localhost:5555/api/***

 - User related queries on *localhost:5555/api/user/*
 - Board related queries on *localhost:5555/api/board/*
 - Todo related queries on *localhost:5555/api/todo/*
 - Item related queries on *localhost:5555/api/item/*
