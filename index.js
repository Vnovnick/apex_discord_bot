import { Client, GatewayIntentBits, Events, Collection } from "discord.js";
import "dotenv/config";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

client.commands = new Collection();
const foldersPath = path.join(__dirname, "/commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    // line below not working; see last bookmarked link
    const { default: command } = await import(filePath);
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    client.commands.set(command.data.name, command);
  }
}

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});
// const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

// client.on("ready", () => {
//   console.log(`Logged in as ${client.user.tag}!`);
// });

// client.on(Events.InteractionCreate, async (interaction) => {
//   if (!interaction.isChatInputCommand()) return;

//   if (interaction.commandName === "ping") {
//     await interaction.reply("Pong!");
//   }

//   if (interaction.commandName === "what") {
//     await interaction.reply("insane");
//   }
// });

client.once(Events.ClientReady, (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.login(process.env.DISCORD_TOKEN);
// async function main() {
//   const commands = [
//     {
//       name: "what",
//       description: "i hate this",
//     },
//   ];

//   try {
//     console.log("Started refreshing application (/) commands.");

//     await rest.put(
//       Routes.applicationCommands(process.env.APP_ID, process.env.GUILD_ID),
//       { body: commands }
//     );

//     console.log("Successfully reloaded application (/) commands.");
//   } catch (error) {
//     console.error(error);
//   }
// }

// main();
