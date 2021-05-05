/* eslint-disable func-names */
/* eslint-disable consistent-return */
const connectToDatabase = require('../../db');
const UpdateInfo = require('../../models/UpdateInfo');

exports.execute = async function (req, res) {
  if (req.method.toLowerCase() === 'get') {
    try {
      await connectToDatabase();
      const updateInfo = await UpdateInfo.findOne().sort({ updatetime: -1 });
      return res.status(200).json({ data: updateInfo });
    } catch (err) {
      return res.json({ err });
    }
  } else if (req.method.toLowerCase() === 'post') {
    try {
      const { Info, Type } = req.body;
      const updateInfo = {};

      if (Info) {
        const keys = Object.keys(Info);
        keys.forEach((key) => {
          updateInfo[key.toLowerCase()] = Info[key];
        });
      }
      global.PUSHER.trigger('update-info', 'scraper-post', {
        type: Type, updateInfo,
      });
      return res.status(200).json({ data: 'success' });
    } catch (err) {
      return res.json({ err });
    }
  }
};
