'use strict';
const config = require('../config.json');
const LINEBot = require('line-messaging');
const bot = LINEBot.create(config.line);
const drink = require('../drink.json');

exports.handle = function(incident) {
  const query = fetchData(incident.postback.data);

  switch (query.action) {
    case 'drink-category':
      {
        const buttons = new LINEBot.ButtonTemplateBuilder();
        if (query.category === 'alcohol') {
          buttons.setTitle('お酒');
          buttons.setMessage('お酒どすか、どちらにしはりますか〜？');
          // buttons.setThumbnail('https://example.com/bot/images/image.jpg');
          buttons.addAction('日本酒', 'action=alcohol-category&category=sake', LINEBot.Action.POSTBACK);
          buttons.addAction('ビール', 'action=alcohol-category&category=beer', LINEBot.Action.POSTBACK);
          buttons.addAction('カクテル', 'action=alcohol-category&category=cocktail', LINEBot.Action.POSTBACK);

          const template = new LINEBot.TemplateMessageBuilder('button template', buttons);
          bot.replyMessage(incident.replyToken, template);
        } else if (query.category === 'softdrink') {
          buttons.setTitle('ソフトドリンク');
          buttons.setMessage('ソフトドリンクどすか、どちらにしはりますか〜？');
          // buttons.setThumbnail('https://example.com/bot/images/image.jpg');
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
        alcohols.forEach(function(element, index, array){
          const col = new LINEBot.CarouselColumnTemplateBuilder();
          col.setTitle(element.name)
            .setMessage(element.desc)
            .addAction('これにする', 'action=choice&amount='+element.alcohol, LINEBot.Action.POSTBACK)
            .setThumbnail(element.url);
            cols.push(col);
        });
        const carousel = new LINEBot.CarouselTemplateBuilder(cols);
        const template = new LINEBot.TemplateMessageBuilder('carousel template', carousel);
        bot.replyMessage(incident.replyToken, template).catch(function(error){
          console.log(error);
        });
      }
      break;
      case 'choice':
      {
        //アルコール度数の記録
        console.log('アルコール量 = '+query.amount);
        
        if(query.amount > 0){
          var textMessageBuilder = new LINEBot.TextMessageBuilder('よく飲みはりますね〜');
          bot.replyMessage(incident.replyToken, textMessageBuilder);
        }else{
          var textMessageBuilder = new LINEBot.TextMessageBuilder('もうお酒はやめときなはれ〜');
          bot.replyMessage(incident.replyToken, textMessageBuilder);
        }
      }
      break;
    default:
      break;

  }
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
