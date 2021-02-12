var express = require('express');
var memeIO = express.Router();
var multer = require("multer");

var fs = require('fs');
var path = require('path');
const captureWebsite = require('capture-website');

const mongoose = require('mongoose');
const Meme = require('../models/memeSchema');
const Template = require('../models/templateSchema');
var Jimp = require('jimp');


var storage = multer.diskStorage({
    destination: './public/images',
    filename: function(req, file, cb) {
        //req.body is empty...
        //How could I get the new_file_name property sent from client here?
        if (req.headers.type === 'meme') {
            cb(null, (req.headers.memetitle + '.png'));
        } else {
            cb(null, file.originalname);
        }

    }
});

var upload = multer({ storage: storage });


memeIO.use(function(req, res, next) {
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

//get meme by title
memeIO.get('/get-meme', (req, res) => {
    Meme.find({ title: req.body.title }, function(err, docs) {
        if (err) {
            return res.status(400).send(err);
        }
        res.json({ docs })
    })
});

//create a meme with single upper and lower text
memeIO.post('/create-simple-meme', (req, res) => {
    const url = "http://localhost:3030/images/memes/" + req.body.title + ".png";
    Jimp.read(req.body.url)
        .then(image => {
            Jimp.loadFont(Jimp.FONT_SANS_32_WHITE).then(font => {
                //upper text
                image.print(font, image.bitmap.width / 2, 10, req.body.upper)


                .print(font, image.bitmap.width / 2, image.bitmap.height - 30, req.body.lower)
                    .write("public/images/memes/" +
                        req.body.title + ".png");

                //save the meme to the data base
                const newMeme = new Meme({
                    title: req.body.title,
                    url: url,
                    isPublic: true,
                    likes: 20
                })
                newMeme.save();
                return res.json({ newMeme })
            });
        })
        .catch(err => {
            return res.json({ code: 500, err })
        });
});

//create a meme with defined textboxes
memeIO.post('/create-meme', (req, res) => {
    const url = "http://localhost:3030/images/memes/" + req.body.title + ".png";
    Jimp.read(req.body.url)
        .then(image => {
            req.body.textBoxes.forEach(textBox => {
                Jimp.loadFont(Jimp.FONT_SANS_12_BLACK).then(font => {
                    //upper text
                    image.print(font, 10, 10, 'Hello world!')
                        .print(font, 10, 10, {
                                text: "Hallo"
                            }, 0,
                            1000)
                        .print(font, textBox.x, textBox.y, {
                                text: textBox.text
                            }, textBox.maxWidth,
                            textBox.minHeight)
                })

            });
            image.write("public/images/memes/" +
                req.body.title + ".png");
            //save the meme to the data base
            const newMeme = new Meme({
                title: req.body.title,
                url: url,
                isPublic: true,
                likes: 20
            })
            newMeme.save();
            return res.json({ newMeme })
        })
        .catch(err => {
            return res.json({ code: 500, err })
        });
});


// get all memes saved in the database
memeIO.get('/get-memes-by', (req, res) => {
    let likes_min;
    let likes_max;
    let searchTerm;
    let creationDate_earliest;
    let creationDate_latest;

    //apply default values if the search params are not defined in the request
    req.body.likes_min ? likes_min = req.body.likes_min : likes_min = 0;
    req.body.likes_max ? likes_max = req.body.likes_max : likes_max = 100;
    req.body.searchTerm ? searchTerm = req.body.searchTerm : searchTerm = '.*';
    req.body.creationDate_earliest ? creationDate_earliest = req.body.creationDate_earliest : creationDate_earliest = '1970-01-01T00:00:00.000Z';
    req.body.creationDate_latest ? creationDate_latest = req.body.creationDate_latest : creationDate_latest = Date.now().toString();
    console.log(creationDate_earliest, creationDate_latest);
    Meme.find({
            $and: [{
                likes: { $gt: likes_min, $lt: req.body.likes_max },
                title: { $regex: req.body.searchTerm },
                creationDate: { $gt: Date.parse(creationDate_earliest), $lt: Date.parse(creationDate_latest) },
            }]
        },
        function(err, docs) {
            if (err)
                return res.status(500).send(err);
            res.json({ docs })
        })
});

// get all memes saved in the database
memeIO.get('/get-memes', (req, res) => {
    Meme.find({}, function(err, docs) {
        if (err)
            return res.status(500).send(err);
        res.json({ code: 200, docs })
    })
});

memeIO.get('/get-templates', (req, res) => {
    Template.find({}, function(err, docs) {
        if (err)
            return res.status(500).send(err);
        console.log(docs);
        res.json({ code: 200, docs })
    })
});



memeIO.post("/save-template", async(req, res) => {
    let title = req.body.title + ".png";
    let url;
    if (!req.body.internetSource) { //save base64 string to file
        let base64String = req.body.url;
        let base64Image = base64String.split(';base64,').pop();
        url = "http://localhost:3030/images/" + title;
        fs.writeFile('public/images/' + title, base64Image, { encoding: 'base64' }, function(err) {
            if (err) console.log(err);
        })
    } else { //keep internet address
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
});


memeIO.post("/webshot", async(req, res) => {
    let url = req.body.url;
    let shortUrl = url.replace(/(^http[s]?:\/\/)|[.\/\\]/ig, '').slice(0, 20) + '.png';
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

memeIO.post("/save-meme", type, async(req, res) => {
    console.log(req.body)
    console.log(req.file);
});

memeIO.post('/upload', upload.single("file"), async(req, res) => {
    let url;
    //upload generated meme
    if (req.headers.type === 'meme') {
        url = "http://localhost:3030/images/" + req.headers.memetitle + '.png';
        const newMeme = {
            title: req.headers.memetitle,
            url: url,
            creator: req.headers.author,
            isPublic: req.headers.isPublic,
            creationDate: Date.now(),
        }
        Meme.create(newMeme, (err, item) => {
            if (err)
                console.log(err)
            else {
                item.save();
                res.send(url);
            }
        })
    } else { //upload template
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