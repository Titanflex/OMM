const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateSchema = new Schema(
    {
        uploader: String,
        templateName: String,
        img: {
            data: Buffer,
            contentType: String
        }

    }
);

module.exports = mongoose.model('template', templateSchema);

