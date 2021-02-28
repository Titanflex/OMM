const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memeSchema = new Schema({
    title: String,
    url: String,
    author: String,

    creationDate: {
        type: Date,
        default: Date.now(),
    },

    isPublic: Boolean,

    publicOpt : String,

    listlikes:[{
        date: Date, 
        user: String
    }],

    dislikes: [{
        date: Date, 
        user: String 
    }],

    description: String,
    caption: Array,
    tags: Array,

    comments: [{ 
        commenttext: String, 
        date: Date, 
        user: String }],

});



module.exports = mongoose.model('Meme', memeSchema);