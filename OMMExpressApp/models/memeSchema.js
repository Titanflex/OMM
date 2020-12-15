const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MemeSchema = new Schema(
    {
        upper: String,
        lower: String,
        url: String
    }
);

module.exports = mongoose.model('memes', MemeSchema);