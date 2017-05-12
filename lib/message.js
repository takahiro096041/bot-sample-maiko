'use strict';
const config = require('../config.json');
const LINEBot = require('line-messaging');
const bot = LINEBot.create(config.line);
const drinkManager = require('./drinkManager');

exports.handle = function(incident) {
  switch (incident.message.text) {
    case '何か飲みたい':
      { // case内で変数宣言するといいは {} で囲ったほうがいいらしい
        bot.pushTextMessage(incident.source.userId, 'ええどすえ。どちらがご希望どすか〜？');
        const buttons = new LINEBot.ButtonTemplateBuilder();
        buttons.setMessage('飲み物');
        buttons.addAction('お酒', 'action=drink-category&category=alcohol', LINEBot.Action.POSTBACK);
        buttons.addAction('ソフトドリンク', 'action=drink-category&category=softdrink', LINEBot.Action.POSTBACK);

        const template = new LINEBot.TemplateMessageBuilder('button template', buttons);

        bot.replyMessage(incident.replyToken, template).catch(err => {
          console.log(err);
        });
        return;
      }
    case 'おわり':
      drinkManager.getAlcohol(incident.source.userId)
        .then(alcohol => {
          let message = `今回飲まはったアルコールの量は 約${Math.floor(alcohol)}ml どすわ〜。`;

          if (alcohol == 0) {
            message += '全く飲まはらへんのやね〜。残念やわぁ。';
          } else if (alcohol <= 40) {
            message += 'ちょうどええくらいの量どす。健康に気を使ってはるんどすか？';
          } else {
            message += '飲み過ぎとちゃいますか？次からは控えなはれや〜。';
          }
          message += 'またよろしく頼んます〜。';

          bot.replyTextMessage(incident.replyToken, message);
          drinkManager.reset(incident.source.userId);
        }).catch(err => {
          console.log(err);
        })
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
}
