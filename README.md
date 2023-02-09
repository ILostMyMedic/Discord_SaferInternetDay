<!-- image to Guardian -->
[![Guardian](https://github.com/ILostMyMedic/Discord_SaferInternetDay/blob/Main/assets/Guardian.png)](https://github.com/ILostMyMedic/Discord_SaferInternetDay)


# SafeBot
SafeBot is based on the 2023 SaferInternetDays promotion between [Discord](https://discord.com) and [NoFiltr](https://nofiltr.org/).
The bot is built with DiscordJS v14, and with MongoDB. A full setup guide can be found below.


## Content
- [About SaferInternetDays](#about-saferinternetdays)
- [Commands](#commands)
- [Add the bot to your server](#add-the-bot-to-your-server)
- [Setup](#setup)
- [Versions](#versions)


## About SaferInternetDays
<!-- quote -->
> We believe a safer internet is an internet where more people can find belonging. For Discord, safety is a common good. We want to make not just our platform, but the rest of the internet, a better and safer place.
Here at Discord, we recognize our responsibility in creating a safer internet but we can't do it alone. That’s why this year we’ve partnered with local online safety advocacy organizations like NoFiltr to create education content to help users stay safe on Discord and the internet as a whole and develop healthy digital habits in celebration of Safer Internet Day. - [Discord](https://discord.com/safety/safer-internet-day-2023)
<!-- endquote -->


## Commands
```
/NoFiltr
```


## Add the bot to your server
Want to add the bot to your server? [Click here](https://discord.com/oauth2/authorize?client_id=1072623277937283153&permissions=268435456&scope=bot) to add the bot to your server.

**Note:** The bot requires Manage Roles in order to create and handle the roles during the quiz. Without this permission the bot will not function properly.


## Setup
1. Clone the repository
2. Run ``npm install`` to install all the dependencies
3. Create a ``.env`` file and add the following variables:
```env
# Discord bot token
discord_token=""
# differanciate between Development and Production environment
ENV="Development"
# the guild id of the server where you are testing the bot (this is only used in development mode)
dev=""
# a connection link to your MongoDB database
mongodb=""
```
4. Run ``npm start`` or ``nodemon start.js`` to start the bot



## Versions
- Discord.js v14
- MongoDB v6.0.1
