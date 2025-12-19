require("dotenv").config();
const express = require("express");
const { Client, GatewayIntentBits } = require("discord.js");

const app = express();
app.use(express.json());

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const GUILD_ID = "1206973222017433610";
const CHANNEL_ID = "1420918727704318044";

client.once("clientReady", () => {
  console.log(`🤖 Bot conectado como ${client.user.tag}`);
});

// 🔗 ENDPOINT QUE CREA INVITE
app.post("/create-invite", async (req, res) => {
  if (req.headers["x-api-key"] !== process.env.API_KEY) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const guild = await client.guilds.fetch(GUILD_ID);
    const channel = await guild.channels.fetch(CHANNEL_ID);

    const invite = await channel.createInvite({
      maxUses: 1,
      maxAge: 60 * 60 * 24,
      unique: true
    });

    res.json({
      success: true,
      invite: invite.url
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      error: "No se pudo crear la invitación"
    });
  }
});

// 🚀 ARRANQUE DEL SERVIDOR
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🌐 API escuchando en http://localhost:${PORT}`);
});

client.login(process.env.DISCORD_TOKEN);
