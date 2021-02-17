var express = require('express');
var memeIO = express.Router();

var multer = require("multer");
var fs = require('fs');
var zip = require('express-zip');

const auth = require('../middleware/auth')
const captureWebsite = require('capture-website');

const Meme = require('../models/memeSchema');
const Template = require('../models/templateSchema');
var Jimp = require('jimp');

const puppeteer = require('puppeteer');


var storage = multer.diskStorage({
    destination: './public/images',
    filename: function(req, file, cb) {
        if (req.headers.type === 'meme') {
            cb(null, ('/memes/' + req.headers.memetitle + '.png'));
        } else {
            cb(null, ('/templates/' + file.originalname));
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

/* GET memeIO/get-memes */
/* Get all memes from the database */
memeIO.get('/get-memes', (req, res) => {
    Meme.find({}, function(err, docs) {
        if (err)
            return res.status(500).send(err);
        res.json({ code: 200, docs })
    })
});

/* GET /memeIO/get-templates */
/* Get all templates from the database */
memeIO.get('/get-templates', (req, res) => {
    Template.find({}, function(err, docs) {
        if (err)
            return res.status(500).send(err);
        res.json({ code: 200, docs })
    })
});

/* POST /memeIO/save-template */
/* Create new Template from URL */
memeIO.post("/save-template", async(req, res) => {
    let title = req.body.title + ".png";
    let url;
    if (!req.body.internetSource) { //save base64 string to file
        let base64String = req.body.url;
        let base64Image = base64String.split(';base64,').pop();
        url = "http://localhost:3030/images/templates/" + title;
        fs.writeFile('public/images/templates/' + title, base64Image, { encoding: 'base64' }, function(err) {
            if (err) console.log(err);
        })
    } else { //keep internet address as url
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
memeIO.post("/webshot", auth, async(req, res) => {
    let url = req.body.url;
    let shortUrl = url.replace(/(^http[s]?:\/\/)|[.\/\\]/ig, '').slice(0, 20) + '.png';
    let filePath = "http://localhost:3030/images/templates/" + shortUrl;

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
    await captureWebsite.file(url, 'public/images/templates/' + shortUrl + '.png').then(() => {
        console.log("savedFile")
    }).catch((err) => console.log(err));
    res.send(filePath);

});

/* POST /memeIO/generate */
/* Generate image on server and save as Meme*/
memeIO.post("/generate", auth, async(req, res) => {
    let filePath = "http://localhost:3030/images/meme/" + req.body.title + '.png';
    let uploader = req.body.author;
    let url = req.body.url;
    let authToken = req.header('x-auth-token');

    try {
        let data = {
            token: authToken,
            user: uploader,
        };
        const browser = await puppeteer.launch(); // run browser
        const page = await browser.newPage(); // open new tab
        await page.goto(url);
        //TODO
        /*await page.evaluate((data) => {
            localStorage.setItem("token", '');
            localStorage.setItem("user", '');
        });
        await page.goto(url);
        await page.waitForSelector('#memeContainer');

        const element = await page.$('#memeContainer');   */ // declare a variable with an ElementHandle
        await page.screenshot({ path: 'public/images/memes/' + req.body.title + '.png' });
        res.send(filePath);
    } catch (e) {
        res.status(400).json({ msg: e.message });
    }

    //TODO save as meme
});

/* POST /memeIO/upload */
/* upload meme/template to server (via FilePond) */
//TODO split function
memeIO.post('/upload', upload.single("file"), async(req, res) => {
    let url;

    if (req.headers.type === 'meme') { //upload generated meme
        url = "http://localhost:3030/images/memes/" + req.headers.memetitle + '.png';
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
        url = "http://localhost:3030/images/templates/" + req.file.originalname;
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

memeIO.post('/like-meme', (req, res) => {
    try{
    Meme.updateOne({ _id: req.body.id }, {$inc: {likes: 1}}, function(err) {
      
        return res.status(200)
    })
} catch (error) {
    return res.status(500).send(err)
}
});

memeIO.post('/dislike-meme', (req, res) => {
    try{
    Meme.updateOne({ _id: req.body.id }, {$inc: {likes: -1}}, function(err) {
      
        return res.status(200)
    })
} catch (error) {
    return res.status(500).send(err)
}
});

/* GET /memeIO/get-meme */
/* get meme by title as a png file */
memeIO.get('/get-meme', (req, res) => {
    Meme.find({ title: req.body.title }, function(err, docs) {
        if (err) {
            return res.status(500).send(err);
        }
        if (docs.length == 0) {
            res.status(500).send("There is no meme with this title")
        } else {
            if (fs.existsSync("public/images/memes/" + docs[0].title + ".png")) {
                res.download("public/images/memes/" + docs[0].title + ".png")
            } else {
                res.status(500).send("The meme does not exist in your local folder")
            }
        }
    })
});

/* POST /memeIO/create-simple-meme */
/* create simple meme with lower and upper text */
memeIO.post('/create-simple-meme', async(req, res) => {
    try {
        const url = "http://localhost:3030/images/memes/" + req.body.title + ".png";
        let image = await Jimp.read(req.body.url);
        image.resize(700, Jimp.AUTO);
        let font = await Jimp.loadFont('public/assets/impact.ttf/impact.fnt');
        let positionX_upper = Jimp.measureText(font, req.body.upper) < 400 ? (image.bitmap.width / 2) - (Jimp.measureText(font, req.body.upper) / 2) : (image.bitmap.width / 2) - 200;
        let positionX_lower = Jimp.measureText(font, req.body.lower) < 400 ? (image.bitmap.width / 2) - (Jimp.measureText(font, req.body.lower) / 2) : (image.bitmap.width / 2) - 200;

        //upper text
        image.print(font, positionX_upper, 30, req.body.upper, 400)
            //lower text
            .print(font, positionX_lower, image.bitmap.height - (Jimp.measureTextHeight(font, req.body.lower) + 30), req.body.lower, 400)
            //save meme
            .write("public/images/memes/" +
                req.body.title + ".png");

        //save the meme to the data base
        const newMeme = new Meme({
            title: req.body.title,
            url: url,
            isPublic: true,
            likes: 0
        })
        newMeme.save();
        res.json(newMeme);
    } catch (error) {
        return res.status(500).send(err)
    }
});

/* POST /memeIO/create-meme */
/* create meme with defined textboxes */
memeIO.post('/create-meme', async(req, res) => {
    try {
        const url = "http://localhost:3030/images/memes/" + req.body.title + ".png";
        let image = await Jimp.read(req.body.url);
        image = await image.resize(700, Jimp.AUTO);
        for (const textBox of req.body.textBoxes) {
            let font = await Jimp.loadFont(textBox.font ? textBox.font : 'public/assets/impact.ttf/impact.fnt')
            image.print(font, textBox.x, textBox.y, {
                    text: textBox.text
                }, textBox.maxWidth,
                textBox.maxHeight)
        };
        image.write("public/images/memes/" +
            req.body.title + ".png");
        //save the meme to the data base
        const newMeme = new Meme({
            title: req.body.title,
            url: url,
            isPublic: true,
            likes: 0
        })
        newMeme.save();
        return res.status(200).json(newMeme)
    } catch (error) {
        return res.status(500).send(error);
    }
});

/* GET /memeIO/get-memes-by */
/* get memes by given search parameters as zip file */
memeIO.get('/get-memes-by', (req, res) => {
    let likes_min;
    let likes_max;
    let searchTerm;
    let creationDate_earliest;
    let creationDate_latest;
    let maxFileNumber;

    //apply default values if the search params are not defined in the request
    req.body.likes_min ? likes_min = req.body.likes_min : likes_min = 0;
    req.body.likes_max ? likes_max = req.body.likes_max : likes_max = 100;
    req.body.searchTerm ? searchTerm = req.body.searchTerm : searchTerm = '.*';
    req.body.creationDate_earliest ? creationDate_earliest = req.body.creationDate_earliest : creationDate_earliest = '1970-01-01T00:00:00.000Z';
    req.body.creationDate_latest ? creationDate_latest = req.body.creationDate_latest : creationDate_latest = Date.now().toString();
    req.body.creationDate_latest ? creationDate_latest = req.body.creationDate_latest : creationDate_latest = Date.now().toString();

    //get the memes from the data base using the defined search params
    Meme.find({
            $and: [{
                likes: { $gt: likes_min - 1, $lt: likes_max + 1 },
                title: { $regex: searchTerm },
                creationDate: { $gt: Date.parse(creationDate_earliest), $lt: Date.parse(creationDate_latest) },
            }]
        },
        (err, docs) => {
            if (err) {
                return res.status(500).send(err);
            }

            //slice the array to get only the given max file numbers
            docs.slice(0, 20)

            //create array of files
            let memes = []
            docs.forEach((doc, index) => {
                memes[index] = {
                    path: 'public/images/memes/' + doc.title + '.png',
                    name: doc.title + '.png'
                }
            });
            //return zip file
            res.status(200).zip({
                files: memes,
                filename: 'memes.zip'
            });
        })
});

module.exports = memeIO;