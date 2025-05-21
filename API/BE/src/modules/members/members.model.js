const mongoose = require('mongoose');

const TeamSchema = new mongoose.Schema({
    fullname: {   
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    phone: {   
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        required: true
    },
    slug:{
        type: String,
    },
    title:{
        type: String,
        required: true
    },
    expertise: {
        type:String,
        required: true
    },
    facebook: {
        type: String,
    },
    twitter: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    description:{
        type: String,
        required: true
    },
    activationToken: {
        type: String
    },
    activatedFor: {
        type: Date
    },
    // Added Forgot Password Fields
    forgetToken: { 
        type: String,
        default: null
    },
    forgetFor: { 
        type: Date,
        default: null
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Team' 
    }
}, {
    timestamps: true,
    autoIndex: true,
    autoCreate: true
});

const TeamModel = mongoose.model('Team', TeamSchema);

module.exports = TeamModel;
