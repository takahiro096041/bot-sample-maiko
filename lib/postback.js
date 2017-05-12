'use strict';
const config = require('../config.json');
const LINEBot = require('line-messaging');
const bot = LINEBot.create(config.line);

exports.handle = function(incident) {
  const data = fetchData(incident.postback.data);
  bot.replyTextMessage(incident.replyToken, 'リプライ');
};

// postbackについてくるクエリストリングをオブジェクトにする関数
function fetchData(data) {
  let obj = {};
  const params = data.split('&');
  params.forEach(function(param) {
    const p = param.split('=');
    obj[p[0]] = p[1];
  });
  return obj;
}
