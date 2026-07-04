🤖 Lucid — A Slack Bot


A multi-command Slack bot that runs 24/7 on Hack Club's Nest server. Built for the Stardance Challenge.




✨ What it does

Lucid is a Slack bot packed with useful and fun commands — from checking bot latency to pulling live NASA astronomy photos. It's deployed as a systemd service so it never goes down, even when my laptop is off.


🚀 Commands

CommandDescription/lucid-pingCheck bot latency/lucid-helpList all available commands/lucid-catfactGet a random cat fact/lucid-jokeGet a random joke/lucid-weather [city]Get live weather for any city/lucid-catCat of the day — full image + cat fact/lucid-spaceNASA Astronomy Picture of the Day + space facts


📸 Screenshots

🐱 Cat of the Day

Full cat image with a fun fact, date, and clean card layout.

Image=>  <img width="598" height="489" alt="image" src="https://github.com/user-attachments/assets/89cd78e2-a5fd-46ca-8463-9aa6dafd1d93" />


🚀 NASA Astronomy Picture of the Day

Pulls today's real NASA APOD image with title, description, and space facts.

Image=>  <img width="1561" height="515" alt="image" src="https://github.com/user-attachments/assets/d9bf73cf-7429-49ec-99b2-f454f9385175" />


😂 Joke Command

Pulls a random joke — setup and punchline.

Image=>  <img width="1350" height="334" alt="image" src="https://github.com/user-attachments/assets/0067e442-477c-4f8f-ba81-3aafc0ddd218" />



🛠️ Tech Stack


Runtime: Node.js
Framework: Slack Bolt
Deployment: Hack Club Nest (systemd service, runs 24/7)
APIs used:

wttr.in — weather
The Cat API — cat images
catfact.ninja — cat facts
official-joke-api — jokes
NASA APOD API — astronomy picture of the day






🏗️ How I built it


Set up a Slack app with Socket Mode and slash commands
Built the bot locally using Node.js and Slack Bolt
Added API integrations one by one
Deployed to Hack Club Nest as a systemd service so it runs 24/7
I used "AI" to learn the new stuffs because im a complete beginner to coding and stuff
i did use ai this my project, because i dont know how coding works
Im still learning things as i progress further




📡 Deployment

The bot runs on Hack Club Nest as a systemd service:

bashsystemctl status slackbot.service

It auto-restarts on crash and survives server reboots.


Built with ❤️ for Hack Club Stardance Challenge
