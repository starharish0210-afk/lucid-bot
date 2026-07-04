const axios = require("axios");
require("dotenv").config();

const { App } = require("@slack/bolt");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true
});

app.command("/lucid-ping", async ({ command, ack, respond }) => {
  const start = Date.now();
  await ack();
  const latency = Date.now() - start;
  await respond({ text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
app.command("/lucid-help", async ({ ack, respond }) => {
  await ack();
  await respond({
    text:
`Available Commands:
/lucid-ping - Check bot latency
/lucid-catfact - Get a cat fact
/lucid-joke - Get a joke
/lucid-fact - Get a fun fact
/lucid-weather - Get weather report 
/lucid-cat - Get a best cat image of the day
/lucid-space - Space info of the day`
  });
});
app.command("/lucid-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ text: "Failed to fetch a cat fact." });
  }
});
app.command("/lucid-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ text: "Failed to fetch a joke." });
  }
});
app.command("/lucid-weather", async ({ command, ack, respond }) => {
  await ack();
  const city = command.text.trim();
  
  if (!city) {
    await respond({ text: "Please provide a city! Usage: `/lucid-weather Chennai`" });
    return;
  }

  try {
    const response = await axios.get(
      `https://wttr.in/${encodeURIComponent(city)}?format=3`
    );
    await respond({ text: `🌤️ ${response.data}` });
  } catch (err) {
    await respond({ text: "Failed to fetch weather. Try again!" });
  }
});
app.command("/lucid-cat", async ({ ack, respond }) => {
  await ack();

  try {
    const [imageRes, factRes] = await Promise.all([
      axios.get("https://api.thecatapi.com/v1/images/search?size=full"),
      axios.get("https://catfact.ninja/fact")
    ]);

    const catUrl = imageRes.data[0].url;
    const catFact = factRes.data.fact;
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    await respond({
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "🐱 Cat of the Day" }
        },
        {
          type: "context",
          elements: [{ type: "mrkdwn", text: `📅 ${dateStr}` }]
        },
        {
          type: "image",
          image_url: catUrl,
          alt_text: "Cat of the day"
        },
        { type: "divider" },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*🧠 Cat Fact of the Day:*\n_${catFact}_`
          }
        },
        { type: "divider" },
        {
          type: "context",
          elements: [{ type: "mrkdwn", text: "Powered by *Lucid* 🤖 | Use `/lucid-help` for more commands" }]
        }
      ]
    });
  } catch (err) {
    await respond({ text: "😿 Failed to fetch today's cat. Try again!" });
  }
});
app.command("/lucid-space", async ({ ack, respond }) => {
  await ack();

  try {
    const [apodRes, factRes] = await Promise.all([
      axios.get("https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY"),
      axios.get("https://uselessfacts.jsph.pl/api/v2/facts/random")
    ]);

    const apod = apodRes.data;
    const isImage = apod.media_type === "image";
    const now = new Date();
    const dateStr = now.toLocaleDateString("en-US", {
      weekday: "long", year: "numeric", month: "long", day: "numeric"
    });

    const blocks = [
      {
        type: "header",
        text: { type: "plain_text", text: "🚀 NASA: Astronomy Picture of the Day" }
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: `📅 ${dateStr}` }]
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `*🌌 ${apod.title}*` }
      }
    ];

    if (isImage) {
      blocks.push({
        type: "image",
        image_url: apod.url,
        alt_text: apod.title
      });
    } else {
      blocks.push({
        type: "section",
        text: { type: "mrkdwn", text: `🎥 Today's feature is a video! <${apod.url}|Watch it here>` }
      });
    }

    blocks.push(
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*📖 About this image:*\n_${apod.explanation.slice(0, 300)}..._`
        }
      },
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `*🪐 Space Facts:*\n✨ The universe is approximately *13.8 billion years old*\n🌍 Earth is the only known planet with life\n⭐ There are more stars in the universe than grains of sand on Earth\n🌑 A day on Venus is longer than a year on Venus`
        }
      },
      { type: "divider" },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: "🛸 Powered by *NASA APOD API* | *Lucid Bot* 🤖 | Use `/lucid-help` for more" }]
      }
    );

    await respond({ blocks });

  } catch (err) {
    await respond({
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "🚀 Space Facts" }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `*🪐 Did you know?*\n\n✨ The universe is approximately *13.8 billion years old*\n🌍 Earth is the only known planet with confirmed life\n⭐ There are more stars in the universe than grains of sand on all of Earth's beaches\n🌑 A day on Venus lasts longer than a year on Venus\n🔭 The Milky Way galaxy is about *100,000 light-years* across\n💫 Space is completely silent — there's no medium for sound to travel through\n🌊 There's a giant cloud of alcohol floating in space (Sagittarius B2)\n🕳️ If you fell into a black hole, time would slow down relative to the outside world`
          }
        },
        { type: "divider" },
        {
          type: "context",
          elements: [{ type: "mrkdwn", text: "🛸 Powered by *Lucid Bot* 🤖 | Use `/lucid-help` for more" }]
        }
      ]
    });
  }
});
