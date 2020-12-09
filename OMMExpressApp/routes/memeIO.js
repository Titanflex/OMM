var express = require('express');
var memeIO = express.Router();

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

memeIO.use(function (req, res, next) {
  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

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

/* GET home page. */
memeIO.get("/get-memes", (req, res) => {
  res.json({
    code: 200,
    memes
  })
});

memeIO.post("/save-meme", (req, res) => {
  const meme = req.body;
  memes.push(meme);
  res.json({
    code: 201,
    message: 'saved'
  })
});

module.exports = memeIO;