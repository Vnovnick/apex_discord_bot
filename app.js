import "dotenv/config";
import express from "express";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import {
  VerifyDiscordRequest,
  setEmbedColor,
  legendEmbed,
  legendStatsSubCommand,
} from "./utils.js";
import {
  HasGuildCommands,
  TEST_COMMAND,
  GET_PLAYER_INFO_COMMAND,
  GET_PLAYER_LEGEND_STATS_COMMAND,
  GET_APEX_NEWS_COMMAND,
} from "./commands.js";
import axios from "axios";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package (required on descord dev page)
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, data, member } = req.body;
  // handles mandatory verification
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  // handles any slash commands receieved
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { user, nick } = member;
    const { name, options } = data;
    console.log(options);
    // "test" guild command
    if (name === "test") {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          embeds: [
            {
              fields: [],
              title: "Test Embed",
              description: "test embed",
            },
          ],
          content: "__this is a test don't panic__",
        },
      });
    }
    if (name === "news") {
      const getNews = async () => {
        const response = await axios
          .get(
            `https://api.mozambiquehe.re/news?auth=e31142840b23b46cc82ad64cdbbdb1ef`
          )
          .catch((err) => console.log(err));
        return response.data;
      };
      let apexNews = await getNews();
      if (options[0].name === "latest") {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                title: apexNews[0].title,
                description: apexNews[0].short_desc,
                url: apexNews[0].link,
                image: {
                  url: apexNews[0].img,
                },
              },
            ],
          },
        });
      }
      if (options[0].name === "lastthree") {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            embeds: [
              {
                title: apexNews[0].title,
                description: apexNews[0].short_desc,
                url: apexNews[0].link,
                image: {
                  url: apexNews[0].img,
                },
              },
              {
                title: apexNews[1].title,
                description: apexNews[1].short_desc,
                url: apexNews[1].link,
                image: {
                  url: apexNews[1].img,
                },
              },
              {
                title: apexNews[2].title,
                description: apexNews[2].short_desc,
                url: apexNews[2].link,
                image: {
                  url: apexNews[2].img,
                },
              },
            ],
          },
        });
      }
    }
    if (name === "myinfo") {
      console.log(nick);
      const getStats = async () => {
        const response = await axios
          .get(
            `https://api.mozambiquehe.re/bridge?auth=e31142840b23b46cc82ad64cdbbdb1ef&player=${nick}&platform=PC`
          )
          .catch((err) => {
            console.log(err);
          });
        if (response) {
          const userData = response.data.global;
          return userData;
        } else {
          return;
        }
      };
      let userStats = await getStats();
      if (userStats) {
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `${userStats.name}'s info: `,
            embeds: [
              {
                fields: [
                  {
                    name: "Platform: ",
                    value: userStats.platform,
                    inline: false,
                  },
                  {
                    name: "Level:",
                    value: `${userStats.level} - *Prestige ${userStats.levelPrestige}*`,
                    inline: false,
                  },
                  {
                    name: "Current BR Rank:",
                    value: `${userStats.rank.rankName} ${userStats.rank.rankDiv}\nRP: ${userStats.rank.rankScore}\n`,
                    inline: false,
                  },
                ],
                thumbnail: {
                  url: userStats.rank.rankImg,
                },
                color: setEmbedColor(userStats.rank.rankName),
              },
            ],
          },
        });
      } else {
        res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content:
              "Command Failed. User Name or Server Nickname might be invalid",
          },
        });
      }
    }
    if (name === "mylegendstats") {
      const getStats = async () => {
        const response = await axios
          .get(
            `https://api.mozambiquehe.re/bridge?auth=e31142840b23b46cc82ad64cdbbdb1ef&player=${user.username}&platform=PC`
          )
          .catch((err) => console.log(err));
        if (response) {
          const userData = response.data;
          return userData;
        } else {
          return;
        }
      };
      let userStats = await getStats();
      if (userStats) {
        if (options[0].name === "selected") {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s selected legend stats: `,
              embeds: legendEmbed(
                userStats.legends.selected.LegendName,
                userStats.legends.selected.data[0].name,
                userStats.legends.selected.data[0].value,
                userStats.legends.selected.data[1].name,
                userStats.legends.selected.data[1].value,
                userStats.legends.selected.data[2].name,
                userStats.legends.selected.data[2].value,
                userStats.legends.selected.ImgAssets.icon
              ),
            },
          });
        }
        if (options[0].name === "revenant") {
          legendStatsSubCommand("revenant", userStats, res);
        }
        if (options[0].name === "crypto") {
          legendStatsSubCommand("crypto", userStats, res);
        }
        if (options[0].name === "horizon") {
          legendStatsSubCommand("horizon", userStats, res);
        }
        if (options[0].name === "wattson") {
          legendStatsSubCommand("wattson", userStats, res);
        }
        if (options[0].name === "fuse") {
          legendStatsSubCommand("fuse", userStats, res);
        }
        if (options[0].name === "bangalore") {
          legendStatsSubCommand("bangalore", userStats, res);
        }
        if (options[0].name === "gibraltar") {
          legendStatsSubCommand("gibraltar", userStats, res);
        }
        if (options[0].name === "wraith") {
          legendStatsSubCommand("wraith", userStats, res);
        }
        if (options[0].name === "octane") {
          legendStatsSubCommand("octane", userStats, res);
        }
        if (options[0].name === "bloodhound") {
          legendStatsSubCommand("bloodhound", userStats, res);
        }
        if (options[0].name === "caustic") {
          legendStatsSubCommand("caustic", userStats, res);
        }
        if (options[0].name === "lifeline") {
          legendStatsSubCommand("lifeline", userStats, res);
        }
        if (options[0].name === "pathfinder") {
          legendStatsSubCommand("pathfinder", userStats, res);
        }
        if (options[0].name === "loba") {
          legendStatsSubCommand("loba", userStats, res);
        }
        if (options[0].name === "mirage") {
          legendStatsSubCommand("mirage", userStats, res);
        }
        if (options[0].name === "rampart") {
          legendStatsSubCommand("rampart", userStats, res);
        }
        if (options[0].name === "valkyrie") {
          legendStatsSubCommand("valkyrie", userStats, res);
        }
        if (options[0].name === "seer") {
          legendStatsSubCommand("seer", userStats, res);
        }
        if (options[0].name === "ash") {
          legendStatsSubCommand("ash", userStats, res);
        }
        // image file had space in "mad maggie.png" so it would throw an error
        if (options[0].name === "madmaggie") {
          legendStatsSubCommand("Mad Maggie", userStats, res);
        }
        if (options[0].name === "newcastle") {
          legendStatsSubCommand("newcastle", userStats, res);
        }
        if (options[0].name === "vantage") {
          legendStatsSubCommand("vantage", userStats, res);
        }
        if (options[0].name === "catalyst") {
          legendStatsSubCommand("catalyst", userStats, res);
        }
      } else {
        res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content:
              "Command Failed. User Name or Server Nickname might be invalid",
          },
        });
      }
    }
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);

  // Check if guild commands from commands.js are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND,
    GET_PLAYER_INFO_COMMAND,
    GET_PLAYER_LEGEND_STATS_COMMAND,
    GET_APEX_NEWS_COMMAND,
  ]);
});
