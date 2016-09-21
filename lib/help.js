'use strict';
var talk = require('../dictionary/talk.js');
var hear = require('../dictionary/hear.js');
var config = require('../config.js');
var lan = config.lan;

exports.hearHelp = function (bot, controller) {

  controller.hears(hear.dictionary.help[lan], 'direct_message,direct_mention,mention', function (bot, message) {

    controller.storage.users.get(message.user, function (err, user) {

      bot.startConversation(message, function (err, convo) {

        convo.ask(talk.dictionary.hello[lan] + ", " + user.real_name + talk.dictionary.ask_what[lan],[
                      {
                          pattern: hear.dictionary.yes[lan],
                          callback: function(response, convo) {
                            convo.say(talk.dictionary.answer_help[lan]);
                            convo.next();
                          }
                    },
                    {
                        pattern: hear.dictionary.no[lan],
                        callback: function(response, convo) {
                            convo.say(talk.dictionary.nevermind[lan]);
                            convo.next();
                        }
                    }]);


      //TODO have to prepare for interactive_message_callback with a webhook, more information at the end of:
      //https://github.com/howdyai/botkit/blob/master/readme-slack.md -> message buttons
      /*  convo.ask({
        attachments:[
            {
                title: talk.dictionary.hello[lan] + ", " + user.real_name + talk.dictionary.ask_what[lan],
                callback_id: '123324234234',
                attachment_type: 'default',
                actions: [
                    {
                        "name":hear.dictionary.yes[lan],
                        "text": hear.dictionary.yes[lan],
                        "value": hear.dictionary.yes[lan],
                        "type": "button",
                    },
                    {
                        "name":hear.dictionary.no[lan],
                        "text": hear.dictionary.no[lan],
                        "value": hear.dictionary.no[lan],
                        "type": "button",
                    }
                ]
            }
        ]
    },[
              {
                  pattern: hear.dictionary.yes[lan],
                  callback: function(reply, convo) {
                    convo.say(talk.dictionary.answer_help[lan]);
                    convo.next();
                  }
            },
            {
                pattern: hear.dictionary.no[lan],
                callback: function(reply, convo) {
                    convo.say(talk.dictionary.nevermind[lan]);
                    convo.next();
                }
            },
            {
                default: true,
                callback: function(reply, convo) {
                    // do nothing
                }
            }
      ]);*/


      });
    })
  });
}
