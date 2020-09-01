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


### Installing Backend

 - First, create a virtual environment using virtualenv or venv.
 - Activate your virtual environment and go inside kanban-app    
   directory.
 - Then, install the requirements in your environment using:

	`pip install -r backend/api/requirements.txt`


	After installation make sure you migrate the app using

    `python manage.py makemigrations`
    `python manage.py migrate`
	
 - Now you can run server on port 8080 (or in any given port number) by:

	`python manage.py runserver 8080`

 - You can create superuser using:

	 `python manage.py createsuperuser`
 

	and then add other users through the django admin web interface. 

	 OR,

	 you can directly create a user by sending POST request with username and password to localhost:8080/api/user
