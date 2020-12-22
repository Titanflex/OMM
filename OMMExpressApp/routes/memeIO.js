var express = require('express');
var memeIO = express.Router();

const fileUpload = require('express-fileupload')
memeIO.use(fileUpload());

/*
let memes = [{
  'upper': 'THE AMOUNT OF OMM TASKS',
  'lower': 'IS TOO DAMN HIGH',
  'url': 'https://i.imgflip.com/1bik.jpg'
},
{
  'upper': 'LOOK AT ME',
  'lower': 'IM THE OMM TUTOR NOW',
  'url': 'https://i.imgflip.com/hlmst.jpg'
},
{
  'upper': 'WE JUST TAKE THE GET REQUEST',
  'lower': 'AND PUSH IT ELSEWHERE',
  'url': 'https://i.imgflip.com/1bil.jpg'
},
{
  'upper': 'WHEN YOU SAY YOU ARE GOOD AT PROGRAMMING',
  'lower': 'BUT JUST COPY EVERYTHING FROM THE WEB',
  'url': 'https://i.imgflip.com/jrj7.jpg'
},
{
  'upper': 'CODES A BEAUTIFUL OMM EXERCISE',
  'lower': '"UNI2WORK IS NOT AVAILABLE AT THE MOMENT"',
  'url': 'https://i.imgflip.com/1bip.jpg'
}
]
*/

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
  let db = req.db;
  let memeData = db.get('memes');

  memeData.find()
    .then((docs) => res.json({ code: 200, docs }))
    .catch((e) => res.status(500).send())

});

memeIO.post('/upload', (req, res) =>{
  console.log(req);
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let sampleFile = req.files.sampleFile;
  const fileName = req.files.sampleFile.name;
  const path =__dirname + '/public/uploadedImages/' + fileName;

  // Use the mv() method to place the file somewhere on your server
  sampleFile.mv(path, function(err) {
    if (err)
      return res.status(500).send(err);

    res.send('File uploaded!');
  });
});




memeIO.post("/save-meme", (req, res) => {
  let db = req.db;
  let memeData = db.get('memes');
  let meme = {
    upper: req.body.upper,
    lower: req.body.lower,
    url: req.body.url
  };


  memeData.insert(meme)
    .then((docs) => {
      // docs contains the documents inserted with added **_id** fields
      // Inserted 3 documents into the document collection
    }).catch((err) => {
      // An error happened while inserting
    })

  res.json({
    code: 201,
    message: 'saved'
  })

});

module.exports = memeIO;