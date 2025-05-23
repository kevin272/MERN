const mongoose = require('mongoose');
const { statusType } = require('../../config/constants.config');

const CampaignSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 150
    },
    description: {
        type: String,
        required: true,
        minlength: 10
    },
    goalAmount: {
        type: Number,
        required: true,
        min: 1 //  Minimum goal amount
    },
    raisedAmount: {  //  New field for total donations
    type: Number,
    default: 0  
  },
  donors: [{      
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true }
  }],
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        unique: true,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(statusType), //  e.g., 'pending', 'active', 'successful', 'failed'
        default: statusType.PENDING 
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', //  Reference to the User model
        required: true
    }
    
}, {
    timestamps: true
});

const CampaignModel = mongoose.model('Campaign', CampaignSchema);

module.exports = CampaignModel;