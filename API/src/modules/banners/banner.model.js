const { ref } = require('joi');
const mongoose = require('mongoose');


const BannerSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    min:3,
    max:100
    },
    image:{
        type: String,
        required: true,
    },
    link:{
        type:String,
        default:null
    },
    status:{
        type:String,
        enum: Object.values(...statusType),
        default: statusType.ACTIVE
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'Users',
        default: null
    }
},
    {
        timestamps: true,
        autoCreate: true,
        autoIndex: true
    });



const BannerModel = mongoose.model('Banner', BannerSchema);


module.exports = BannerModel;