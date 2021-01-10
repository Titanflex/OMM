const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const memeSchema = new Schema(
    {
        //title: String,
        upper: String,
        lower: String,
        //text: [{ body: String, positionX: Number, positionY: Number, Style: String }],
        url: String,
        image: {
            type: Buffer
        },
        imageType: {
            type: String
        }
        //creator: String,
        //creationDate: { type: Date, default: Date.now },
        //public: Boolean,

        //likes: Number,
        //comments: [{ body: String, date: Date, user: String }],

    }
);

memeSchema.virtual('imagePath').get(function() {
    if (this.image != null && this.imageType != null) {
        return `data:${this.imageType};charset=utf-8;base64,${this.image.toString("base64")}`
    }
})

module.exports = mongoose.model('Meme', memeSchema);