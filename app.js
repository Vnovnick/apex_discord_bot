import "dotenv/config";
import express from "express";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import {
  VerifyDiscordRequest,
  setEmbedColor,
  legendEmbed,
  legendEmbedWithRank,
  legendMissingData,
} from "./utils.js";
import {
  HasGuildCommands,
  TEST_COMMAND,
  GET_PLAYER_INFO_COMMAND,
  GET_PLAYER_LEGEND_STATS_COMMAND,
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
    const { user } = member;
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
    if (name === "myinfo") {
      const getStats = async () => {
        const response = await axios
          .get(
            `https://api.mozambiquehe.re/bridge?auth=e31142840b23b46cc82ad64cdbbdb1ef&player=${user.username}&platform=PC`
          )
          .catch((err) => console.log(err));
        const userData = response.data.global;
        return userData;
      };
      let userStats = await getStats();
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
    }
    if (name === "mylegendstats") {
      const getStats = async () => {
        const response = await axios
          .get(
            `https://api.mozambiquehe.re/bridge?auth=e31142840b23b46cc82ad64cdbbdb1ef&player=${user.username}&platform=PC`
          )
          .catch((err) => console.log(err));
        const userData = response.data;
        return userData;
      };
      let userStats = await getStats();
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
        if (userStats.legends.all.Revenant.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Revenant stats: `,
              embeds: legendEmbedWithRank(
                "Revenant",
                userStats.legends.all.Revenant.data[0].name,
                userStats.legends.all.Revenant.data[0].value,
                userStats.legends.all.Revenant.data[0].rank.rankPos,
                userStats.legends.all.Revenant.data[0].rank.topPercent,
                userStats.legends.all.Revenant.data[1].name,
                userStats.legends.all.Revenant.data[1].value,
                userStats.legends.all.Revenant.data[1].rank.rankPos,
                userStats.legends.all.Revenant.data[1].rank.topPercent,
                userStats.legends.all.Revenant.data[2].name,
                userStats.legends.all.Revenant.data[2].value,
                userStats.legends.all.Revenant.data[2].rank.rankPos,
                userStats.legends.all.Revenant.data[2].rank.topPercent,
                userStats.legends.all.Revenant.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Revenant in game to generate data.`,
          },
        });
      }
      if (options[0].name === "crypto") {
        if (userStats.legends.all.Crypto.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Crypto stats: `,
              embeds: legendEmbedWithRank(
                "Crypto",
                userStats.legends.all.Crypto.data[0].name,
                userStats.legends.all.Crypto.data[0].value,
                userStats.legends.all.Crypto.data[0].rank.rankPos,
                userStats.legends.all.Crypto.data[0].rank.topPercent,
                userStats.legends.all.Crypto.data[1].name,
                userStats.legends.all.Crypto.data[1].value,
                userStats.legends.all.Crypto.data[1].rank.rankPos,
                userStats.legends.all.Crypto.data[1].rank.topPercent,
                userStats.legends.all.Crypto.data[2].name,
                userStats.legends.all.Crypto.data[2].value,
                userStats.legends.all.Crypto.data[2].rank.rankPos,
                userStats.legends.all.Crypto.data[2].rank.topPercent,
                userStats.legends.all.Crypto.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Crypto in game to generate data.`,
          },
        });
      }
      if (options[0].name === "horizon") {
        if (userStats.legends.all.Horizon.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Horizon stats: `,
              embeds: legendEmbedWithRank(
                "Horizon",
                userStats.legends.all.Horizon.data[0].name,
                userStats.legends.all.Horizon.data[0].value,
                userStats.legends.all.Horizon.data[0].rank.rankPos,
                userStats.legends.all.Horizon.data[0].rank.topPercent,
                userStats.legends.all.Horizon.data[1].name,
                userStats.legends.all.Horizon.data[1].value,
                userStats.legends.all.Horizon.data[1].rank.rankPos,
                userStats.legends.all.Horizon.data[1].rank.topPercent,
                userStats.legends.all.Horizon.data[2].name,
                userStats.legends.all.Horizon.data[2].value,
                userStats.legends.all.Horizon.data[2].rank.rankPos,
                userStats.legends.all.Horizon.data[2].rank.topPercent,
                userStats.legends.all.Horizon.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Horizon in game to generate data.`,
          },
        });
      }
      if (options[0].name === "wattson") {
        if (userStats.legends.all.Wattson.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Wattson stats: `,
              embeds: legendEmbedWithRank(
                "Wattson",
                userStats.legends.all.Wattson.data[0].name,
                userStats.legends.all.Wattson.data[0].value,
                userStats.legends.all.Wattson.data[0].rank.rankPos,
                userStats.legends.all.Wattson.data[0].rank.topPercent,
                userStats.legends.all.Wattson.data[1].name,
                userStats.legends.all.Wattson.data[1].value,
                userStats.legends.all.Wattson.data[1].rank.rankPos,
                userStats.legends.all.Wattson.data[1].rank.topPercent,
                userStats.legends.all.Wattson.data[2].name,
                userStats.legends.all.Wattson.data[2].value,
                userStats.legends.all.Wattson.data[2].rank.rankPos,
                userStats.legends.all.Wattson.data[2].rank.topPercent,
                userStats.legends.all.Wattson.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Wattson in game to generate data.`,
          },
        });
      }
      if (options[0].name === "fuse") {
        if (userStats.legends.all.Fuse.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Fuse stats: `,
              embeds: legendEmbedWithRank(
                "Fuse",
                userStats.legends.all.Fuse.data[0].name,
                userStats.legends.all.Fuse.data[0].value,
                userStats.legends.all.Fuse.data[0].rank.rankPos,
                userStats.legends.all.Fuse.data[0].rank.topPercent,
                userStats.legends.all.Fuse.data[1].name,
                userStats.legends.all.Fuse.data[1].value,
                userStats.legends.all.Fuse.data[1].rank.rankPos,
                userStats.legends.all.Fuse.data[1].rank.topPercent,
                userStats.legends.all.Fuse.data[2].name,
                userStats.legends.all.Fuse.data[2].value,
                userStats.legends.all.Fuse.data[2].rank.rankPos,
                userStats.legends.all.Fuse.data[2].rank.topPercent,
                userStats.legends.all.Fuse.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Fuse in game to generate data.`,
          },
        });
      }
      if (options[0].name === "bangalore") {
        if (userStats.legends.all.Bangalore.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Bangalore stats: `,
              embeds: legendEmbedWithRank(
                "Bangalore",
                userStats.legends.all.Bangalore.data[0].name,
                userStats.legends.all.Bangalore.data[0].value,
                userStats.legends.all.Bangalore.data[0].rank.rankPos,
                userStats.legends.all.Bangalore.data[0].rank.topPercent,
                userStats.legends.all.Bangalore.data[1].name,
                userStats.legends.all.Bangalore.data[1].value,
                userStats.legends.all.Bangalore.data[1].rank.rankPos,
                userStats.legends.all.Bangalore.data[1].rank.topPercent,
                userStats.legends.all.Bangalore.data[2].name,
                userStats.legends.all.Bangalore.data[2].value,
                userStats.legends.all.Bangalore.data[2].rank.rankPos,
                userStats.legends.all.Bangalore.data[2].rank.topPercent,
                userStats.legends.all.Bangalore.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Bangalore in game to generate data.`,
          },
        });
      }
      if (options[0].name === "gibraltar") {
        if (userStats.legends.all.Gibraltar.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Gibraltar stats: `,
              embeds: legendEmbedWithRank(
                "Gibraltar",
                userStats.legends.all.Gibraltar.data[0].name,
                userStats.legends.all.Gibraltar.data[0].value,
                userStats.legends.all.Gibraltar.data[0].rank.rankPos,
                userStats.legends.all.Gibraltar.data[0].rank.topPercent,
                userStats.legends.all.Gibraltar.data[1].name,
                userStats.legends.all.Gibraltar.data[1].value,
                userStats.legends.all.Gibraltar.data[1].rank.rankPos,
                userStats.legends.all.Gibraltar.data[1].rank.topPercent,
                userStats.legends.all.Gibraltar.data[2].name,
                userStats.legends.all.Gibraltar.data[2].value,
                userStats.legends.all.Gibraltar.data[2].rank.rankPos,
                userStats.legends.all.Gibraltar.data[2].rank.topPercent,
                userStats.legends.all.Gibraltar.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Gibraltar in game to generate data.`,
          },
        });
      }
      if (options[0].name === "wraith") {
        if (userStats.legends.all.Wraith.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Wraith stats: `,
              embeds: legendEmbedWithRank(
                "Wraith",
                userStats.legends.all.Wraith.data[0].name,
                userStats.legends.all.Wraith.data[0].value,
                userStats.legends.all.Wraith.data[0].rank.rankPos,
                userStats.legends.all.Wraith.data[0].rank.topPercent,
                userStats.legends.all.Wraith.data[1].name,
                userStats.legends.all.Wraith.data[1].value,
                userStats.legends.all.Wraith.data[1].rank.rankPos,
                userStats.legends.all.Wraith.data[1].rank.topPercent,
                userStats.legends.all.Wraith.data[2].name,
                userStats.legends.all.Wraith.data[2].value,
                userStats.legends.all.Wraith.data[2].rank.rankPos,
                userStats.legends.all.Wraith.data[2].rank.topPercent,
                userStats.legends.all.Wraith.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Wraith in game to generate data.`,
          },
        });
      }
      if (options[0].name === "octane") {
        if (userStats.legends.all.Octane.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Octane stats: `,
              embeds: legendEmbedWithRank(
                "Octane",
                userStats.legends.all.Octane.data[0].name,
                userStats.legends.all.Octane.data[0].value,
                userStats.legends.all.Octane.data[0].rank.rankPos,
                userStats.legends.all.Octane.data[0].rank.topPercent,
                userStats.legends.all.Octane.data[1].name,
                userStats.legends.all.Octane.data[1].value,
                userStats.legends.all.Octane.data[1].rank.rankPos,
                userStats.legends.all.Octane.data[1].rank.topPercent,
                userStats.legends.all.Octane.data[2].name,
                userStats.legends.all.Octane.data[2].value,
                userStats.legends.all.Octane.data[2].rank.rankPos,
                userStats.legends.all.Octane.data[2].rank.topPercent,
                userStats.legends.all.Octane.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Octane in game to generate data.`,
          },
        });
      }
      if (options[0].name === "bloodhound") {
        if (userStats.legends.all.Bloodhound.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Bloodhound stats: `,
              embeds: legendEmbedWithRank(
                "Bloodhound",
                userStats.legends.all.Bloodhound.data[0].name,
                userStats.legends.all.Bloodhound.data[0].value,
                userStats.legends.all.Bloodhound.data[0].rank.rankPos,
                userStats.legends.all.Bloodhound.data[0].rank.topPercent,
                userStats.legends.all.Bloodhound.data[1].name,
                userStats.legends.all.Bloodhound.data[1].value,
                userStats.legends.all.Bloodhound.data[1].rank.rankPos,
                userStats.legends.all.Bloodhound.data[1].rank.topPercent,
                userStats.legends.all.Bloodhound.data[2].name,
                userStats.legends.all.Bloodhound.data[2].value,
                userStats.legends.all.Bloodhound.data[2].rank.rankPos,
                userStats.legends.all.Bloodhound.data[2].rank.topPercent,
                userStats.legends.all.Bloodhound.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Bloodhound in game to generate data.`,
          },
        });
      }
      if (options[0].name === "caustic") {
        if (userStats.legends.all.Caustic.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Caustic stats: `,
              embeds: legendEmbedWithRank(
                "Caustic",
                userStats.legends.all.Caustic.data[0].name,
                userStats.legends.all.Caustic.data[0].value,
                userStats.legends.all.Caustic.data[0].rank.rankPos,
                userStats.legends.all.Caustic.data[0].rank.topPercent,
                userStats.legends.all.Caustic.data[1].name,
                userStats.legends.all.Caustic.data[1].value,
                userStats.legends.all.Caustic.data[1].rank.rankPos,
                userStats.legends.all.Caustic.data[1].rank.topPercent,
                userStats.legends.all.Caustic.data[2].name,
                userStats.legends.all.Caustic.data[2].value,
                userStats.legends.all.Caustic.data[2].rank.rankPos,
                userStats.legends.all.Caustic.data[2].rank.topPercent,
                userStats.legends.all.Caustic.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Caustic in game to generate data.`,
          },
        });
      }
      if (options[0].name === "lifeline") {
        if (userStats.legends.all.Lifeline.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Lifeline stats: `,
              embeds: legendEmbedWithRank(
                "Lifeline",
                userStats.legends.all.Lifeline.data[0].name,
                userStats.legends.all.Lifeline.data[0].value,
                userStats.legends.all.Lifeline.data[0].rank.rankPos,
                userStats.legends.all.Lifeline.data[0].rank.topPercent,
                userStats.legends.all.Lifeline.data[1].name,
                userStats.legends.all.Lifeline.data[1].value,
                userStats.legends.all.Lifeline.data[1].rank.rankPos,
                userStats.legends.all.Lifeline.data[1].rank.topPercent,
                userStats.legends.all.Lifeline.data[2].name,
                userStats.legends.all.Lifeline.data[2].value,
                userStats.legends.all.Lifeline.data[2].rank.rankPos,
                userStats.legends.all.Lifeline.data[2].rank.topPercent,
                userStats.legends.all.Lifeline.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Lifeline in game to generate data.`,
          },
        });
      }
      if (options[0].name === "pathfinder") {
        if (userStats.legends.all.Pathfinder.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Pathfinder stats: `,
              embeds: legendEmbedWithRank(
                "Pathfinder",
                userStats.legends.all.Pathfinder.data[0].name,
                userStats.legends.all.Pathfinder.data[0].value,
                userStats.legends.all.Pathfinder.data[0].rank.rankPos,
                userStats.legends.all.Pathfinder.data[0].rank.topPercent,
                userStats.legends.all.Pathfinder.data[1].name,
                userStats.legends.all.Pathfinder.data[1].value,
                userStats.legends.all.Pathfinder.data[1].rank.rankPos,
                userStats.legends.all.Pathfinder.data[1].rank.topPercent,
                userStats.legends.all.Pathfinder.data[2].name,
                userStats.legends.all.Pathfinder.data[2].value,
                userStats.legends.all.Pathfinder.data[2].rank.rankPos,
                userStats.legends.all.Pathfinder.data[2].rank.topPercent,
                userStats.legends.all.Pathfinder.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Pathfinder in game to generate data.`,
          },
        });
      }
      if (options[0].name === "loba") {
        if (userStats.legends.all.Loba.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Loba stats: `,
              embeds: legendEmbedWithRank(
                "Loba",
                userStats.legends.all.Loba.data[0].name,
                userStats.legends.all.Loba.data[0].value,
                userStats.legends.all.Loba.data[0].rank.rankPos,
                userStats.legends.all.Loba.data[0].rank.topPercent,
                userStats.legends.all.Loba.data[1].name,
                userStats.legends.all.Loba.data[1].value,
                userStats.legends.all.Loba.data[1].rank.rankPos,
                userStats.legends.all.Loba.data[1].rank.topPercent,
                userStats.legends.all.Loba.data[2].name,
                userStats.legends.all.Loba.data[2].value,
                userStats.legends.all.Loba.data[2].rank.rankPos,
                userStats.legends.all.Loba.data[2].rank.topPercent,
                userStats.legends.all.Loba.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Loba in game to generate data.`,
          },
        });
      }
      if (options[0].name === "mirage") {
        if (userStats.legends.all.Mirage.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Mirage stats: `,
              embeds: legendEmbedWithRank(
                "Mirage",
                userStats.legends.all.Mirage.data[0].name,
                userStats.legends.all.Mirage.data[0].value,
                userStats.legends.all.Mirage.data[0].rank.rankPos,
                userStats.legends.all.Mirage.data[0].rank.topPercent,
                userStats.legends.all.Mirage.data[1].name,
                userStats.legends.all.Mirage.data[1].value,
                userStats.legends.all.Mirage.data[1].rank.rankPos,
                userStats.legends.all.Mirage.data[1].rank.topPercent,
                userStats.legends.all.Mirage.data[2].name,
                userStats.legends.all.Mirage.data[2].value,
                userStats.legends.all.Mirage.data[2].rank.rankPos,
                userStats.legends.all.Mirage.data[2].rank.topPercent,
                userStats.legends.all.Mirage.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Mirage in game to generate data.`,
          },
        });
      }
      if (options[0].name === "rampart") {
        if (userStats.legends.all.Rampart.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Rampart stats: `,
              embeds: legendEmbedWithRank(
                "Rampart",
                userStats.legends.all.Rampart.data[0].name,
                userStats.legends.all.Rampart.data[0].value,
                userStats.legends.all.Rampart.data[0].rank.rankPos,
                userStats.legends.all.Rampart.data[0].rank.topPercent,
                userStats.legends.all.Rampart.data[1].name,
                userStats.legends.all.Rampart.data[1].value,
                userStats.legends.all.Rampart.data[1].rank.rankPos,
                userStats.legends.all.Rampart.data[1].rank.topPercent,
                userStats.legends.all.Rampart.data[2].name,
                userStats.legends.all.Rampart.data[2].value,
                userStats.legends.all.Rampart.data[2].rank.rankPos,
                userStats.legends.all.Rampart.data[2].rank.topPercent,
                userStats.legends.all.Rampart.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Rampart in game to generate data.`,
          },
        });
      }
      if (options[0].name === "valkyrie") {
        if (userStats.legends.all.Valkyrie.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Valkyrie stats: `,
              embeds: legendEmbedWithRank(
                "Valkyrie",
                userStats.legends.all.Valkyrie.data[0].name,
                userStats.legends.all.Valkyrie.data[0].value,
                userStats.legends.all.Valkyrie.data[0].rank.rankPos,
                userStats.legends.all.Valkyrie.data[0].rank.topPercent,
                userStats.legends.all.Valkyrie.data[1].name,
                userStats.legends.all.Valkyrie.data[1].value,
                userStats.legends.all.Valkyrie.data[1].rank.rankPos,
                userStats.legends.all.Valkyrie.data[1].rank.topPercent,
                userStats.legends.all.Valkyrie.data[2].name,
                userStats.legends.all.Valkyrie.data[2].value,
                userStats.legends.all.Valkyrie.data[2].rank.rankPos,
                userStats.legends.all.Valkyrie.data[2].rank.topPercent,
                userStats.legends.all.Valkyrie.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Valkyrie in game to generate data.`,
          },
        });
      }
      if (options[0].name === "seer") {
        if (userStats.legends.all.Seer.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Seer stats: `,
              embeds: legendEmbedWithRank(
                "Seer",
                userStats.legends.all.Seer.data[0].name,
                userStats.legends.all.Seer.data[0].value,
                userStats.legends.all.Seer.data[0].rank.rankPos,
                userStats.legends.all.Seer.data[0].rank.topPercent,
                userStats.legends.all.Seer.data[1].name,
                userStats.legends.all.Seer.data[1].value,
                userStats.legends.all.Seer.data[1].rank.rankPos,
                userStats.legends.all.Seer.data[1].rank.topPercent,
                userStats.legends.all.Seer.data[2].name,
                userStats.legends.all.Seer.data[2].value,
                userStats.legends.all.Seer.data[2].rank.rankPos,
                userStats.legends.all.Seer.data[2].rank.topPercent,
                userStats.legends.all.Seer.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Seer in game to generate data.`,
          },
        });
      }
      if (options[0].name === "ash") {
        if (userStats.legends.all.Ash.data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Ash stats: `,
              embeds: legendEmbedWithRank(
                "Ash",
                userStats.legends.all.Ash.data[0].name,
                userStats.legends.all.Ash.data[0].value,
                userStats.legends.all.Ash.data[0].rank.rankPos,
                userStats.legends.all.Ash.data[0].rank.topPercent,
                userStats.legends.all.Ash.data[1].name,
                userStats.legends.all.Ash.data[1].value,
                userStats.legends.all.Ash.data[1].rank.rankPos,
                userStats.legends.all.Ash.data[1].rank.topPercent,
                userStats.legends.all.Ash.data[2].name,
                userStats.legends.all.Ash.data[2].value,
                userStats.legends.all.Ash.data[2].rank.rankPos,
                userStats.legends.all.Ash.data[2].rank.topPercent,
                userStats.legends.all.Ash.ImgAssets.icon
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Ash in game to generate data.`,
          },
        });
      }
      // image file had space in "mad maggie.png" so it would throw an error
      if (options[0].name === "madmaggie") {
        if (userStats.legends.all["Mad Maggie"].data) {
          return res.send({
            type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
            data: {
              content: `${userStats.global.name}'s Mad Maggie stats: `,
              embeds: legendEmbedWithRank(
                "Mad Maggie",
                userStats.legends.all["Mad Maggie"].data[0].name,
                userStats.legends.all["Mad Maggie"].data[0].value,
                userStats.legends.all["Mad Maggie"].data[0].rank.rankPos,
                userStats.legends.all["Mad Maggie"].data[0].rank.topPercent,
                userStats.legends.all["Mad Maggie"].data[1].name,
                userStats.legends.all["Mad Maggie"].data[1].value,
                userStats.legends.all["Mad Maggie"].data[1].rank.rankPos,
                userStats.legends.all["Mad Maggie"].data[1].rank.topPercent,
                userStats.legends.all["Mad Maggie"].data[2].name,
                userStats.legends.all["Mad Maggie"].data[2].value,
                userStats.legends.all["Mad Maggie"].data[2].rank.rankPos,
                userStats.legends.all["Mad Maggie"].data[2].rank.topPercent,
                "https://api.mozambiquehe.re//assets//icons//mad%20maggie.png"
              ),
            },
          });
        }
        return res.send({
          type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
          data: {
            content: `Data unavailable. Select Mad Maggie in game to generate data.`,
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
  ]);
});
