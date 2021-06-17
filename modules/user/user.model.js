const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

let addressSchema = mongoose.Schema({
  type: { type: String, default: 'Home', enum: ['Home', 'Work'] },
  country: { type: String, default: '' },
  state: { type: String, default: '' },
  city: { type: String, default: '' },
});

const UserSchema = mongoose.Schema(
  {
    firstName: { type: String, required: true, default: '' },
    lastName: { type: String, default: '' },
    dob: { type: Date, default: null },
    gender: {
      type: String,
      enum: ['NA', 'male', 'female', 'dont_disclose'],
      default: 'NA',
    },
    email: {
      type: String,
      unique: true,
      index: true,
      immutable: true, // Email cannot be changed
      set: v => v.toLowerCase(),
    },
    role: {
      type: String,
      default: 'user',
      enum: ['admin', 'user'],
    },
    profilePic: {
      uploadType: {
        type: String,
      },
      fileInfo: {
        type: Object,
      },
    },
    password: { type: String },
    incorrectAttempts: { type: Number, default: 0 },
    address: [addressSchema],
    resetPasswordToken: { type: String },
    status: {
      type: String,
      enum: ['active', 'inActive', 'blocked', 'email_verification_pending'],
      default: 'active',
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    lastLoginTime: {
      type: Date,
      default: null,
    },
  },
  {
    collection: 'users',
    timestamps: {
      createdAt: true,
      updatedAt: true,
    },
  }
);
UserSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('User', UserSchema);
