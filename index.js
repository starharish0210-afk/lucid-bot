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
  await respond({ response_type: "in_channel", text: `Pong!\nLatency: ${latency}ms` });
});

(async () => {
  await app.start();
  console.log("bot is running!");
})();
app.command("/lucid-help", async ({ ack, respond }) => {
  await ack();
  await respond({ response_type: "in_channel",
    text:
`Available Commands:
/lucid-ping - Check bot latency
/lucid-catfact - Get a cat fact
/lucid-joke - Get a joke
/lucid-fact - Get a fun fact
/lucid-weather - Get weather report 
/lucid-cat - Get a best cat image of the day
/lucid-space - Space info of the day
/lucid-greet - Get a greeting and a quote
/lucid-food - Get a random food image
/lucid-lol - Get a lol image and a funny fact
/lucid-memes - Get a meme image and fricking meme lol`
  });
});
app.command("/lucid-catfact", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://catfact.ninja/fact");
    await respond({ response_type: "in_channel", text: `Cat Fact:\n${response.data.fact}` });
  } catch (err) {
    await respond({ response_type: "in_channel", text: "Failed to fetch a cat fact." });
  }
});
app.command("/lucid-joke", async ({ ack, respond }) => {
  await ack();

  try {
    const response = await axios.get("https://official-joke-api.appspot.com/random_joke");
    await respond({ response_type: "in_channel",
      text:
`${response.data.setup}

${response.data.punchline}`
    });
  } catch (err) {
    await respond({ response_type: "in_channel", text: "Failed to fetch a joke." });
  }
});
app.command("/lucid-weather", async ({ command, ack, respond }) => {
  await ack();
  const city = command.text.trim();
  
  if (!city) {
    await respond({ response_type: "in_channel", text: "Please provide a city! Usage: `/lucid-weather Chennai`" });
    return;
  }

  try {
    const response = await axios.get(
      `https://wttr.in/${encodeURIComponent(city)}?format=3`
    );
    await respond({ response_type: "in_channel", text: ` ${response.data}` });
  } catch (err) {
    await respond({ response_type: "in_channel", text: "Failed to fetch weather. Try again!" });
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

    await respond({ response_type: "in_channel",
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: "Cat of the Day" }
        },
        {
          type: "context",
          elements: [{ type: "mrkdwn", text: ` ${dateStr}` }]
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
            text: `* Cat Fact of the Day:*\n_${catFact}_`
          }
        },
        { type: "divider" },
        {
          type: "context",
          elements: [{ type: "mrkdwn", text: "Powered by *Lucid* | Use `/lucid-help` for more commands" }]
        }
      ]
    });
  } catch (err) {
    await respond({ response_type: "in_channel", text: " Failed to fetch today's cat. Try again!" });
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
        text: { type: "plain_text", text: " NASA: Astronomy Picture of the Day" }
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: ` ${dateStr}` }]
      },
      {
        type: "section",
        text: { type: "mrkdwn", text: `* ${apod.title}*` }
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
        text: { type: "mrkdwn", text: ` Today's feature is a video! <${apod.url}|Watch it here>` }
      });
    }

    blocks.push(
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `* About this image:*\n_${apod.explanation.slice(0, 300)}..._`
        }
      },
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `* Space Facts:*\n The universe is approximately *13.8 billion years old*\n Earth is the only known planet with life\n There are more stars in the universe than grains of sand on Earth\n A day on Venus is longer than a year on Venus`
        }
      },
      { type: "divider" },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: " Powered by *NASA APOD API* | *Lucid Bot*  | Use `/lucid-help` for more" }]
      }
    );

    await respond({ response_type: "in_channel", blocks });

  } catch (err) {
    await respond({ response_type: "in_channel",
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: " Space Facts" }
        },
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `* Did you know?*\n\n The universe is approximately *13.8 billion years old*\n Earth is the only known planet with confirmed life\n There are more stars in the universe than grains of sand on all of Earth's beaches\n A day on Venus lasts longer than a year on Venus\n The Milky Way galaxy is about *100,000 light-years* across\n Space is completely silent — there's no medium for sound to travel through\n There's a giant cloud of alcohol floating in space (Sagittarius B2)\n If you fell into a black hole, time would slow down relative to the outside world`
          }
        },
        { type: "divider" },
        {
          type: "context",
          elements: [{ type: "mrkdwn", text: " Powered by *Lucid Bot*  | Use `/lucid-help` for more" }]
        }
      ]
    });
  }
});
app.command("/lucid-greet", async ({ ack, respond, command }) => {
  await ack();
  await respond({ response_type: "in_channel",
    text: `Greetings! user ${command.user_name} hope u have a great day!
    today's quote ${await axios.get("https://zenquotes.io/api/random").then(res => res.data[0].q)}`
  });
})
app.command("/lucid-food", async ({ ack, respond }) => {
  await ack();
  try {
    const response = await axios.get("https://www.themealdb.com/api/json/v1/1/random.php");
    const imageUrl = response.data.meals[0].strMealThumb;
    const category = response.data.meals[0].strMeal;

    await respond({ response_type: "in_channel",
      text: `Delicious ${category} for you!`,
      blocks: [
        {
          type: "header",
          text: { type: "plain_text", text: ` Delicious ${category} for you!` }
        },
        {
          type: "image",
          image_url: imageUrl,
          alt_text: `Delicious ${category}`
        },
        {
          type: "context",
          elements: [{ type: "mrkdwn", text: "Powered by *Lucid*  | Use `/lucid-help` for more" }]
        }
      ]
    });
  } catch (err) {
    await respond({ response_type: "in_channel", text: "Failed to fetch good food image for you :C" });
  }
});
app.command("/lucid-lol", async ({ ack, respond }) => {
  await ack();
  const dateStr = new Date().toLocaleDateString();
  const lolFact = "Laughing is good for your health!";

  await respond({ response_type: "in_channel",
    text: "lol you too bro have a nice day hahahahaha fah bababa black sheep how many wool do you have one two three four five six seven eight nine ten hahahahaha",
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "lol image" }
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: ` ${dateStr}` }]
      },
      {
        type: "image",
        image_url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5uFsWbWw9Wkzc3pYaVtDFdquwTF7a2hLLmJVLmMC9zL863oyuWVmOlnE&s=10",
        alt_text: "lol image"
      },
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `* lol of the Day:*\n_${lolFact}_`
        }
      },
      { type: "divider" },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: "Powered by *Lucid*  | Use `/lucid-help` for more commands" }]
      }
    ]
  });
});
app.command("/lucid-memes", async ({ ack, respond }) => {
  await ack();
  const dateStr = new Date().toLocaleDateString();
  const memeFact = "Memes are a form of cultural expression!";

  await respond({ response_type: "in_channel",
    text: "Here's a meme for you to lose pain and have a good laugh like the minions from the minions movie!",
    blocks: [
      {
        type: "header",
        text: { type: "plain_text", text: "Meme of the Day" }
      },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: ` ${dateStr}` }]
      },
      {
        type: "image",
        image_url: "https://i.imgflip.com/30b1gx.jpg",
        alt_text: "meme image"
      },
      { type: "divider" },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `* Meme of the Day:*\n_${memeFact}_`
        }
      },
      { type: "divider" },
      {
        type: "context",
        elements: [{ type: "mrkdwn", text: "Powered by *Lucid*  | Use `/lucid-help` for more commands" }]
      }
    ]
  });
});