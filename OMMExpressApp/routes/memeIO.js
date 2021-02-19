var express = require('express');
var memeIO = express.Router();

var multer = require("multer");
var fs = require('fs');
var zip = require('express-zip');
const util = require('util')

const analyze = require('../middleware/analyze')
const captureWebsite = require('capture-website');

const Meme = require('../models/memeSchema');
const Template = require('../models/templateSchema');
var Jimp = require('jimp');



// Storage for saving tamplates on the server.
var storageTemplate = multer.diskStorage({
    destination: './public/images/templates',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Storage for saving memes on the server.
var storageMeme = multer.diskStorage({
    destination: './public/images/memes',
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});


var uploadTemplate = multer({ storage: storageTemplate });
var uploadMeme = multer({ storage: storageMeme });


memeIO.use(function (req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow

    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,creationDate, author,templateName,description,upper, lower, type, tags, title, caption, isPublic');

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
    if (!req.body.internetSource) { //save base64 string to file
        let base64String = req.body.url;
        let base64Image = base64String.split(';base64,').pop();
        url = "http://localhost:3030/images/templates/" + title;

        fs.writeFile('public/images/templates/' + title, base64Image, { encoding: 'base64' }, function (err) {
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
            res.status(500).error(err)
        else {
            template = item.save(function (err, template) {
                res.json(template);
            });
        }
    })
});

/* POST /memeIO/webshot*/
/* Make Screenshot of provided website and save as template */
memeIO.post("/webshot", async (req, res) => {
    let url = req.body.url;
    let shortUrl = url.replace(/(^http[s]?:\/\/)|[.\/\\]/ig, '').slice(0, 20) + '.png';
    let filePath = "http://localhost:3030/images/templates/" + shortUrl;

    var screenshotTemplate = {
        uploader: req.body.author,
        templateName: req.body.title,
        url: filePath,
    }
    let template;
    Template.create(screenshotTemplate, (err, item) => {
        if (err)
            console.log(err)
        else {
            console.log(item);
            item.save(function (err, item) {
                template = item;
            });
        }
    })
    //Make Screenshot and save image to URL
    await captureWebsite.file(url, 'public/images/templates/' + shortUrl).then(() => {
        console.log("savedFile")
    }).catch((err) => console.log(err));
    res.json(template);

});


/* POST /memeIO/upload */
/* upload template to server (via FilePond) */
memeIO.post('/upload-Template', uploadTemplate.single("file"), async (req, res) => {
    //upload template
    let url = "http://localhost:3030/images/templates/" + req.file.originalname;
    var uploadedTemplate = {
        uploader: req.headers.author,
        templateName: req.file.originalname,
        url: url
    }
    console.log(uploadedTemplate);
    Template.create(uploadedTemplate, (err, item) => {
        if (err)
            res.status(500).error(err);
        else {
            item.save(function (err, item) {
                res.json(item);
            });
        }
    })
}
);


/* POST /memeIO/upload */
/* upload meme to server (via FilePond) */
memeIO.post('/upload-Meme', uploadMeme.single("file"), async (req, res) => {
    let url;
    const analysis = await analyze(req);
    console.log(analysis);
    url = "http://localhost:3030/images/memes/" + req.headers.memetitle + '.png';
    const newMeme = {
        title: req.headers.title,
        url: url,
        author: req.headers.author,
        isPublic: req.headers.isPublic,
        creationDate: Date.now(),
        likes: 0,
        tags: analysis.tags,
        description: analysis.description.captions[0].text,
        caption: req.body.upper + " " + req.body.lower,
    }
    Meme.create(newMeme, (err, item) => {
        if (err)
            console.log(err)
        else {
            console.log(item.description);
            item.save();
            res.send(url);
        }
    })
});

var gm = require("gm");

memeIO.get('/upload-Gif', (req, res) => {
    gm('./public/images/templates/Maus.gif').stroke("#000000")
        .fill('#ffffff')
        .font("./public/assets/impact.ttf", 42)
        .dither(false)
        .drawText(0, 0, "text", 'South')
        .write('result.gif', function (err) {
            if (!err) {
                console.log('Image processing done.');
            }
            else console.log(err);
        });
})


/* POST /memeIO/like-meme */
/* update meme likes +1 by id  */
memeIO.post('/like-meme', (req, res) => {
    try {
        Meme.updateOne({ _id: req.body.id }, { $inc: { likes: 1 } }, function (err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});



/* POST /memeIO/like-meme */
/* update meme likes +1 by id  */
memeIO.post('/like-meme', (req, res) => {
    try {
        Meme.updateOne({ _id: req.body.id }, { $inc: { likes: 1 } }, function (err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});

/* POST /memeIO/dislike-meme */
/* update meme likes -1 by id  */
memeIO.post('/dislike-meme', (req, res) => {
    try {
        Meme.updateOne({ _id: req.body.id }, { $inc: { likes: -1 } }, function (err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});

/* POST /memeIO/create-simple-meme */
/* create simple meme with lower and upper text */
memeIO.post('/create-simple-meme', async (req, res) => {
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
        image = await image.writeAsync("public/images/memes/" +
            req.body.title + ".png");

        const analysis = await analyze(req);
        console.log(analysis.description.captions);
        //save the meme to the data base
        const newMeme = new Meme({
            title: req.body.title,
            author: req.body.author,
            creationDate: req.body.author,
            url: url,
            isPublic: true,
            likes: 0,
            tags: analysis.tags,
            description: analysis.description.captions[0].text,
            caption: req.body.upper + " " + req.body.lower,
        })
    });

/* POST /memeIO/create-meme */
/* create meme with defined textboxes */
memeIO.post('/create-meme', async (req, res) => {
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
        image = await image.writeAsync("public/images/memes/" +
            req.body.title + ".png");
        //save the meme to the data base
        const analysis = await analyze(req);

        const newMeme = new Meme({
            title: req.body.title,
            url: url,
            isPublic: true,
            likes: 0,
            tags: analysis.tags,
            description: analysis.description.captions[0].text,
            caption: req.body.upper + " " + req.body.lower,
        })
        newMeme.save();
        return res.status(200).download("public/images/memes/" + req.body.title + ".png")
    } catch (error) {
        return res.status(500).send(error);
    }
});

/* POST /memeIO/create-memes */
/* create memes with defined url and several textboxes */
memeIO.post('/create-memes', async (req, res) => {
    try {
        //console.log(req.body.templates, req.body.textBoxes)
        let memes = []
        for (const template of req.body.templates) {
            console.log(template);
            const url = "http://localhost:3030/images/memes/" + template.name + ".png";
            let image = await Jimp.read(template.url);
            image.resize(700, Jimp.AUTO);
            let font = await Jimp.loadFont('public/assets/impact.ttf/impact.fnt');
            let positionX_upper = Jimp.measureText(font, req.body.upper) < 400 ? (image.bitmap.width / 2) - (Jimp.measureText(font, req.body.upper) / 2) : (image.bitmap.width / 2) - 200;
            let positionX_lower = Jimp.measureText(font, req.body.lower) < 400 ? (image.bitmap.width / 2) - (Jimp.measureText(font, req.body.lower) / 2) : (image.bitmap.width / 2) - 200;

            //upper text
            image.print(font, positionX_upper, 30, req.body.upper, 400)
                //lower text
                .print(font, positionX_lower, image.bitmap.height - (Jimp.measureTextHeight(font, req.body.lower) + 30), req.body.lower, 400)
            //save meme
            image = await image.writeAsync("public/images/memes/" +
                req.body.title + ".png");

            const analysis = await analyze(req);
            console.log(analysis.description.captions);
            //save the meme to the data base
            const newMeme = new Meme({
                title: req.body.title,
                url: url,
                isPublic: true,
                likes: 0,
                tags: analysis.tags,
                description: analysis.description.captions[0].text,
                caption: req.body.upper + " " + req.body.lower,
            })
            newMeme.save();
            res.status(200).download("public/images/memes/" + req.body.title + ".png");
        } catch (error) {
            return res.status(500).send(error);
        }
    });

/* POST /memeIO/create-meme */
/* create meme with defined textboxes */
memeIO.post('/create-meme', async (req, res) => {
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
        }
        ;
        image = await image.writeAsync("public/images/memes/" +
            req.body.title + ".png");
        //save the meme to the data base
        const analysis = await analyze(req);

        const newMeme = new Meme({
            title: req.body.title,
            url: url,
            isPublic: true,
            likes: 0,
            tags: analysis.tags,
            description: analysis.description.captions[0].text,
            caption: req.body.upper + " " + req.body.lower,
        })
        newMeme.save();
        return res.status(200).download("public/images/memes/" + req.body.title + ".png")
    } catch (error) {
        return res.status(500).send(error);
    }
});

/* POST /memeIO/create-memes */
/* create memes with defined url and several textboxes */
memeIO.post('/create-memes', async (req, res) => {
    try {
        //console.log(req.body.templates, req.body.textBoxes)
        let memes = []
        for (const template of req.body.templates) {
            console.log(template);
            const url = "http://localhost:3030/images/memes/" + template.name + ".png";
            let image = await Jimp.read(template.url);
            image.resize(700, Jimp.AUTO);
            for (const textBox of req.body.textBoxes) {
                let font = await Jimp.loadFont(textBox.font ? textBox.font : 'public/assets/impact.ttf/impact.fnt')
                image.print(font, textBox.x, textBox.y, {
                    text: textBox.text
                }, textBox.maxWidth,
                    textBox.maxHeight)
            }
            ;
            image = await image.writeAsnyc("public/images/memes/" +
                template.name + ".png");
            //save the meme to the data base
            const newMeme = new Meme({
                title: template.name,
                url: url,
                isPublic: true,
                likes: 0
            })
            newMeme.save();
            memes.push({
                path: "public/images/memes/" +
                    template.name + ".png",
                name: template.name + ".png"
            })
        }
        //return zip file
        console.log(memes);
        res.status(200).zip({
            files: memes,
            filename: 'memes.zip'
        });

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