'use strict';
var talk = require('../dictionary/talk.js');
var hear = require('../dictionary/hear.js');
var config = require('../config.js');
var lan = config.lan;

exports.hearHelp = function (bot, controller) {

  controller.hears(hear.dictionary.help[lan], 'direct_message,direct_mention,mention', function (bot, message) {

    controller.storage.users.get(message.user, function (err, user) {

      bot.startConversation(message, function (err, convo) {

        convo.ask(talk.dictionary.hello[lan] + user.real_name+ talk.dictionary.ask_what[lan],[
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


      });
    })
  });
}
