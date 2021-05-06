/* eslint-disable func-names */
const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const { Types: { Long } } = mongoose;

const UpdateSchema = new mongoose.Schema({
  updatetime: Long,
  isupdate: Boolean,
  users: [String],
  type: String,
});

module.exports = mongoose.model('updates', UpdateSchema);
