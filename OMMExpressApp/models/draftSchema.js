const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const draftSchema = new Schema({
    author: String,
    creationDate:  {
        type: Date,
        default: Date.now(),
    },
    src: String,
    bold: Boolean,
    italic: Boolean,
    color: String,
    fontSize: Number,
    isFreestyle: Boolean,
    imageProperties: Array,
    canvasWidth: Number,
    canvasHeight: Number,
    text: String,
});


module.exports = mongoose.model('Draft', draftSchema);