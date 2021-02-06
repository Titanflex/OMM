var express = require('express');
var memeIO = express.Router();
var multer = require("multer");

var fs = require('fs');
var path = require('path');
const captureWebsite = require('capture-website');

const mongoose = require('mongoose');
const Meme = require('../models/memeSchema');
const Template = require('../models/templateSchema');


var storage = multer.diskStorage(
    {
        destination: './public/images',
        filename: function (req, file, cb) {
            //req.body is empty...
            //How could I get the new_file_name property sent from client here?
            if(req.headers.type === 'meme'){
                cb(null, (req.headers.memetitle + '.png'));
            }else{
                cb(null, file.originalname);
            }

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

memeIO.get('/get-templates', (req, res) => {
    Template.find({}, function (err, docs) {
        if (err)
            return res.status(500).send(err);
        console.log(docs);
        res.json({ code: 200, docs })
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
        templateName: req.body.title,
        url: url,
    }
    console.log(newTemplate);
    Template.create(newTemplate, (err, item) => {
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
    let shortUrl = url.replace(/(^http[s]?:\/\/)|[.\/\\]/ig, '').slice(0,20) + '.png';
    let filePath = "http://localhost:3030/images/" + shortUrl;
    var screenshotTemplate = {
        uploader: req.body.author,
        templateName: 'test',
        url: filePath,
    }
    Template.create(screenshotTemplate, (err, item) => {
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

var type = upload.single('blob');

memeIO.post("/save-meme", type, async (req, res) => {
    console.log(req.body)
    console.log(req.file);
});

memeIO.post('/upload', upload.single("file"), async (req, res) => {
    let url;
    //upload generated meme
   if(req.headers.type === 'meme'){
       url = "http://localhost:3030/images/" + req.headers.memetitle + '.png';
       const newMeme = {
           title: req.headers.memetitle,
           url: url,
           creator: req.headers.author,
           isPublic: req.headers.isPublic,
           creationDate: Date.now(),
       }
       Meme.create(newMeme, (err, item)=> {
           if (err)
               console.log(err)
           else {
               item.save();
               res.send(url);
           }
       })
   }else{ //upload template
       url = "http://localhost:3030/images/" + req.file.originalname;
       var uploadedTemplate = {
           uploader: req.headers.author,
           templateName: req.file.originalname,
           url: url
       }
       console.log(uploadedTemplate);
       Template.create(uploadedTemplate, (err, item) => {
           if (err)
               console.log(err)
           else {
               item.save();
               res.send(url);
           }
       })
   }

});

module.exports = memeIO;