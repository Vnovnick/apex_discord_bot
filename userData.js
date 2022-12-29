import axios from "axios";
import { requests } from "discord.js";

const url = `https://discord.com/api/v10/applications/${process.env.APP_ID}/guilds/${process.env.GUILD_ID}/commands`;
