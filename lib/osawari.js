'use strict';
const config = require('../config.json');
const LINEBot = require('line-messaging');
const bot = LINEBot.create(config.line);

exports.handle = function(incident) {
  var rand = Math.floor( Math.random() * 100 ) + 1 ;
  var message = "";　
    
  if(rand == 77 || rand == 76 || rand == 75){
    // 特別メッセージ チキショーの絵
    var image = new LINEBot.ImageMessageBuilder('https://stat.ameba.jp/user_images/20140320/06/nob-taniguchi/10/a0/j/o0480085212880785011.jpg?caw=800','https://stat.ameba.jp/user_images/20140320/06/nob-taniguchi/10/a0/j/o0480085212880785011.jpg?caw=800');
    bot.replyMessage(incident.replyToken,image);
    return;
  }else if(rand%10 == 0){
    // 画像付きメッセージ
    if(rand == 10 || rand == 20 || rand == 30 ){
      var image = new LINEBot.ImageMessageBuilder('https://i2.wp.com/hosyusokuhou.jp/wp/wp-content/uploads/2016/01/03e4d069-s.png?resize=690%2C387','https://i2.wp.com/hosyusokuhou.jp/wp/wp-content/uploads/2016/01/03e4d069-s.png?resize=690%2C387');
      bot.replyMessage(incident.replyToken,image);
      return;
    }
    else if(rand == 40 || rand == 50 || rand == 60 ){
      var image = new LINEBot.ImageMessageBuilder('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQypxlvitvLvAKwjDyQx3GlL8XzQKiaKgL_VrWN9tlsBtFmI0uW','https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQypxlvitvLvAKwjDyQx3GlL8XzQKiaKgL_VrWN9tlsBtFmI0uW');
      bot.replyMessage(incident.replyToken,image);
      return;
    }
    else{
      message = 'いやん♪';
    }
  }
  else if(rand%10 == 1){
    message = 'お触りはあきまへん！！';
  }
  else if(rand%10 == 2){
    message = 'お姉さんに言いつけますで！！';
  }
  else if(rand%10 == 3){
    message = '悪いんはこのおててやね！';
  }
  else if(rand%10 == 4){
    message = 'やめておくんなまし';
  }
  else if(rand%10 == 5){
    message = 'いややわぁ';
  }
  else if(rand%10 == 6){
    message = 'しょうもない';
  }
  else if(rand%10 == 7){
    message = 'そんならわてもお酒よばれようかしら';
  }
  else if(rand%10 == 8){
    message = 'あんた、えらいいちびりどんな';
  }
  else if(rand%10 == 9){
    message = 'どうえ？';
  }
    var textMessageBuilder = new LINEBot.TextMessageBuilder(message);
    bot.replyMessage(incident.replyToken, textMessageBuilder);
    return;
};
