'use strict';
const MessageHandler = require('./lib/messageHandler');

module.exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event));
  let events = JSON.parse(event.body).events;
  // LINEBotは同時に複数のメッセージが投げられることがある
  events.forEach(function(incident) {
    if (incident.type == "message") {
      switch (incident.message.type) {
        case "text":
          MessageHandler.text(incident);
          break;
        default:
      }
    }else if(incident.type == 'postback') {
      MessageHandler.postback(incident);
    }
  });
  callback(res);
}

const res = {
  statusCode: 200,
  headers: {},
  body: JSON.stringify({
    message: ''
  })
};
