const mongoose = require('mongoose')

const ProvinceSchema = new mongoose.Schema({
name: {
    type: String,
    enum : ["Madhesh Pradesh",
"Bagmati Province",
"Gandaki",
"Lumbini",
"Karnali",
"Sudurpaschim"],
district: String,
wardNo: Number,
houseAddress: String
}
})

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        min: 2,
        max: 50, 
        required : true
    },
    email: {
        type: String,
        required : true,
        unique : true
    },
    password: {
        type: String,
        required : true,
        max: 13
    },
    role: {
        type: String,
        enum: [...Object.values(UserRoles)],
        default: UserRoles.CUSTOMER
    },
    status: {
        type: String,
        enum: [...Object.values(StatusType)],
        default: StatusType.INACTIVE
    },
    activationToken : String,
    activateFor: Date,
phone: String,
address: {
    permanent:AddressSchema,
    temporary: AddressSchema
},  /// explain
forgetToken: String,
forgetFor: Date,
image: String,
createdBy: {
  type: mongoose.Types.ObjectId,
  ref: "User",
  default: null
},

},{
    timestamps: true,
    autoIndex: true,
    autoCreate: true
});

const UserModel = mongoose.model("User",UserSchema);
//authusers

module.exports= UserModel;