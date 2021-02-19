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

    likes: {
        type: Number,
        default: 0,
    },

    //likes:[{date: Date, user: String }],
    

    description: String,
    caption: Array,
    tags: Array,

    comments: [{ body: String, date: Date, user: String }],

});

memeSchema.virtual('imagePath').get(function() {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString("base64")}`
    }
})

module.exports = mongoose.model('Meme', memeSchema);