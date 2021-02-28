# Online Multimedia Group Project: Meme Generator

## Team Members

- Mari Kruse
- Vera Volk
- Felix Grelka
- Tabea Blenk


## Installation and SetUp Instructions

### Prerequisites
Docker is installed
works best in Google Chrome (Version 88.0.4324.190)


### With Docker
`cd <root folder of project>`

`docker-compose build`

`docker-compose up`

`docker-compose exec -T mongo`

`mongorestore --drop`

To Visit App:

localhost:3000


### Without Docker
You will need `node` and `npm` installed globally on your machine. 
#### DataBase
Old:
- start mongod
- start mongo
- if not done so, create MongoDB database 'memes' locally with "use memes"
- in the folder "dump" you can find the meme database. 
    - Please restore the database on your machine with "mongorestore --nsInclude 'memes.*' --drop C:\Users\Mari\Documents\Studium\Master\OMM\OMM\dump". 
    - When updating the database use "mongodump --db DataBaseName" and put it to the shared folder.



Now:
- change 
`"scripts": {
        "start": "node ./bin/www",
        "poststart": "start mongo"
    },`
    in OMMExpressApp/package.json to
`"scripts": {
        "prestart": "start mongod && mongorestore --drop -d memes_db ../dump/memes_db",
        "start": "node ./bin/www",
        "poststart": "start mongo"
    },`
- change
`//mongoose.connect('mongodb://mongo:27017/memes_db', { useNewUrlParser: true, useUnifiedTopology: true });`
 in OMMExpressApp/app.js to
 `mongoose.connect('mongodb://localhost/memes_db', { useNewUrlParser: true, useUnifiedTopology: true });`
 
- No need to start db manually, it gets automatically generated and populated with the start of OMMExpressApp



#### Back-End

`cd OMMExpressApp`

Installation:

`npm install`

To Start Server:

`npm start`

#### Front-End

`cd OMM`

Installation:

`npm install`

To Start Server:

`npm start`

To Visit App:

`localhost:3000`

## API Documentation

The API Documentation for this application can be found here:

https://documenter.getpostman.com/view/14051059/TW76E5FW

## Implemented Features

See excel chart

https://drive.google.com/file/d/1JoyqjeFuu9qlxZFnYdSxD-fhD2grNw55/view?usp=sharing

