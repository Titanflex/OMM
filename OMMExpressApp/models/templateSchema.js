const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const templateSchema = new Schema({
    uploader: String,
    templateName: String,
    url: {
        type: String,
        unique: true
    },

    used: [{
        date: Date
    }],

    likes:[{
        date: Date, 
        user: String
    }],

});

module.exports = mongoose.model('template', templateSchema);