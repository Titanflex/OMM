const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateSchema = new Schema(
    {
        uploader: String,
        templateName: String,
        url: String

    }
);

module.exports = mongoose.model('template', templateSchema);

