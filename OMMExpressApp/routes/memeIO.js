var express = require('express');
var memeIO = express.Router();

var multer = require("multer");
var fs = require('fs');

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

// Storage for saving mims on the server.
var storageMim = multer.diskStorage({
    destination: './public/images/mims',
    filename: function(req, file, cb) {
        cb(null, file.originalname);
    }
});

var uploadTemplate = multer({ storage: storageTemplate });
var uploadMeme = multer({ storage: storageMeme });
var uploadMim = multer({ storage: storageMim });


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


/* POST /memeIO/save-draft
 *  Create new Draft
 *  sends response with created draft
 */
memeIO.post("/save-draft", auth, async(req, res) => {
    //get the user from the db
    let user = await User.findById(req.user.id);
    let author = user.name;
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

/* GET memeIO/get-drafts
 * Get all drafts of the user from the database */
memeIO.post('/get-drafts', auth, async(req, res) => {
            //get the user from the db
            let user = await User.findById(req.user.id);
            let author = user.name; <<
            << << < HEAD
            Draft.find({ author: author }, function(err, docs) { ===
                === =
                Draft.find({ author: author }, function(err, docs) { >>>
                    >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
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
            memeIO.get('/get-public-memes', (req, res) => { <<
                        << << < HEAD
                        Meme.find({ publicOpt: "public" }, function(err, docs) { ===
                            === =
                            Meme.find({ publicOpt: "public" }, function(err, docs) { >>>
                                >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
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

                                        <<
                                        << << < HEAD
                                        fs.writeFile('public/images/templates/' + title + ".jpeg", base64Image, { encoding: 'base64' }, function(err) { ===
                                                    === =
                                                    fs.writeFile('public/images/templates/' + title + ".jpeg", base64Image, { encoding: 'base64' }, function(err) { >>>
                                                        >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
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
                                                        return res.json({ "message": err });
                                                    } else { <<
                                                        << << < HEAD
                                                        item.save(function(err, template) { ===
                                                                === =
                                                                item.save(function(err, template) { >>>
                                                                    >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
                                                                    if (err) return res.json({ "message": err });
                                                                    res.json(template);
                                                                });
                                                            }
                                                        })
                                                });

                                                /* POST /memeIO/webshot*/
                                                /* Make Screenshot of provided website and save as template */
                                                memeIO.post("/webshot", auth, async(req, res) => {

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


                                                /* POST /memeIO/upload-Template */
                                                /* upload template to server (via FilePond) and create new template in db */
                                                memeIO.post('/upload-Template', uploadTemplate.single("file"), auth, async(req, res) => {
                                                    //checks if template with same filename already exists
                                                    <<
                                                    << << < HEAD
                                                    Template.find({ templateName: req.file.originalname }, function(err, docs) {
                                                            if (err)
                                                                return res.status(500).send(err);
                                                            if (docs.length > 0)
                                                                return res.json({ "message": "File name already exists" })
                                                        })
                                                        //get the user from the db
                                                        ===
                                                        === =
                                                        Template.find({ templateName: req.file.originalname }, function(err, docs) {
                                                            if (err)
                                                                return res.status(500).send(err);
                                                            if (docs.length > 0)
                                                                return res.json({ "message": "File name already exists" })
                                                        })
                                                        //get the user from the db
                                                        >>>
                                                        >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
                                                    let user = await User.findById(req.user.id);
                                                    let author = user.name
                                                    let url = "http://localhost:3030/images/templates/" + req.file.originalname;
                                                    var uploadedTemplate = {
                                                        uploader: author,
                                                        templateName: req.file.originalname,
                                                        url: url
                                                    }
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


                                                /* POST /memeIO/upload-Meme */
                                                /* upload meme to server (via FilePond) and save meme in db */
                                                memeIO.post('/upload-Meme', uploadMeme.single("file"), auth, async(req, res) => {
                                                    let url;
                                                    //analyze meme with computer vision
                                                    const analysis = await analyze(req.headers.title);
                                                    //get the user from the db
                                                    let user = await User.findById(req.user.id);
                                                    let author = user.name;
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
                                                            item.save();
                                                            res.send(url);
                                                        }
                                                    })
                                                });

                                                <<
                                                << << < HEAD
                                                var gm = require("gm");

                                                /* POST /memeIO/upload-Gif */
                                                /* upload Gif to server */
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

                                                ===
                                                === = >>>
                                                >>> > 740 f774f9a091bb7c8007dafb09b0115390261af

                                                /* POST /memeIO/upload-mim */
                                                /* Uploads an webm to the server and saves it in the memeDB */
                                                memeIO.post('/upload-mim', uploadMim.single("file"), auth, async(req, res) => {
                                                    let url;
                                                    //get the user from the db
                                                    let user = await User.findById(req.user.id);
                                                    let author = user.name
                                                    url = "http://localhost:3030/images/mims/" + req.file.originalname;
                                                    const newMeme = {
                                                        title: req.headers.title,
                                                        url: url,
                                                        author: author,
                                                        isPublic: true,
                                                        publicOpt: "public",
                                                        creationDate: Date.now(),
                                                        likes: 0,
                                                        tags: "video",
                                                        description: "",
                                                        caption: "",
                                                    }
                                                    Meme.create(newMeme, (err, item) => {
                                                        if (err) {
                                                            console.log(err)
                                                            res.status(500)
                                                        } else {
                                                            console.log(item.description);
                                                            item.save();
                                                            res.send(url);
                                                        }
                                                    })
                                                });


                                                /* POST /memeIO/add-comment */
                                                /* add a comment to a meme with account*/
                                                memeIO.post('/add-comment', auth, async(req, res) => {
                                                    //get the user from the db
                                                    let user = await User.findById(req.user.id);
                                                    let name = user.name;
                                                    try {
                                                        Meme.updateOne({ _id: req.body.id }, {
                                                            $push: {
                                                                comments: {
                                                                    date: req.body.date,
                                                                    user: name,
                                                                    commenttext: req.body.commenttext
                                                                }
                                                            }
                                                        }, function(err) {
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
                                                        Meme.findByIdAndUpdate(req.body.id, {
                                                            $pull: {
                                                                comments: {
                                                                    user: name,
                                                                    commenttext: req.body.commenttext
                                                                }
                                                            }
                                                        }, function(err) {
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
                                                        try { <<
                                                            << << < HEAD
                                                            Template.updateOne({ _id: req.body.id }, { $push: { used: { date: req.body.date } } }, function(err) { ===
                                                                    === =
                                                                    Template.updateOne({ _id: req.body.id }, { $push: { used: { date: req.body.date } } }, function(err) { >>>
                                                                        >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
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
                                                                    try { <<
                                                                        << << < HEAD
                                                                        Template.updateOne({ _id: req.body.id }, { $push: { likes: { date: req.body.date, user: name } } }, function(err) { ===
                                                                                === =
                                                                                Template.updateOne({ _id: req.body.id }, { $push: { likes: { date: req.body.date, user: name } } }, function(err) { >>>
                                                                                    >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
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
                                                                                try { <<
                                                                                    << << < HEAD
                                                                                    Template.findByIdAndUpdate(req.body.id, { $pull: { likes: { user: name } } }, function(err) { ===
                                                                                            === =
                                                                                            Template.findByIdAndUpdate(req.body.id, { $pull: { likes: { user: name } } }, function(err) { >>>
                                                                                                >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
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
                                                                                            try { <<
                                                                                                << << < HEAD
                                                                                                Meme.updateOne({ _id: req.body.id }, { $push: { listlikes: { date: req.body.date, user: name } } }, function(err) { ===
                                                                                                        === =
                                                                                                        Meme.updateOne({ _id: req.body.id }, { $push: { listlikes: { date: req.body.date, user: name } } }, function(err) { >>>
                                                                                                            >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
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
                                                                                                        try { <<
                                                                                                            << << < HEAD
                                                                                                            Meme.findByIdAndUpdate(req.body.id, { $pull: { listlikes: { user: name } } }, function(err) { ===
                                                                                                                    === =
                                                                                                                    Meme.findByIdAndUpdate(req.body.id, { $pull: { listlikes: { user: name } } }, function(err) { >>>
                                                                                                                        >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
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
                                                                                                                    try { <<
                                                                                                                        << << < HEAD
                                                                                                                        Meme.updateOne({ _id: req.body.id }, { $push: { dislikes: { date: req.body.date, user: name } } }, function(err) { ===
                                                                                                                                === =
                                                                                                                                Meme.updateOne({ _id: req.body.id }, { $push: { dislikes: { date: req.body.date, user: name } } }, function(err) { >>>
                                                                                                                                    >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
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
                                                                                                                                try { <<
                                                                                                                                    << << < HEAD
                                                                                                                                    Meme.findByIdAndUpdate(req.body.id, { $pull: { dislikes: { user: name } } }, function(err) { ===
                                                                                                                                            === =
                                                                                                                                            Meme.findByIdAndUpdate(req.body.id, { $pull: { dislikes: { user: name } } }, function(err) { >>>
                                                                                                                                                >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
                                                                                                                                                return res.status(200)
                                                                                                                                            })
                                                                                                                                        } catch (error) {
                                                                                                                                            return res.status(500).send(err)
                                                                                                                                        }
                                                                                                                                    });

                                                                                                                                /* POST /memeIO/create-simple-meme */
                                                                                                                                /* creates simple meme with given lower and upper text */
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

                                                                                                                                        //load the IMPACT font
                                                                                                                                        let font = await Jimp.loadFont('public/assets/impact.ttf/impact.fnt');

                                                                                                                                        //for images generated in the webapp
                                                                                                                                        if (req.body.fromGenerator) {
                                                                                                                                            req.body.upper.forEach((element, index) => { //align each line
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
                                                                                                                                            // for memes created in the command line
                                                                                                                                        } else {
                                                                                                                                            //calculate the x position for the upper and lower text
                                                                                                                                            let positionX_upper = Jimp.measureText(font, req.body.upper) < 400 ? (image.bitmap.width / 2) - (Jimp.measureText(font, req.body.upper) / 2) : (image.bitmap.width / 2) - 200;
                                                                                                                                            let positionX_lower = Jimp.measureText(font, req.body.lower) < 400 ? (image.bitmap.width / 2) - (Jimp.measureText(font, req.body.lower) / 2) : (image.bitmap.width / 2) - 200;
                                                                                                                                            //print upper text
                                                                                                                                            image.print(font, positionX_upper, 30, req.body.upper, 400)
                                                                                                                                                //print lower text
                                                                                                                                                .print(font, positionX_lower, image.bitmap.height - (Jimp.measureTextHeight(font, req.body.lower) + 30), req.body.lower, 400)

                                                                                                                                            //save meme
                                                                                                                                            image = await image.writeAsync("public/images/memes/" +
                                                                                                                                                req.body.title + ".jpeg");
                                                                                                                                        }
                                                                                                                                        //analyze meme with computer vision to get descirption
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
                                                                                                                                            return res.status(200).json({ "url": url }); <<
                                                                                                                                            << << < HEAD
                                                                                                                                        } else { //return image as jpeg
                                                                                                                                            ===
                                                                                                                                            === =
                                                                                                                                        } else { >>>
                                                                                                                                            >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
                                                                                                                                            return res.status(200).download("public/images/memes/" + req.body.title + ".jpeg");
                                                                                                                                        }

                                                                                                                                    } catch (error) {
                                                                                                                                        return res.status(500).send(error);
                                                                                                                                    }
                                                                                                                                });

                                                                                                                                /* POST /memeIO/create-meme */
                                                                                                                                /* create meme from the given image url and prints the defined textboxes on it*/
                                                                                                                                memeIO.post('/create-meme', async(req, res) => {
                                                                                                                                    try {
                                                                                                                                        //image url
                                                                                                                                        const url = "http://localhost:3030/images/memes/" + req.body.title + ".jpeg";

                                                                                                                                        //use JIMP 
                                                                                                                                        let image = await Jimp.read(req.body.url);
                                                                                                                                        image = await image.resize(700, Jimp.AUTO);

                                                                                                                                        //loop over all the textboxes and print the text on the image
                                                                                                                                        for (const textBox of req.body.textBoxes) {
                                                                                                                                            //get the given font URL -> if not defined use IMPACT
                                                                                                                                            let font = await Jimp.loadFont(textBox.font ? textBox.font : 'public/assets/impact.ttf/impact.fnt')

                                                                                                                                            //print the text box with the defined properties
                                                                                                                                            image.print(font, textBox.x, textBox.y, {
                                                                                                                                                    text: textBox.text
                                                                                                                                                }, textBox.maxWidth,
                                                                                                                                                textBox.maxHeight)
                                                                                                                                        }

                                                                                                                                        //write the image 
                                                                                                                                        image = await image.writeAsync("public/images/memes/" +
                                                                                                                                            req.body.title + ".jpeg");

                                                                                                                                        //analyze meme with computer vision to get descirption
                                                                                                                                        const analysis = await analyze(req.body.title);

                                                                                                                                        //save the meme to the data base
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

                                                                                                                                        //return the image as JPEG
                                                                                                                                        return res.status(200).download("public/images/memes/" + req.body.title + ".jpeg")
                                                                                                                                    } catch (error) {
                                                                                                                                        return res.status(500).send(error);
                                                                                                                                    }
                                                                                                                                });

                                                                                                                                /* POST /memeIO/create-memes */
                                                                                                                                /* create multible memes from the given URLs and the defined textboxes */
                                                                                                                                memeIO.post('/create-memes', async(req, res) => {
                                                                                                                                    try {
                                                                                                                                        //memes array -> to create zip later from
                                                                                                                                        let memes = []

                                                                                                                                        //loop over all the given template urls
                                                                                                                                        for (const template of req.body.templates) {
                                                                                                                                            //get image URL
                                                                                                                                            const url = "http://localhost:3030/images/memes/" + template.name + ".jpeg";

                                                                                                                                            //load image using JIMP
                                                                                                                                            let image = await Jimp.read(template.url);

                                                                                                                                            //resize the image to have fixed width
                                                                                                                                            image.resize(700, Jimp.AUTO);

                                                                                                                                            //loop over all the textboxes
                                                                                                                                            for (const textBox of req.body.textBoxes) {
                                                                                                                                                //get the given font URL -> if not defined use IMPACT
                                                                                                                                                let font = await Jimp.loadFont(textBox.font ? textBox.font : 'public/assets/impact.ttf/impact.fnt')

                                                                                                                                                //print the text with the given properties
                                                                                                                                                image.print(font, textBox.x, textBox.y, {
                                                                                                                                                        text: textBox.text
                                                                                                                                                    }, textBox.maxWidth,
                                                                                                                                                    textBox.maxHeight)
                                                                                                                                            }

                                                                                                                                            //write the image with JIMP
                                                                                                                                            await image.writeAsync("public/images/memes/" +
                                                                                                                                                template.name + ".jpeg");

                                                                                                                                            //analyze meme with computer vision to get descirption
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
                                                                                                                                            newMeme.save();

                                                                                                                                            //push the created meme to the memes array for later zip creation
                                                                                                                                            memes.push({
                                                                                                                                                path: "public/images/memes/" +
                                                                                                                                                    template.name + ".jpeg",
                                                                                                                                                name: template.name + ".jpeg"
                                                                                                                                            })
                                                                                                                                        }
                                                                                                                                        //return all created memes as zip file
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
                                                                                                                                memeIO.get('/get-meme', (req, res) => { <<
                                                                                                                                            << << < HEAD
                                                                                                                                            Meme.find({ title: req.body.title }, function(err, docs) { ===
                                                                                                                                                === =
                                                                                                                                                Meme.find({ title: req.body.title }, function(err, docs) { >>>
                                                                                                                                                    >>> > 740 f774f9a091bb7c8007dafb09b0115390261af
                                                                                                                                                    if (err) {
                                                                                                                                                        return res.status(500).send(err);
                                                                                                                                                    }
                                                                                                                                                    //if meme could not be found in the database
                                                                                                                                                    if (docs.length == 0) {
                                                                                                                                                        res.status(500).send("There is no meme with this title")
                                                                                                                                                    } else {
                                                                                                                                                        //check if the meme does exist in the local folder
                                                                                                                                                        if (fs.existsSync("public/images/memes/" + docs[0].title + ".jpeg")) {
                                                                                                                                                            //SUCCESSFUL return meme as jpeg
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
                                                                                                                                                    let base64 = fs.readFileSync("./public/images/memes/" + req.body.title + ".jpeg").toString('base64');
                                                                                                                                                    res.status(200).send({ "data": base64 });
                                                                                                                                                } catch (error) {
                                                                                                                                                    return res.status(500).send(err);
                                                                                                                                                }
                                                                                                                                            });

                                                                                                                                            /* GET /memeIO/get-memes-by */
                                                                                                                                            /* returns memes by given search parameters as zip file */
                                                                                                                                            memeIO.get('/get-memes-by', (req, res) => {
                                                                                                                                                    let likes_min;
                                                                                                                                                    let likes_max;
                                                                                                                                                    let searchTerm;
                                                                                                                                                    let creationDate_earliest;
                                                                                                                                                    let creationDate_latest;

                                                                                                                                                    //apply DEFAULT values if the search params are not defined in the request
                                                                                                                                                    req.body.likes_min ? likes_min = req.body.likes_min : likes_min = -100;
                                                                                                                                                    req.body.likes_max ? likes_max = req.body.likes_max : likes_max = 100;
                                                                                                                                                    req.body.searchTerm ? searchTerm = req.body.searchTerm : searchTerm = '.*';
                                                                                                                                                    req.body.creationDate_earliest ? creationDate_earliest = req.body.creationDate_earliest : creationDate_earliest = '1970-01-01T00:00:00.000Z';
                                                                                                                                                    req.body.creationDate_latest ? creationDate_latest = req.body.creationDate_latest : creationDate_latest = Date.now().toString();

                                                                                                                                                    //get the memes from the data base using the defined search params
                                                                                                                                                    Meme.find({ <<
                                                                                                                                                                << << < HEAD
                                                                                                                                                                $and: [{
                                                                                                                                                                    $or: [{
                                                                                                                                                                            title: {
                                                                                                                                                                                $regex: searchTerm
                                                                                                                                                                            }
                                                                                                                                                                        },
                                                                                                                                                                        {
                                                                                                                                                                            description: {
                                                                                                                                                                                $regex: searchTerm
                                                                                                                                                                            }
                                                                                                                                                                        }
                                                                                                                                                                    ],
                                                                                                                                                                    creationDate: { $gt: Date.parse(creationDate_earliest), $lt: Date.parse(creationDate_latest) },
                                                                                                                                                                    isPublic: true,
                                                                                                                                                                }]
                                                                                                                                                            }, ===
                                                                                                                                                            === =
                                                                                                                                                            $and: [{
                                                                                                                                                                likes: { $gt: likes_min - 1, $lt: likes_max + 1 },
                                                                                                                                                                title: { $regex: searchTerm },
                                                                                                                                                                creationDate: { $gt: Date.parse(creationDate_earliest), $lt: Date.parse(creationDate_latest) },
                                                                                                                                                            }]
                                                                                                                                                        }, >>>
                                                                                                                                                        >>> > 740 f774f9a091bb7c8007dafb09b0115390261af(err, docs) => {
                                                                                                                                                            if (err) {
                                                                                                                                                                return res.status(500).send(err);
                                                                                                                                                            }

                                                                                                                                                            //filtered the memes by min and max likes
                                                                                                                                                            let docs_filtered = docs.filter(function(meme) {
                                                                                                                                                                let votes = meme.listlikes.length - meme.dislikes.length;
                                                                                                                                                                return votes > likes_min && votes < likes_max;
                                                                                                                                                            });

                                                                                                                                                            //slice the array to a MAX File number size of 20
                                                                                                                                                            docs_filtered.slice(0, 20)

                                                                                                                                                            //create an array of the found files for zip creation
                                                                                                                                                            let memes = []
                                                                                                                                                            docs_filtered.forEach((doc, index) => {
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

                                                                                                                                        <<
                                                                                                                                        << << < HEAD module.exports = memeIO; module.exports = memeIO; module.exports = memeIO; ===
                                                                                                                                        === = >>>
                                                                                                                                        >>> > 740 f774f9a091bb7c8007dafb09b0115390261af module.exports = memeIO;