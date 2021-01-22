var express = require('express');
var memeIO = express.Router();
var multer = require("multer");

var fs = require('fs');
var path = require('path');
const captureWebsite = require('capture-website');

const mongoose = require('mongoose');
const Meme = require('../models/memeSchema');
const template = require('../models/templateSchema');


var storage = multer.diskStorage(
    {
        destination: './public/images',
        filename: function (req, file, cb) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            cb(null, file.originalname);
        }
    }
);

var upload = multer({ storage: storage });

const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

memeIO.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,author,templateName');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

memeIO.get('/get-memes', (req, res) => {
    Meme.find({}, function (err, docs) {
        if (err)
            return res.status(500).send(err);

        res.json({ code: 200, docs })
    })
});



memeIO.post('/upload', upload.single("file"), async (req, res) => {
    let url = "http://localhost:3030/images/" + req.file.originalname
    var uploadedTemplate = {
        uploader: req.body.author,
        templateName: req.body.templateName,
        url: url
    }
    template.create(uploadedTemplate, (err, item) => {
        if (err)
            console.log(err)
        else {
            item.save();
            res.send(url);
        }
    })
});

memeIO.post("/webshot", (req, res) => {
    let url = req.body.url;
    let shortUrl = url.replace(/(^http[s]?:\/\/)|[.\/\\]/ig, '') + '.png';
    (async () => {
        await captureWebsite.file(url, '../server/public/images/' + shortUrl).then(() => {
            console.log("screenshot is saved");
            res.send("todo")
        }).catch((err) => console.log(err));
    })();



});


memeIO.post("/save-meme", (req, res) => {
    console.log(req.body)
    const newMeme = Meme.create({
        title: req.body.title,
        upper: req.body.upper,
        lower: req.body.lower,
        url: req.body.url,
        creator: req.body.creator,
        isPublic: req.body.isPublic,
        creationDate: req.body.creationDate,
    }).catch((err) => {
        // An error happened while inserting
    });

    res.json({
        code: 201,
        message: 'saved'
    })

});

module.exports = memeIO;