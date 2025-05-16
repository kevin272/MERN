const mongoose = require('mongoose');
const { statusType } = require('../../config/constants.config');
const { UserRoles } = require('../../config/constants.config');

const InvestorSchema = new mongoose.Schema({
    title:{
        type: String,
        unique: true,
        required: true,
    min:3,
    max:100
    },
    image:{
        type: String,
        required: true,
    },
    slug:{
        type:String,
        unique: true,
        required: true,
 
    },
    status:{
        type:String,
        enum: Object.values(statusType),
        default: statusType.ACTIVE
    },
    createdBy:{
        type: mongoose.Types.ObjectId,
        ref: 'User',
        default: null
    }
},
    {
        timestamps: true,
        autoCreate: true,
        autoIndex: true
    });



const InvestorModel = mongoose.model('Investor', InvestorSchema);


module.exports = InvestorModel;