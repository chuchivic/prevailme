'use strict';
var talk = require('../dictionary/talk.js');
var hear = require('../dictionary/hear.js');
var config = require('../config.js');
//var myFirebaseRef = new Firebase(config.firebase_url);
var firebaseref = require('firebase');
var myFirebaseRef = firebaseref.database();
var urlPattern = '(https?:\/\/(?:www\.|(?!www))[^\s\.]+\.[^\s]{2,}|www\.[^\s]+\.[^\s]{2,})';
var lan = config.lan;

exports.hearRecover = function(bot, controller) {
//TODO cambiar los textos por variables de lenguaje
  controller.hears('recuperar','direct_message,direct_mention,mention', function(bot, message){

    var askLoadLinks = function(err, convo){
      convo.ask("Parece que quieres recuperar un enlace, dime algún tag para que pueda identificarlo",function (response,convo){
        controller.storage.users.get(response.user, function(err, user) {
            var tags = response.text.split(",");
            console.log(tags);
            bot.reply(message, "He encontrado los siguientes enlaces: ");
            var links_array = [];
            var linkReturned = myFirebaseRef.ref('links').orderByChild('tags').equalTo(tags[0]).on('child_added',function(link){
              links_array.push(link.val().url);
              console.log(link.val());
              bot.reply(message, link.val().url);
            });
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
              console.log(writtenTags);
              var jarrayTags = "{";
              writtenTags.forEach(function(tag){
                jarrayTags += "\""+ tag.trim() +"\":true,";
              });
              jarrayTags = jarrayTags.slice(0,-1) + "}";
              console.log("EL ARRAY TAGS");
              console.log(jarrayTags);
              var tags = JSON.parse(jarrayTags);
              var link = myFirebaseRef.ref('links').push({
                    user: {
                      id: response.user,
                      name: user.real_name

                    },
                    url: linkMessage,
                    tags,
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
