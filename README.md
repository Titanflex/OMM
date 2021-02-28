# Online Multimedia Group Project: Meme Generator

## Team Members

- Mari Kruse
- Vera Volk
- Felix Grelka
- Tabea Blenk


## Installation and SetUp Instructions

### Prerequisites
Docker
Browser: Google Chrome (Version 88.0.4324.190)


### DataBase
Old:
- start mongod
- start mongo
- if not done so, create MongoDB database 'memes' locally with "use memes"
- in the folder "dump" you can find the meme database. 
    - Please restore the database on your machine with "mongorestore --nsInclude 'memes.*' --drop C:\Users\Mari\Documents\Studium\Master\OMM\OMM\dump". 
    - When updating the database use "mongodump --db DataBaseName" and put it to the shared folder.



New:
- No need to start db manually, it gets automatically generated and populated with the start of OMMExpressApp

You will need `node` and `npm` installed globally on your machine. 

### Back-End

`cd OMMExpressApp`

Installation:

`npm install`

To Start Server:

`npm start`

### Front-End

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
see project features checklist excel sheet
