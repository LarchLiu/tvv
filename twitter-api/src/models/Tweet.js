/* eslint-disable func-names */
const mongoose = require('mongoose');
require('mongoose-long')(mongoose);

const { Types: { Long } } = mongoose;

const TweetSchema = new mongoose.Schema({
  hashtags: [String],
  html: String,
  id: String,
  isquoted: Boolean,
  ispin: Boolean,
  isreply: Boolean,
  isretweet: Boolean,
  likes: Long,
  permanenturl: String,
  photos: [String],
  replies: Long,
  retweets: Long,
  text: String,
  timeparsed: Date,
  urls: [String],
  userid: String,
  videos: [{
    id: String,
    preview: String,
    url: String,
  }],
});

module.exports = mongoose.model('tweets', TweetSchema);
