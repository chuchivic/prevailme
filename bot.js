'use strict';
var Botkit = require('botkit');
var config = require('./config.js');
var _ = require('underscore');
var firebaseref = require('firebase');

firebaseref.initializeApp(config.firebase_config);

var firebase = firebaseref.database();
var firebaseStorage = require('botkit-storage-firebase')({firebase_uri: config.firebase_config.databaseURL});

var talk = require('./dictionary/talk.js');
var hear = require('./dictionary/hear.js');
var help = require('./lib/help.js');
var users = require('./lib/users.js');
var links = require('./lib/links.js');

var lan = config.lan;

var controller = Botkit.slackbot({
    debug: true, //Be sure of this, it's very verbose
    storage: firebaseStorage,
    interactive_replies: true
});


var bot = controller.spawn({
    token: config.slack_token
}).startRTM();

users.updateList(bot, controller);
help.hearHelp(bot, controller);
links.hearLink(bot, controller);
links.hearRecover(bot, controller);

controller.on('user_channel_join',function(bot,message) {

  users.updateList(bot,controller);

})
