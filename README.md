# Online Multimedia Group Project: Meme Generator

## Team Members

- Mari Kruse
- Vera Volk
- Felix Grelka
- Tabea Blenk


## Installation and SetUp Instructions

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

# API Documentation

The API Documentation for this application can be found here:

https://documenter.getpostman.com/view/14051059/TW76E5FW

## Implemented Features
| Feature  | Status |Points|
| -------------- | -------------------- |-----|
|Provide images stored locally on the server AND uploaded by the user|in progress|1|
|Provide images downloaded from ImgFlip API|done|1|
|Display available images/options to the user (slide show)|done|1|
||||
|Show the current state of the meme to th user|done|1|
|Provide two text inputs for top and bottom and corresponding coordinate fields to adjust the position. Additionally one textbox for an image title|in progress|1|
|Next / Previous button to cycle through templates (keep other settings, e.g. already entered text)|done|1|
||||
| |  sum |6 |
