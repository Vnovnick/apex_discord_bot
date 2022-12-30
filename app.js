import "dotenv/config";
import express from "express";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { VerifyDiscordRequest, setEmbedColor } from "./utils.js";
import {
  HasGuildCommands,
  TEST_COMMAND,
  GET_PLAYER_INFO_COMMAND,
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
    const { name } = data;

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
                  value: "87 - *Prestige 1*",
                  inline: false,
                },
                {
                  name: "Current BR Rank:",
                  value: "Platinum 3\nRP: 9350\n",
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
  }
});

app.listen(PORT, () => {
  console.log("Listening on port", PORT);

  // Check if guild commands from commands.js are installed (if not, install them)
  HasGuildCommands(process.env.APP_ID, process.env.GUILD_ID, [
    TEST_COMMAND,
    GET_PLAYER_INFO_COMMAND,
  ]);
});
