'use strict';
var talk = require('../dictionary/talk.js');
var hear = require('../dictionary/hear.js');
var config = require('../config.js');
var firebaseref = require('firebase');
var myFirebaseRef = firebaseref.database();
var urlPattern = '(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})';
var lan = config.lan;

exports.hearRecover = function(bot, controller) {
  controller.hears(hear.dictionary.recover[lan], 'direct_message,direct_mention,mention', function(bot, message){
    var askLoadLinks = function(err, convo){
      convo.ask(talk.dictionary.ask_for_tags[lan],function (response,convo){
        controller.storage.users.get(response.user, function(err, user) {
            //Search tags from user input text
            myFirebaseRef.ref('tags').child(response.text.trim()).once('value').then(function(tag){
              var keys = Object.keys(tag.val().linkId);
              bot.reply(message, talk.dictionary.link_found);
                for(var i = 0; i < keys.length; i++) {
                  myFirebaseRef.ref('links').child(keys[i]).once('value').then(callback,function(link){
                    callback(link);
                  });
                }
            });
            function callback(result){
              bot.reply(message, result.val().url);
              convo.stop();
            }
        });
      });
    }
    bot.startConversation(message,askLoadLinks);
  });
}


exports.hearLink = function(bot, controller) {



  controller.hears([urlPattern], 'ambient', function(bot, message) {

      var linkMessage = message.text.substring(1, message.text.length - 1);

      var askStoreLink = function(err, convo) {
        console.log(convo);
          convo.say(talk.dictionary.url_detected[lan]);
          convo.ask(talk.dictionary.ask_save_url[lan],
             [
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

          var writtenTags = response.text.split(",");
          controller.storage.users.get(response.user, function(err, user) {
              var jarrayTags = "{";
              writtenTags.forEach(function(tagString){
                jarrayTags += "\""+ tagString +"\":true,";
              });
              jarrayTags = jarrayTags.slice(0,-1) + "}";
              var tags = JSON.parse(jarrayTags);
              var linkData = {
                    user: {
                      id: response.user,
                      name: user.real_name

                    },
                    url: linkMessage,
                    tags,
                    date: new Date().toISOString()
                  };
              var linkKey = myFirebaseRef.ref('links').push().key;
              var updates = {};
              updates['/links/' + linkKey] = linkData;
              for(var i = 0; i < writtenTags.length; i++){
                      updates['/tags/' + writtenTags[i].trim() + '/linkId/' + linkKey] = true;
              }

              myFirebaseRef.ref().update(updates);

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
