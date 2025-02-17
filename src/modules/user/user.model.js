// src/modules/user/user.model.js

const mongoose = require('mongoose');
const { Schema } = mongoose;


const OTPSchema = new Schema({
  code: { type: String, required: false, default: undefined },
  expireIn: { type: Number, required: false, default: 0 },
})

const UserSchema = new Schema({
  firstName: {
    type: String, required: false,
  },
  mobile: {
    type: String, required: false, unique: true
  },
  otp: {
    type: OTPSchema,
    default: null,
  },
  verifiedMobile: { type: Boolean, default: false, required: true },
  accessToken: { type: String },
}, { timestamps: true });

const UserModel = mongoose.model('User', UserSchema);

module.exports = UserModel;
