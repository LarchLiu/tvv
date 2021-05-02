/* eslint-disable func-names */
/* eslint-disable consistent-return */
const connectToDatabase = require('../db');
const User = require('../models/User');

exports.execute = async function (req, res) {
  if (req.method.toLowerCase() === 'get') {
    const username = req.query.username || '';
    let users;
    try {
      await connectToDatabase();
      if (username) {
        users = await User.find({ 'userinfo.username': username });
      } else {
        users = await User.find();
      }
      return res.status(200).json({ data: users });
    } catch (err) {
      return res.json({ err });
    }
  }
};
