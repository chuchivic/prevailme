# Prevailme

## Update 15-may-2017

#### Recovering links

Now implements links recover talking to the bot.
You only have to tell 'recover' mentioning the bot, he asks for a tag and recover all the links with that tag.


<img src="https://github.com/chuchivic/prevailme/blob/master/recover.png" alt="Prevailme example"/>


##### Next improvements
- Can use one or more tags for recovery
- Connect to wit.ai for some natural languaje.


### A Slack bot to store links

Prevailme stores the links(with tags) you want into Firebase using BotKit [BotKit.js](https://github.com/howdyai/botkit)

#### Why?

Because you and your team put a lot of interesting links in your Slack to share it with your mates, and that links get lost in the amount of text.
So why not store the interesting ones?

#### How it works?

When you have the bot in the room, he it's going to listen when you paste a link, and ask you if you want to store the data, here is a simple conversation:

<img src="https://github.com/chuchivic/prevailme/blob/master/example.png" alt="Prevailme example"/>


In my case I gave the personality and photography of Eugenio, a spanish comedian.

#### Installation and configuration

1. Get the tokens:

  * Go to Slack integration page: [here](https://my.slack.com/services/new/bot) and create a new bot to get the token.

 * In Firebase you have create an application and get the url of your app [here](https://www.firebase.com/)

2. When you have all the info and the repositoy clonned, create a file called config.js with this content:


```javascript
var config = {};

config.slack_token = YOUR_SLACK_TOKEN;
config.slack_bot_name = BOT_NAME;
config.firebase_url = FIRE_BASE_URL;
config.lan = LANGUAGE(es|en);
module.exports = config;
```

3. Execute `npm update` to update and install all dependencies

4. Init the bot with `node bot.js`


The next step is develop a page with tag filters and users.

There is a lot of improvements, if you want to collaborate or fork the repo, go on!
