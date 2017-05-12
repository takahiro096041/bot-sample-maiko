'use strict';
const config = require('../config.json');
const LINEBot = require('line-messaging');
const bot = LINEBot.create(config.line);

exports.handle = function(incident) {
  switch (incident.message.text) {
    case '何か飲みたい':
      { // case内で変数宣言するといいは {} で囲ったほうがいいらしい
        bot.pushTextMessage(incident.source.userId, 'ええどすえ。どちらがご希望どすか〜？')
        .catch(err => console.log(err));
        const buttons = new LINEBot.ButtonTemplateBuilder();
        buttons.setTitle('飲み物');
        buttons.addAction('お酒', 'action=drink-category&category=alcohol', LINEBot.Action.POSTBACK);
        buttons.addAction('ソフトドリンク', 'action=drink-category&category=softdrink', LINEBot.Action.POSTBACK);

        const template = new LINEBot.TemplateMessageBuilder('button template', buttons);

        bot.replyMessage(incident.replyToken, template);
        return;
      }
    case '踊ってよ':
      return;
    case '唄ってよ':
      return;
    case '触らせてよ':
      var textMessageBuilder = new LINEBot.TextMessageBuilder('お触りはあきまへん！！');
      bot.replyMessage(incident.replyToken, textMessageBuilder);
      return;
    default:
      break;
  }
};
