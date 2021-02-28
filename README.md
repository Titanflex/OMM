# Online Multimedia Group Project: Meme Generator

## Team Members

- Mari Kruse
- Vera Volk
- Felix Grelka
- Tabea Blenk


## Installation and SetUp Instructions

### Prerequisites
- Docker is installed
- Works best in Google Chrome (Version 88.0.4324.190)


### With Docker
`cd <root folder of project>`

`docker-compose build`

`docker-compose up`

`docker-compose build`

`docker-compose exec -T mongo`

`mongorestore --drop`


### Without Docker
You will need `node` and `npm` installed globally on your machine. 
#### DataBase

- change 
`"scripts": {
        "start": "node ./bin/www",
        "poststart": "start mongo"
    },`
    
    in OMMExpressApp/package.json to 
    
    for Windows:
`"scripts": {
        "prestart": "start mongod && mongorestore --drop -d memes_db ../dump/memes_db",
        "start": "node ./bin/www",
        "poststart": "start mongo"
    },`
    
    for Mac:
    `"scripts": {
            "prestart": "mongorestore --drop -d memes_db ../dump/memes_db",
            "start": "node ./bin/www",
            "poststart": "start mongo"
        },`
    
- change
`mongoose.connect('mongodb://mongo:27017/memes_db', { useNewUrlParser: true, useUnifiedTopology: true });`
 
 in OMMExpressApp/app.js to (Windows)
 
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

