'use strict';
var talk = require('../dictionary/talk.js');
var hear = require('../dictionary/hear.js');
var config = require('../config.js');
var myFirebaseRef = new Firebase(config.firebase_url);
var urlPattern = '(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})';
var lan = config.lan;

exports.hearLink = function(bot, controller) {

  controller.hears([urlPattern], 'ambient', function(bot, message) {

      var linkMessage = message.text;

      var askStoreLink = function(err, convo) {
          convo.say(talk.dictionary.url_detected[lan]);
          convo.ask(talk.dictionary.ask_save_url[lan], [
              {
                  pattern: hear.dictionary.yes[lan],
                  callback: function(response, convo) {
                    askTags(response, convo);
                    convo.next();
                  }
            },
            {
                pattern: hear.dictionary.no[lan],
                callback: function(response, convo) {
                    convo.say(talk.dictionary.nevermind[lan])
                    convo.next();
                }
            },
            {
                default: true,
                callback: function(response, convo) {
                    convo.repeat();
                    convo.next();
                }
            }
            ]);
      }

      var askTags = function (response, convo){
        convo.ask(talk.dictionary.ask_tag[lan],function(response,convo){

          var tags = response.text.split(",");
          controller.storage.users.get(response.user, function(err, user) {
              console.log(tags);
              var link = myFirebaseRef.child('links').push({
                    user: {
                      id: response.user,
                      name: user.real_name

                    },
                    link: {
                      message: linkMessage,
                      tags: tags.map(function(s) { return s.trim() })
                    },

                    date: new Date().toISOString()
                  });

                });
                convo.stop();
          });

          convo.on('end', function(convo) {
            bot.reply(message, talk.dictionary.conv_link_ok[lan]);
          });

      }


      bot.startConversation(message, askStoreLink);

    });
}
