/* eslint-disable func-names */
/* eslint-disable consistent-return */
const connectToDatabase = require('../db');
const Tweet = require('../models/Tweet');

exports.execute = async function (req, res) {
  if (req.method.toLowerCase() === 'get') {
    const id = req.query.id || '';
    const username = req.query.username || '';
    const page = req.query.page || 0;
    const pageNum = req.query.pageNum || 20;
    let tweets;
    try {
      await connectToDatabase();
      if (id) {
        tweets = await Tweet.find({ id });
      } else {
        tweets = await Tweet.find({ username }).skip(page * pageNum).limit(pageNum).sort({ timestamp: -1 });
      }
      return res.status(200).json({ data: tweets });
    } catch (err) {
      return res.json({ err });
    }
  }
};
