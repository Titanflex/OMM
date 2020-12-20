# Online Multimedia Group Project: Meme Generator

## Team Members

- Mari Kruse
- Vera Volk
- Felix Grelka
- Tabea Blenk


## Installation and SetUp Instructions

### DataBase

- create MongoDB database 'memes' locally with "use memes"
- in the folder "dump" you can find the meme database. 
    - Please restore the database on your machine with "mongorestore --nsInclude 'memes.*' --drop C:\Users\Mari\Documents\Studium\Master\OMM\OMM\dump". 
    - When updating the database use "mongodump --db DataBaseName" and put it to the shared folder.


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


