'use strict';
var Botkit = require('Botkit');
var config = require('./config.js');
var _ = require('underscore');


var Firebase = require("firebase");
var myFirebaseRef = new Firebase(config.firebase_url);
var firebaseStorage = require('botkit-storage-firebase')({firebase_uri: config.firebase_url});

var talk = require('./dictionary/talk.js');
var hear = require('./dictionary/hear.js');
var help = require('./lib/help.js');
var users = require('./lib/users.js');
var links = require('./lib/links.js');

var lan = config.lan;

var controller = Botkit.slackbot({
    debug: true, //Be sure of this, it's very verbose
    storage: firebaseStorage
});

var bot = controller.spawn({
    token: config.slack_token
}).startRTM();

users.updateList(bot, controller);
help.hearHelp(bot, controller);
links.hearLink(bot, controller);

controller.on('user_channel_join',function(bot,message) {

  users.updateList(bot,controller);

})
