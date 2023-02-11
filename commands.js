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
export const GET_APEX_NEWS_COMMAND = {
  name: "news",
  description: "Gets latest Apex news updates",
  options: [
    { name: "latest", description: "Most Recent News Update", type: 1 },
    { name: "lastthree", description: "Last Three News Updates", type: 1 },
  ],
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
    {
      name: "crypto",
      description: "Stats for Crypto",
      type: 1,
    },
    {
      name: "horizon",
      description: "Stats for Horizon",
      type: 1,
    },
    {
      name: "wattson",
      description: "Stats for Wattson",
      type: 1,
    },
    {
      name: "fuse",
      description: "Stats for Fuse",
      type: 1,
    },
    {
      name: "bangalore",
      description: "Stats for Bangalore",
      type: 1,
    },
    {
      name: "gibraltar",
      description: "Stats for Gibraltar",
      type: 1,
    },
    {
      name: "wraith",
      description: "Stats for Wraith",
      type: 1,
    },
    {
      name: "octane",
      description: "Stats for Octane",
      type: 1,
    },
    {
      name: "bloodhound",
      description: "Stats for Bloodhound",
      type: 1,
    },
    {
      name: "caustic",
      description: "Stats for Caustic",
      type: 1,
    },
    {
      name: "lifeline",
      description: "Stats for Lifeline",
      type: 1,
    },
    {
      name: "pathfinder",
      description: "Stats for Pathfinder",
      type: 1,
    },
    {
      name: "loba",
      description: "Stats for Loba",
      type: 1,
    },
    {
      name: "mirage",
      description: "Stats for Mirage",
      type: 1,
    },
    {
      name: "rampart",
      description: "Stats for Rampart",
      type: 1,
    },
    {
      name: "valkyrie",
      description: "Stats for Valkyrie",
      type: 1,
    },
    {
      name: "seer",
      description: "Stats for Seer",
      type: 1,
    },
    {
      name: "ash",
      description: "Stats for Ash",
      type: 1,
    },
    {
      name: "madmaggie",
      description: "Stats for Mad Maggie",
      type: 1,
    },
    {
      name: "newcastle",
      description: "Stats for Newcastle",
      type: 1,
    },
    {
      name: "vantage",
      description: "Stats for Vantage",
      type: 1,
    },
    {
      name: "catalyst",
      description: "Stats for Catalyst",
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
