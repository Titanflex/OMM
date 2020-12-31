const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memeSchema = new Schema(
    {
        //title: String,
        upper: String,
        lower: String,
        //text: [{ body: String, positionX: Number, positionY: Number, Style: String }],
        url: String,
        //creator: String,
        //creationDate: { type: Date, default: Date.now },
        //public: Boolean,

        //likes: Number,
        //comments: [{ body: String, date: Date, user: String }],

    }
);

module.exports = mongoose.model('Meme', memeSchema);