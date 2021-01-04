var express = require('express');
var memeIO = express.Router();

const mongoose = require('mongoose');
const Meme = require('../models/memeSchema');

const fileUpload = require('express-fileupload');
//const { default: MemeCreator } = require('../../OMM/src/components/MemeCreator/MemeCreator');
memeIO.use(fileUpload());

memeIO.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});



memeIO.get('/get-memes', (req, res) => {

    Meme.find({}, function(err, docs) {
        if (err)
            return res.status(500).send(err);

        res.json({ code: 200, docs })
    })

});

memeIO.post('/upload', (req, res) => {
    console.log(req);
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;
    const fileName = req.files.sampleFile.name;
    const path = __dirname + '/public/uploadedImages/' + fileName;

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path, function(err) {
        if (err)
            return res.status(500).send(err);

        res.send('File uploaded!');
    });
});




memeIO.post("/save-meme", (req, res) => {

    const newMeme = Meme.create({
        upper: req.body.upper,
        lower: req.body.lower,
        url: req.body.url
    }).catch((err) => {
        // An error happened while inserting
    });

    res.json({
        code: 201,
        message: 'saved'
    })

});

module.exports = memeIO;