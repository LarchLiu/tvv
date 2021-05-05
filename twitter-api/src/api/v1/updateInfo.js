/* eslint-disable no-console */
/* eslint-disable func-names */
/* eslint-disable consistent-return */
const Pusher = require('pusher');
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
      console.log(Info, Type);

      if (Info) {
        const keys = Object.keys(Info);
        keys.forEach((key) => {
          updateInfo[key.toLowerCase()] = Info[key];
        });
      }
      const {
        PUSHER_APP_ID: appId,
        PUSHER_KEY: key,
        PUSHER_SECRET: secret,
      } = process.env;
      const pusher = new Pusher({
        appId,
        key,
        secret,
        cluster: 'ap3',
        useTLS: true,
      });
      pusher.trigger('update-info', 'scraper-post', {
        type: Type, updateInfo,
      }, () => {
        console.log('push finish');
      });
      return res.status(200).json({ data: 'success' });
    } catch (err) {
      return res.json({ err });
    }
  }
};
