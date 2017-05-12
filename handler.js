'use strict';
const Message = require('./lib/message');
const Postback = require('./lib/postback');

module.exports.handler = (event, context, callback) => {
  console.log(JSON.stringify(event));
  const events = JSON.parse(event.body).events;
  // LINEBotは同時に複数のメッセージが投げられることがある
  events.forEach(function(incident) {
    if (incident.type == "message") {
      switch (incident.message.type) {
        case "text":
          Message.handle(incident);
          break;
        default:
      }
    } else if (incident.type == 'postback') {
      Postback.handle(incident);
    }
  });
  callback(res);
};

const res = {
  statusCode: 200,
  headers: {},
  body: JSON.stringify({
    message: ''
  })
};
