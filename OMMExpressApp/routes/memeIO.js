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
            console.log(item);
            item.save();
            res.send(url);
        }
    })
});

memeIO.post("/save-template", async (req, res) => {
    let title = req.body.title + ".png";
    let url;

    if(!req.body.internetSource){  //save base64 string to file
        let base64String = req.body.url;
        let base64Image = base64String.split(';base64,').pop();
        url = "http://localhost:3030/images/" + title;
        fs.writeFile('public/images/' + title, base64Image, {encoding:'base64'}, function (err){
            if(err) console.log(err);
        })
    }else{ //keep internet address
         url = req.body.url;
    }

    let newTemplate = {
        uploader: req.body.author,
        templateName: title,
        url: url,
    }
    template.create(newTemplate, (err, item) => {
        if (err)
            console.log(err)
        else {
            item.save();
            res.send(url);
        }
    })
})
memeIO.post("/webshot", async (req, res) => {
    let url = req.body.url;
    let shortUrl = url.replace(/(^http[s]?:\/\/)|[.\/\\]/ig, '') + '.png';
    let filePath = "http://localhost:3030/images/" + shortUrl;
    var screenshotTemplate = {
        uploader: req.body.author,
        templateName: shortUrl,
        url: filePath,
    }
    template.create(screenshotTemplate, (err, item) => {
        if (err)
            console.log(err)
        else {
            console.log(item);
            item.save();
        }
    })
    //make screenshot of provided url and save to public/images
    await captureWebsite.file(url, 'public/images/' + shortUrl).then(() => {
      console.log("savedFile")
    }).catch((err) => console.log(err));
    res.send(filePath);
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