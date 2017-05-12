'use strict';
const config = require('../config.json');
const LINEBot = require('line-messaging');
const bot = LINEBot.create(config.line);

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
      if (query.category === 'sake') {
        const col1 = new LINEBot.CarouselColumnTemplateBuilder();
        col1.setTitle('十四代')
          .setMessage('近年の日本酒の味の潮流である「芳醇旨口」を代表する酒。若き15代目当主の高木顕統さんが酒造りを統括し、米の旨みと甘み、エレガントな香り、心地よい余韻を感じる酒に仕上げている。')
          .addAction('これにする', 'sake=juuyondai', LINEBot.Action.POSTBACK)
          .setThumbnail('https://www.saketime.jp/img/brand/review/241/thum_0d315f4a7e1dfa292aa557df31c5ad15.jpg');
        const col2 = new LINEBot.CarouselColumnTemplateBuilder();
        col2.setTitle('而今')
          .setMessage('クリアでフルーティな飲み口と、綺麗な甘み、爽やかな酸味が絶妙に調和し、飲み飽きることがない。')
          .addAction('これにする', 'sake=jikon', LINEBot.Action.POSTBACK)
          .setThumbnail('https://www.saketime.jp/img/brand/review/2078/thum_c42bd90286d96f717b699bfa84641b81.jpg');
        const carousel = new LINEBot.CarouselTemplateBuilder([col1, col2]);
        const template = new LINEBot.TemplateMessageBuilder('button template', carousel);
        bot.replyMessage(incident.replyToken, template);
      } else if (query.category === 'beer') {

      } else if (query.category === 'cocktail') {

      }
      break;
    case 'softdrink-category':
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
