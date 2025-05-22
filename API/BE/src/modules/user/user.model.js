const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); 
const { randomStringGenerator } = require('../../utils/helper');
const { statusType } = require('../../config/constants.config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true, 
        lowercase: true,
        trim: true,
        match: [/.+@.+\..+/, 'Please fill a valid email address'] 
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,
        enum: ['admin', 'member', 'user'],
        default: 'user',
        required: true
    },
    status: {
        type: String,
        enum: [statusType.PENDING, statusType.ACTIVE, statusType.INACTIVE], 
        default: statusType.PENDING,
        required: true
    },
    activationToken: {
        type: String,
        default: null
    },
    activatedFor: {
        type: Date,
        default: null
    },
    title: { 
        type: String,
        maxlength: 100,
        trim: true,
        default: null
    },
    expertise: {
        type: String,
        maxlength: 200,
        trim: true,
        default: null
    },
    bio: { 
        type: String,
        maxlength: 1000,
        trim: true,
        default: null
    },
    image: { 
        type: String,
        default: null 
    },
    facebook: {
        type: String,
        trim: true,
        default: null
    },
    twitter: {
        type: String,
        trim: true,
        default: null
    },
    linkedin: {
        type: String,
        trim: true,
        default: null
    },
    phone: {
        type: String,
        default: null,
    },
    address: {
        type: String,
        maxlength: 255,
        trim: true,
        default: null
    },
    createdBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    }
}, {
    timestamps: true
});

userSchema.pre('save', async function(next) {
    if (this.isModified('password')) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

userSchema.pre('save', function(next) {
    if (this.isNew && this.status === statusType.PENDING && !this.activationToken) {
        this.activationToken = randomStringGenerator(20);
        this.activatedFor = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }
    next();
});

const UserModel = mongoose.model('User', userSchema);
module.exports = UserModel;
