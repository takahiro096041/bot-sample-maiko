'use strict';
const config = require('../config.json');
const LINEBot = require('line-messaging');
const bot = LINEBot.create(config.line);

exports.handle = function(incident) {
  switch (incident.message.text) {
    case '何か飲みたい':
      bot.replyTextMessage(incident.replyToken, `ええどすえ〜`);
      return;
    case '踊ってよ':

      return;
    case '唄ってよ':
      return;
    default:
      break;
  }
};

// bot.replyTextMessage(incident.replyToken, `リプライ方法`);
