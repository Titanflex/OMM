var express = require('express');
var memeIO = express.Router();
var multer = require("multer");
var upload = multer({ dest: "../server/public/images/" });

var fs = require('fs');
var path = require('path');
const captureWebsite = require('capture-website');

const mongoose = require('mongoose');
const Meme = require('../models/memeSchema');
const template = require('../models/templateSchema');




const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

memeIO.use(function (req, res, next) {
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
    Meme.find({}, function (err, docs) {
        if (err)
            return res.status(500).send(err);

        res.json({ code: 200, docs })
    })
});

/* Get public memes data */
memeIO.get('/get-public-memes', auth, (req, res) => {
    Meme.find({ isPublic: true }, function (err, docs) {
        if (err)
            return res.status(500).send(err);

        res.json({ code: 200, docs })
    })
})


memeIO.post('/upload', upload.array("files", 12), async (req, res) => {
    console.log(req.files)
    console.log(req.files[0])


    if (req.body.fileImage === null) {
        return
    }

    var uploadedTemplate = {
        uploader: "To be done",
        templateName: req.files[0].filename,
        img: {
            data: fs.readFileSync(path.join('../server/public/images/' + req.files[0].filename)),
            contentType: req.files[0].mimetype
        }
    }

    console.log(fs.readFileSync(path.join('../server/public/images/' + req.files[0].filename)))

    template.create(uploadedTemplate, (err, item) => {
        if (err) {
            console.log(err)
        } else {
            item.save();
            res.send([req.files[0].filename]);

        }
    })
    //console.log(meme.image.toString("base64"));
    /*try{
        const newMeme = await meme.save()
        res.redirect(`/`)
    }catch(err){
        console.log("Error:", err)
    }

*/
    /*console.log(req.files);
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }
    console.log("req2: ", req.body.url);
    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.form;
    console.log("req"+req);
    console.log("reqfiles"+req.formData.name);
    const fileName = req.files.sampleFile.name;
    const path = __dirname + '/public/uploadedImages/' + fileName;
    console.log(path);

    // Use the mv() method to place the file somewhere on your server
    sampleFile.mv(path, function (err) {
      console.log(path);

      res.send('File uploaded!');
    });*/

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