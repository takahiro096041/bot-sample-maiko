'use strict';
const config = require('../config.json');
const LINEBot = require('line-messaging');
const bot = LINEBot.create(config.line);
const drink = require('../drink.json');
const drinkManager = require('./drinkManager');

exports.handle = function(incident) {
  const query = fetchData(incident.postback.data);

  switch (query.action) {
    case 'drink-category':
      {
        const buttons = new LINEBot.ButtonTemplateBuilder();
        if (query.category === 'alcohol') {
          console.log(query);
          if (!query.retry) {
            return drinkManager.getAlcohol(incident.source.userId)
              .then(alcohol => {
                if ((alcohol || 0) > 40) {
                  bot.pushTextMessage(incident.source.userId, '飲み過ぎてますよ〜？そろそろやめといたほうがええんとちゃいますか？');
                  buttons.setMessage('飲み物');
                  buttons.addAction('お酒', 'action=drink-category&category=alcohol&retry=1', LINEBot.Action.POSTBACK);
                  buttons.addAction('ソフトドリンク', 'action=drink-category&category=softdrink', LINEBot.Action.POSTBACK);

                  const template = new LINEBot.TemplateMessageBuilder('button template', buttons);

                  bot.replyMessage(incident.replyToken, template);
                } else {
                  bot.pushTextMessage(incident.source.userId, 'お酒どすか、どちらにしはりますか〜？');
                  buttons.setMessage('お酒');
                  buttons.addAction('日本酒', 'action=alcohol-category&category=sake', LINEBot.Action.POSTBACK);
                  buttons.addAction('ビール', 'action=alcohol-category&category=beer', LINEBot.Action.POSTBACK);
                  buttons.addAction('カクテル', 'action=alcohol-category&category=cocktail', LINEBot.Action.POSTBACK);

                  const template = new LINEBot.TemplateMessageBuilder('button template', buttons);
                  bot.replyMessage(incident.replyToken, template);
                }
              }).catch(err => {
                console.log(err.stack);
              });
          } else {
            bot.pushTextMessage(incident.source.userId, 'お酒どすか、どちらにしはりますか〜？');
            buttons.setMessage('お酒');
            buttons.addAction('日本酒', 'action=alcohol-category&category=sake', LINEBot.Action.POSTBACK);
            buttons.addAction('ビール', 'action=alcohol-category&category=beer', LINEBot.Action.POSTBACK);
            buttons.addAction('カクテル', 'action=alcohol-category&category=cocktail', LINEBot.Action.POSTBACK);

            const template = new LINEBot.TemplateMessageBuilder('button template', buttons);
            bot.replyMessage(incident.replyToken, template);
          }
        } else if (query.category === 'softdrink') {
          bot.pushTextMessage(incident.source.userId, 'ソフトドリンクどすか、どちらにしはりますか〜？');
          buttons.setMessage('ソフトドリンク');
          buttons.addAction('炭酸', 'action=softdrink-category&category=tansan', LINEBot.Action.POSTBACK);
          buttons.addAction('フルーツ', 'action=softdrink-category&category=fruit', LINEBot.Action.POSTBACK);
          buttons.addAction('お茶', 'action=softdrink-category&category=tea', LINEBot.Action.POSTBACK);
          buttons.addAction('水', 'action=softdrink-category&category=water', LINEBot.Action.POSTBACK);

          const template = new LINEBot.TemplateMessageBuilder('button template', buttons);
          bot.replyMessage(incident.replyToken, template);
        }
      }
      break;
    case 'alcohol-category':
    case 'softdrink-category':
      {
        const alcohols = drink[query.category];
        var cols = new Array();
        alcohols.forEach(function(element, index, array) {
          const col = new LINEBot.CarouselColumnTemplateBuilder();
          col.setTitle(element.name)
            .setMessage(element.desc)
            .addAction('これにする', 'action=choice&amount=' + element.alcohol, LINEBot.Action.POSTBACK)
            .setThumbnail(element.url);
          cols.push(col);
        });
        const carousel = new LINEBot.CarouselTemplateBuilder(cols);
        const template = new LINEBot.TemplateMessageBuilder('carousel template', carousel);
        bot.replyMessage(incident.replyToken, template).catch(function(error) {
          console.log(error);
        });
      }
      break;
    case 'choice':
      {
        if (query.amount > 0) {
          // 飲んだ量の記録
          drinkManager.drink(incident.source.userId, query.amount);
          bot.replyTextMessage(incident.replyToken, 'ええ飲みっぷりやわ〜');
        } else {
          bot.replyTextMessage(incident.replyToken, 'ソフトドリンクもおいしゅうございますな〜');
        }
      }
      break;
    default:
      break;

  }
}

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
