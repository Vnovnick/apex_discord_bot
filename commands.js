import { DiscordRequest } from "./utils.js";

// Installs a command
export async function InstallGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;
  // install command
  try {
    await DiscordRequest(endpoint, { method: "POST", body: command });
  } catch (err) {
    console.error(err);
  }
}

export async function HasGuildCommands(appId, guildId, commands) {
  if (guildId === "" || appId === "") return;

  commands.forEach((c) => HasGuildCommand(appId, guildId, c));
}

// Checks if the command exists in the guild
async function HasGuildCommand(appId, guildId, command) {
  // API endpoint to get and post guild commands
  const endpoint = `applications/${appId}/guilds/${guildId}/commands`;

  try {
    const res = await DiscordRequest(endpoint, { method: "GET" });
    const data = await res.json();

    if (data) {
      const installedNames = data.map((c) => c["name"]);
      // This is just matching on the name, so it's not good for updates
      if (!installedNames.includes(command["name"])) {
        console.log(`Installing "${command["name"]}"`);
        InstallGuildCommand(appId, guildId, command);
      } else {
        InstallGuildCommand(appId, guildId, command);
        console.log(`"${command["name"]}" command updated`);
      }
    }
  } catch (err) {
    console.error(err);
  }
}

// Simple test command
export const TEST_COMMAND = {
  name: "test",
  description: "Basic guild command",
  type: 1,
};

// apex bot commands
export const GET_PLAYER_INFO_COMMAND = {
  name: "myinfo",
  description: "Gets a snapshot of player info and rank",
  type: 1,
};

export const GET_PLAYER_LEGEND_STATS_COMMAND = {
  name: "mylegendstats",
  description: "Get your legend stats",
  options: [
    {
      name: "selected",
      description: "Stats for currently selected legend",
      type: 1,
    },
    {
      name: "revenant",
      description: "Stats for Revenant",
      type: 1,
    },
  ],
  type: 1,
};

// Command containing options
// export const CHALLENGE_COMMAND = {
//   name: "challenge",
//   description: "Challenge to a match of rock paper scissors",
//   options: [
//     {
//       type: 3,
//       name: "object",
//       description: "Pick your object",
//       required: true,
//       choices: createCommandChoices(),
//     },
//   ],
//   type: 1,
// };
