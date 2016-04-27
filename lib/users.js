'use strict';
var talk = require('../dictionary/talk.js');
var hear = require('../dictionary/hear.js');
var config = require('../config.js');
var _ = require('underscore');
var myFirebaseRef = new Firebase(config.firebase_url);
var lan = config.lan;


exports.updateList = function (bot, controller) {
  bot.api.users.list({}, function (err, res) {
    if (err) {
      bot.botkit.log("Something is wrong with Firebase", err);
    }
    bot.botkit.log("Success ", res);
    myFirebaseRef.child('users').once("value", function (data) {
      var users = data.val();
      bot.botkit.log("Firebase ", users);
      var newUsers = _.difference(_.pluck(res.members, 'id'), _.keys(users));
      _.each(newUsers, function (newUser) {
        myFirebaseRef.child('users').child(newUser).set(_.findWhere(res.members, {id: newUser}));
      });
    });

  });
}


exports.hearHello = function (bot, controller) {

  controller.hears(hear.dictionary.hello[lan], 'direct_message,direct_mention,mention', function (bot, message) {

    controller.storage.users.get(message.user, function (err, user) {

      bot.startConversation(message, function (err, convo) {

        convo.ask(talk.dictionary.hello[lan] + user.real_name+ talk.dictionary.first_conv[lan],[
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
