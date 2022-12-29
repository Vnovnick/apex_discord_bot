import "dotenv/config";
import express from "express";
import { InteractionType, InteractionResponseType } from "discord-interactions";
import { VerifyDiscordRequest } from "./utils.js";
import {
  // CHALLENGE_COMMAND,
  HasGuildCommands,
  TEST_COMMAND,
  GET_STATS_COMMAND,
} from "./commands.js";
import axios from "axios";

// Create an express app
const app = express();
// Get port, or default to 3000
const PORT = process.env.PORT || 3000;
// Parse request body and verifies incoming requests using discord-interactions package
app.use(express.json({ verify: VerifyDiscordRequest(process.env.PUBLIC_KEY) }));

/**
 * Interactions endpoint URL where Discord will send HTTP requests
 */
app.post("/interactions", async function (req, res) {
  // Interaction type and data
  const { type, id, data } = req.body;

  /**
   * Handle verification requests
   */
  if (type === InteractionType.PING) {
    return res.send({ type: InteractionResponseType.PONG });
  }

  /**
   * Handle slash command requests
   * See https://discord.com/developers/docs/interactions/application-commands#slash-commands
   */
  if (type === InteractionType.APPLICATION_COMMAND) {
    const { name } = data;

    // "test" guild command
    if (name === "test") {
      // Send a message into the channel where command was triggered from
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "hello world what is up my guy",
        },
      });
    }
    if (name === "mystats") {
      const getStats = async () => {
        axios
          .get(
            "https://api.mozambiquehe.re/bridge?auth=e31142840b23b46cc82ad64cdbbdb1ef&player=Vnovnick&platform=PC"
          )
          .then((res) => {
            console.log(res.data.legends.selected);
          })
          .catch((err) => {
            console.log(err);
          });
      };
      getStats();
      return res.send({
        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
        data: {
          // Fetches a random emoji to send from a helper function
          content: "see log",
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
    GET_STATS_COMMAND,
  ]);
});
