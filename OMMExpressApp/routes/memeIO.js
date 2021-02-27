var express = require('express');
var memeIO = express.Router();

var multer = require("multer");
var fs = require('fs');
var zip = require('express-zip');
const util = require('util')

const analyze = require('../middleware/analyze')
const captureWebsite = require('capture-website');
const auth = require('../middleware/auth')

const Meme = require('../models/memeSchema');
const User = require('../models/userSchema')
const Template = require('../models/templateSchema');
const Draft = require('../models/draftSchema');
var Jimp = require('jimp');



// Storage for saving tamplates on the server.
var storageTemplate = multer.diskStorage({
    destination: './public/images/templates',
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

// Storage for saving memes on the server.
var storageMeme = multer.diskStorage({
    destination: './public/images/memes',
    filename: function(req, file, cb) {
        cb(null, req.headers.title + ".jpeg");
    }
});


var uploadTemplate = multer({ storage: storageTemplate });
var uploadMeme = multer({ storage: storageMeme });


memeIO.use(function(req, res, next) {
    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow

    res.setHeader('Access-Control-Allow-Headers', 'Accept, Access, Control, Allow-Headers, Authorization, X-Requested-With,content-type,creationDate, x-auth-token, author,templateName,description,upper, lower, type, tags, title, caption, isPublic, publicOpt, X-Access-Token, x-auth-token');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    next();
});


/* POST /memeIO/save-draft */
/* Create new Draft */

memeIO.post("/save-draft", auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let author = user.name;
    console.log(req.body);
    let newDraft = {
        author: author,
        creationDate: Date.now(),
        src: req.body.src,
        bold: req.body.bold,
        italic: req.body.italic,
        color: req.body.color,
        fontSize: req.body.fontSize,
        isFreestyle: req.body.isFreestyle,
        imageProperties: req.body.imageProperties,
        canvasWidth: req.body.canvasWidth,
        canvasHeight: req.body.canvasHeight,
        text: req.body.text,
        preview: req.body.preview,
    }
    Draft.create(newDraft, (err, item) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            item.save(function(err, draft) {
                res.json(draft);
            });
        }
    })
});

/* GET memeIO/get-memes */
/* Get all memes from the database */
memeIO.post('/get-drafts', auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let author = user.name;
    Draft.find({ author: author }, function(err, docs) {
        if (err)
            return res.status(500).send(err);
        res.json({ code: 200, docs })
    })
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

/* GET memeIO/get-public-memes */
/* Get all memes stated public from the database */
memeIO.get('/get-public-memes', (req, res) => {
    Meme.find({ publicOpt: "public" }, function(err, docs) {
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
memeIO.post("/save-template", auth, async(req, res) => {
    let title = req.body.title;
    let url;
    //get the user from the db
    let user = await User.findById(req.user.id);
    let author = user.name

    if (!req.body.internetSource) { //save base64 string to file
        let base64String = req.body.url;
        let base64Image = base64String.split(';base64,').pop();
        url = "http://localhost:3030/images/templates/" + title + ".jpeg";

        fs.writeFile('public/images/templates/' + title + ".jpeg", base64Image, { encoding: 'base64' }, function(err) {
            if (err) console.log(err);
        })
    } else { //keep internet address as url
        url = req.body.url;
    }
    let newTemplate = {
        uploader: author,
        templateName: req.body.title,
        url: url,
    }

    Template.create(newTemplate, (err, item) => {
        if (err) {
            return res.json({"message" : err});
        } else {
            item.save(function(err, template) {
                if (err) return res.json({"message" : err});
                res.json(template);
            });
        }
    })
});

/* POST /memeIO/webshot*/
/* Make Screenshot of provided website and save as template */
memeIO.post("/webshot", auth, async(req, res) => {

    //get the user from the db
    //get the user from the db
    let user = await User.findById(req.user.id);
    let author = user.name

    const url = req.body.url;
    let filePath = "http://localhost:3030/images/templates/" + req.body.title + '.jpeg';

    var screenshotTemplate = {
        uploader: author,
        templateName: req.body.title,
        url: filePath,
    }
    let template;
    Template.create(screenshotTemplate, (err, item) => {
            if (err)
                console.log(err)
            else {
                item.save(function(err, item) {
                    template = item;
                });
            }
        })
        //Make Screenshot and save image to URL
    await captureWebsite.file(url, 'public/images/templates/' + req.body.title + ".jpeg").then(() => {
        console.log("savedFile")
    }).catch((err) => console.log(err));

    res.json(template);

});


/* POST /memeIO/upload */
/* upload template to server (via FilePond) */
memeIO.post('/upload-Template', uploadTemplate.single("file"), auth, async(req, res) => {
    Template.find({ templateName: req.file.originalname }, function(err, docs) {
            console.log(docs);
            if (err)
                return res.status(500).send(err);
            if (docs.length > 0)
                return res.json({ "message": "File name already exists" })
        })
        //get the user from the db
    let user = await User.findById(req.user.id);
    let author = user.name
    let url = "http://localhost:3030/images/templates/" + req.file.originalname;
    var uploadedTemplate = {
        uploader: author,
        templateName: req.file.originalname,
        url: url
    }
    console.log(uploadedTemplate);
    Template.create(uploadedTemplate, (err, item) => {
        if (err)
            console.log(err);
        else {
            item.save(function(err, item) {
                res.json(item);
            });
        }
    })
});


/* POST /memeIO/upload */
/* upload meme to server (via FilePond) */
memeIO.post('/upload-Meme', uploadMeme.single("file"), auth, async(req, res) => {
    let url;
    const analysis = await analyze(req.headers.title);
    //get the user from the db
    let user = await User.findById(req.user.id);
    let author = user.name
    url = "http://localhost:3030/images/memes/" + req.headers.title + '.jpeg';
    const newMeme = {
        title: req.headers.title,
        url: url,
        author: author,
        isPublic: req.headers.ispublic,
        publicOpt: req.headers.publicopt,
        creationDate: Date.now(),
        likes: 0,
        tags: analysis.tags,
        description: analysis.description.captions[0].text,
        caption: req.headers.upper,
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

/* POST /memeIO/upload-Gif */
/* upload Guf to server */
memeIO.get('/upload-Gif', (req, res) => {
    gm('./public/images/templates/Maus.gif').stroke("#000000")
        .fill('#ffffff')
        .font("./public/assets/impact.ttf", 42)
        .dither(false)
        .drawText(0, 0, "text", 'South')
        .write('result.gif', function(err) {
            if (!err) {
                console.log('Image processing done.');
            } else console.log(err);
        });
})


/* POST /memeIO/add-comment */
/* add a comment by a user to a meme by its id */
memeIO.post('/add-comment', auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let name = user.name;
    try {
        Meme.updateOne({ _id: req.body.id }, { $push: { comments: { date: req.body.date, user: name, commenttext: req.body.commenttext } } }, function(err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});

/* POST /memeIO/remove-comment */
/* remove a like from a comment by the meme id and comment name and text*/
memeIO.post('/remove-comment', auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let name = user.name;
    try {
        Meme.findByIdAndUpdate(req.body.id, { $pull: { comments: { user: name, commenttext: req.body.commenttext } } }, function(err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});

/* POST /memeIO/add-used-template */
/* add a used property and date to a template */
memeIO.post('/add-used-template', auth, async(req, res) => {
    //get the user from the db
    try {
        Template.updateOne({ _id: req.body.id }, { $push: { used: { date: req.body.date} } }, function(err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});


/* POST /memeIO/like-template */
/* add a like to a template with account*/
memeIO.post('/like-template', auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let name = user.name;
    try {
        Template.updateOne({ _id: req.body.id }, { $push: { likes: { date: req.body.date, user: name } } }, function(err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});

/* POST /memeIO/remove-like-template */
/* remove a like from a template by account*/
memeIO.post('/remove-like-template', auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let name = user.name;
    try {
        Template.findByIdAndUpdate(req.body.id, { $pull: { likes: { user: name } } }, function(err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});



/* POST /memeIO/like-meme */
/* add a like to a meme with account*/
memeIO.post('/like-meme', auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let name = user.name;
    try {
        Meme.updateOne({ _id: req.body.id }, { $push: { listlikes: { date: req.body.date, user: name } } }, function(err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});

/* POST /memeIO/remove-like-meme */
/* remove a like from a meme by account*/
memeIO.post('/remove-like-meme', auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let name = user.name;
    try {
        Meme.findByIdAndUpdate(req.body.id, { $pull: { listlikes: { user: name } } }, function(err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});


/* POST /memeIO/dislike-meme */
/* add a dislike to a meme with account*/
memeIO.post('/dislike-meme', auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let name = user.name;
    try {
        Meme.updateOne({ _id: req.body.id }, { $push: { dislikes: { date: req.body.date, user: name } } }, function(err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});

/* POST /memeIO/remove-dislike-meme */
/* remove a dislike from a meme by account*/
memeIO.post('/remove-dislike-meme', auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let name = user.name;
    try {
        Meme.findByIdAndUpdate(req.body.id, { $pull: { dislikes: { user: name } } }, function(err) {
            return res.status(200)
        })
    } catch (error) {
        return res.status(500).send(err)
    }
});

/* POST /memeIO/create-simple-meme */
/* create simple meme with lower and upper text */
memeIO.post('/create-simple-meme', async(req, res) => {
    try {
        const url = "http://localhost:3030/images/memes/" + req.body.title + ".jpeg";
        let image;
        if (req.body.width) { //for images created with advanced options
            image = await Jimp.read(Buffer.from(req.body.url.split(',')[1], 'base64'));
            image.resize(req.body.width, req.body.height);
        } else {
            image = await Jimp.read(req.body.url);
            image.resize(700, Jimp.AUTO);
        }
        let font = await Jimp.loadFont('public/assets/impact.ttf/impact.fnt');
        if (req.body.fromGenerator) { //for images generated in the webapp
            req.body.upper.forEach((element, index) => {
                let positionX = Jimp.measureText(font, element) < 400 ? (image.bitmap.width / 2) - (Jimp.measureText(font, element) / 2) : (image.bitmap.width / 2) - 200;
                let positionY = ((Jimp.measureTextHeight(font, element) + 10) * (index + 1));
                image.print(font, positionX, positionY, element, 400)
            });
            image = await image.writeAsync("public/images/memes/" + req.body.title + ".jpeg");
            let stats = fs.statSync("public/images/memes/" + req.body.title + ".jpeg");
            let quality = 100;
            while ((req.body.fileSize < stats.size / 1000)) { //check file size and decrease quality if needed
                quality -= 20;
                image.quality(quality);
                image = await image.writeAsync("public/images/memes/" + req.body.title + ".jpeg");
                stats = fs.statSync("public/images/memes/" + req.body.title + ".jpeg");
            }
        } else { // for memes created in the command line
            let positionX_upper = Jimp.measureText(font, req.body.upper) < 400 ? (image.bitmap.width / 2) - (Jimp.measureText(font, req.body.upper) / 2) : (image.bitmap.width / 2) - 200;
            let positionX_lower = Jimp.measureText(font, req.body.lower) < 400 ? (image.bitmap.width / 2) - (Jimp.measureText(font, req.body.lower) / 2) : (image.bitmap.width / 2) - 200;
            //upper text
            image.print(font, positionX_upper, 30, req.body.upper, 400)
                //lower text
                .print(font, positionX_lower, image.bitmap.height - (Jimp.measureTextHeight(font, req.body.lower) + 30), req.body.lower, 400)

            //save meme
            image = await image.writeAsync("public/images/memes/" +
                req.body.title + ".jpeg");
        }

        const analysis = await analyze(req.body.title);
        //save the meme to the data base
        const newMeme = new Meme({
            title: req.body.title,
            author: req.body.author,
            creationDate: Date.now(),
            url: url,
            isPublic: true,
            publicOpt: req.body.publicOpt,
            likes: 0,
            tags: analysis.tags,
            description: analysis.description.captions[0].text,
            caption: req.body.upper + " " + req.body.lower,
        })
        newMeme.save();

        if (req.body.fromGenerator) {
            return res.status(200).json({ "url": url });
        } else {
            return res.status(200).download("public/images/memes/" + req.body.title + ".jpeg");
        }

    } catch (error) {
        return res.status(500).send(error);
    }
});

/* POST /memeIO/create-meme */
/* create meme with defined textboxes */
memeIO.post('/create-meme', async(req, res) => {
    try {
        const url = "http://localhost:3030/images/memes/" + req.body.title + ".jpeg";
        let image = await Jimp.read(req.body.url);
        image = await image.resize(700, Jimp.AUTO);
        for (const textBox of req.body.textBoxes) {
            let font = await Jimp.loadFont(textBox.font ? textBox.font : 'public/assets/impact.ttf/impact.fnt')
            image.print(font, textBox.x, textBox.y, {
                    text: textBox.text
                }, textBox.maxWidth,
                textBox.maxHeight)
        }
        image = await image.writeAsync("public/images/memes/" +
            req.body.title + ".jpeg");
        //save the meme to the data base
        const analysis = await analyze(req.body.title);

        const newMeme = new Meme({
            title: req.body.title,
            url: url,
            isPublic: true,
            publicOpt: "public",
            tags: analysis.tags,
            description: analysis.description.captions[0].text,
            caption: req.body.textBoxes.map(textBox => textBox.text),
        })
        newMeme.save();
        return res.status(200).download("public/images/memes/" + req.body.title + ".jpeg")
    } catch (error) {
        return res.status(500).send(error);
    }
});

/* POST /memeIO/create-memes */
/* create memes with defined url and several textboxes */
memeIO.post('/create-memes', async(req, res) => {
    try {
        //console.log(req.body.templates, req.body.textBoxes)
        let memes = []
        for (const template of req.body.templates) {
            const url = "http://localhost:3030/images/memes/" + template.name + ".jpeg";
            let image = await Jimp.read(template.url);
            image.resize(700, Jimp.AUTO);
            for (const textBox of req.body.textBoxes) {
                let font = await Jimp.loadFont(textBox.font ? textBox.font : 'public/assets/impact.ttf/impact.fnt')
                image.print(font, textBox.x, textBox.y, {
                        text: textBox.text
                    }, textBox.maxWidth,
                    textBox.maxHeight)
            }
            await image.writeAsync("public/images/memes/" +
                template.name + ".jpeg");
            //save the meme to the data base
            const analysis = await analyze(template.name);
            //save the meme to the data base
            const newMeme = new Meme({
                title: template.name,
                url: url,
                isPublic: true,
                publicOpt: "public",
                tags: analysis.tags,
                description: analysis.description.captions[0].text,
                caption: req.body.textBoxes.map(textBox => textBox.text),
            })
            console.log(newMeme)
            newMeme.save();
            memes.push({
                path: "public/images/memes/" +
                    template.name + ".jpeg",
                name: template.name + ".jpeg"
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

/* GET /memeIO/get-meme */
/* get meme by title as a jpeg file */
memeIO.get('/get-meme', (req, res) => {
    Meme.find({ title: req.body.title }, function(err, docs) {
        if (err) {
            return res.status(500).send(err);
        }
        if (docs.length == 0) {
            res.status(500).send("There is no meme with this title")
        } else {
            if (fs.existsSync("public/images/memes/" + docs[0].title + ".jpeg")) {
                res.status(200).download("public/images/memes/" + docs[0].title + ".jpeg")
            } else {
                res.status(500).send("The meme does not exist in your local folder")
            }
        }
    })
});

/* GET /memeIO/download-meme */
/* returns base64 file to be downloaded */
memeIO.post('/download-meme', (req, res) => {
    try {
        console.log(req.body.title);
        let base64 = fs.readFileSync("./public/images/memes/" + req.body.title + ".jpeg").toString('base64');
        res.status(200).send({ "data": base64 });
    } catch (error) {
        return res.status(500).send(err);
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
                    path: 'public/images/memes/' + doc.title + '.jpeg',
                    name: doc.title + '.jpeg'
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
module.exports = memeIO;