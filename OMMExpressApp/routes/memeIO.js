var express = require('express');
var memeIO = express.Router();

var multer = require("multer");
var fs = require('fs');

const auth = require('../middleware/auth')
const captureWebsite = require('capture-website');

const Meme = require('../models/memeSchema');
const Template = require('../models/templateSchema');

const puppeteer = require('puppeteer');


var storage = multer.diskStorage(
    {
        destination: './public/images',
        filename: function (req, file, cb) {
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

/* GET memeIO/get-memes */
/* Get all memes from the database */
memeIO.get('/get-memes', (req, res) => {
    Meme.find({}, function (err, docs) {
        if (err)
            return res.status(500).send(err);
        res.json({ code: 200, docs })
    })
});

/* GET /memeIO/get-templates */
/* Get all templates from the database */
memeIO.get('/get-templates', (req, res) => {
    Template.find({}, function (err, docs) {
        if (err)
            return res.status(500).send(err);
        res.json({ code: 200, docs })
    })
});

/* POST /memeIO/save-template */
/* Create new Template from URL */
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
    }else{ //keep internet address as url
         url = req.body.url;
    }

    let newTemplate = {
        uploader: req.body.author,
        templateName: req.body.title,
        url: url,
    }

    Template.create(newTemplate, (err, item) => {
        if (err)
            console.log(err)
        else {
            item.save();
            res.send(url);
        }
    })
})

/* POST /memeIO/webshot*/
/* Make Screenshot of provided website and save as template */
memeIO.post("/webshot", auth, async (req, res) => {
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
    //Make Screenshot and save image to URL
     await captureWebsite.file(url, 'public/images/' + shortUrl +'.png').then(() => {
        console.log("savedFile")
    }).catch((err) => console.log(err));
    res.send(filePath);

});

/* POST /memeIO/generate */
/* Generate image on server and save as Meme*/
memeIO.post("/generate", auth, async (req, res) => {
    let filePath = "http://localhost:3030/images/" + req.body.title + '.png';
    let uploader = req.body.author;
    let url = req.body.url;
    let authToken = req.header('x-auth-token');

    try {
        let data = {
            token: authToken,
            user: uploader,
        };
        const browser = await puppeteer.launch();       // run browser
        const page = await browser.newPage();// open new tab
        await page.goto(url);
        await page.evaluate((data) => {
            localStorage.setItem("generate", "true");
        });
        await page.goto(url);
        await page.waitForSelector('#memeContainer');
        //TODO set states
        const element = await page.$('#memeContainer');        // declare a variable with an ElementHandle
        await element.screenshot({path: 'public/images/' + req.body.title +'.png'});

        res.send(filePath);}
    catch (e) {
        res.status(400).json({ msg: e.message });
    }

    //TODO save as meme
});

/* POST /memeIO/upload */
/* upload meme/template to server (via FilePond) */
//TODO split function
memeIO.post('/upload', upload.single("file"), async (req, res) => {
    let url;

   if(req.headers.type === 'meme'){ //upload generated meme
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