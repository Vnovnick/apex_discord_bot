import { Client, GatewayIntentBits, REST, Routes } from "discord.js";
import "dotenv/config";
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);

client.on("ready", () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on("interactionCreate", async (interaction) => {
  if (interaction.isChatInputCommand()) {
    console.log("yess");
    if (interaction.commandName === "what") {
      console.log("hello");
      await interaction.reply({ content: "yo" });
    }
  } else {
    console.log("something is wrong");
  }
});

client.login(process.env.DISCORD_TOKEN);
async function main() {
  const commands = [
    {
      name: "what",
      description: "i dont know",
    },
  ];

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(
      Routes.applicationCommands(process.env.APP_ID, process.env.GUILD_ID),
      { body: commands }
    );

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}

main();
