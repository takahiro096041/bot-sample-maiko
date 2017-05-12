'use strict';
const LINEBot = require('line-messaging');
const bot = LINEBot.create({
  channelID: '1495338495',
  channelSecret: '84ecca09fddf909c55f2ea32f3c38716',
  channelToken: 'mj6aCZbooHbPDYEod8PN5gkNzAHkW0X+XNKDeG+PQHJzDI5o+4Vl5cZW3ufktRimBgV31Xv+hKEaJ4E2mifnWlCAg0xWiIEubXEZJXgXSs5vcd+xEcQDPgxzkgNe7jF3NJRUNPfU2t74MBJqmZH8IAdB04t89/1O/w1cDnyilFU='
});
const esmart = require('./esmart');
const stateManager = require('./stateManager');

exports.text = function(incident) {
  switch (incident.message.text) {
    case 'カテゴリーを選ぶ':
      const carousel = makeCategoryKbnCarousel();
      const temp = new LINEBot.TemplateMessageBuilder('カテゴリーを選んでね', carousel);
      bot.replyMessage(incident.replyToken, temp);
      return;
    case 'フリーワード検索':
      stateManager.saveState({
        userId: incident.source.userId,
        state: '00'
      }, function() {});
      bot.replyTextMessage(incident.replyToken, `よっしゃ、全カテゴリーを検索するから、食事の名前を入力してや〜。空白で単語を繋いで教えてくれてもええで〜。`);
      return;
    default:
      stateManager.getState(incident.source.userId, function(state) {
        console.log();
        const kbn = state.freewordSearchKbn || '00';
        makeFreeSearchMessage(kbn, incident.message.text, function(message) {
          bot.replyTextMessage(incident.replyToken, message);
        });
      });
      break;
  }
}

exports.postback = function(incident) {
  let data = fetchData(incident.postback.data);
  data.userId = incident.source.userId;
  stateManager.saveState(data, function() {});

  let kbn = "";
  if (data.freewordSearchKbn == '01') {
    kbn = '一般料理';
  } else if (data.freewordSearchKbn == '02') {
    kbn = '市販食品';
  } else if (data.freewordSearchKbn == '03') {
    kbn = '外食・コンビニ';
  }
  bot.replyTextMessage(incident.replyToken, 'よっしゃ、' + kbn + 'で調べるから、食事の名前を入力してや〜。空白で単語を繋いで教えてくれてもええで〜。');
}

function makeFreeSearchMessage(kbn, keyword, callback) {
  esmart.getKey(function(key) {
    esmart.freewordSearch(key, kbn, keyword, function(data) {
      if (!data) {
        callback('見つからへんかったわ〜すまんな〜。');
      } else {
        let message = '';
        data.forEach(function(food) {
          message += `・${food.foodName}：${food.calorie}kcal(${food.amount}${food.amountUnit})\n`;
        });
        callback(message.substr(0, message.length - 1));
      }
    });
  })
}

function makeCategoryKbnCarousel() {
  const col1 = new LINEBot.CarouselColumnTemplateBuilder();
  col1.setMessage('一般料理')
    .addAction('キーワード検索', 'freewordSearchKbn=01', LINEBot.Action.POSTBACK)
    .setThumbnail('https://s3-ap-northeast-1.amazonaws.com/harapeko-mogami/original.jpg');
  const col2 = new LINEBot.CarouselColumnTemplateBuilder();
  col2.setMessage('市販食品')
    .addAction('キーワード検索', 'freewordSearchKbn=02', LINEBot.Action.POSTBACK)
    .setThumbnail('https://s3-ap-northeast-1.amazonaws.com/harapeko-mogami/shihan.jpg')
  const col3 = new LINEBot.CarouselColumnTemplateBuilder();
  col3.setMessage('外食・コンビニ')
    .addAction('キーワード検索', 'freewordSearchKbn=03', LINEBot.Action.POSTBACK)
    .setThumbnail('https://s3-ap-northeast-1.amazonaws.com/harapeko-mogami/konbini.jpg')
  const carousel = new LINEBot.CarouselTemplateBuilder([col1, col2, col3]);
  return carousel;
}

function fetchData(data) {
  let obj = {};
  const params = data.split('&');
  params.forEach(function(param) {
    const p = param.split('=');
    obj[p[0]] = p[1];
  });
  return obj;
}
