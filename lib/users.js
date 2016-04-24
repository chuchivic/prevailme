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
