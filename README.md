# BridgeDB Telegram Bot

Telegram bot that fetches bridges from BridgeDB with captcha, does the same thing as many other bots but it's mine and that's the only thing that matters.

![How it works](https://user-images.githubusercontent.com/59040542/148549885-2aa9872d-dffa-4cd4-abf2-58c0309aa45e.png)

⚠️ This version is specifically made for CGI server, not reverse proxy ⚠️

Uses node-fetch, ~LevelDB~ custom file-based db, and Telegram API through http requests.

Has Russian language in it.

I won't leave a link for the deployed version here because I will probably get spammed with requests and then banned from BridgeDB. You can ask me at Telegram though: [@hlothdev](https://t.me/hlothdev)

**Update: I'm fucking genius, bridges are always the same for single IP so I just made exact copy of @getbridgesbot but with captcha** ![image](https://user-images.githubusercontent.com/59040542/148551531-2320f9c2-af77-40e8-a575-e798adf26081.png)
