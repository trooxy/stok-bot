const { Client, GatewayIntentBits, REST, Routes, SlashCommandBuilder } = require("discord.js");
const fetch = require("node-fetch");
require("dotenv").config();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const STOCK_DATA = {
  Seeds: ["Golden Seed", "Carrot Seed"],
  Gear: ["Watering Can"],
  Egg: ["Mystery Egg"],
  Cosmetic: ["Straw Hat"]
};

client.once("ready", () => {
  console.log(`Bot aktif: ${client.user.tag}`);
  registerCommands();
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === "stok") {
    const seeds = STOCK_DATA.Seeds.join(", ") || "Yok";
    const gear = STOCK_DATA.Gear.join(", ") || "Yok";
    const egg = STOCK_DATA.Egg.join(", ") || "Yok";
    const cosmetic = STOCK_DATA.Cosmetic.join(", ") || "Yok";

    await interaction.reply({
      content: `🪴 **Stok Durumu:**\n\n🌱 **Seeds:** ${seeds}\n⚙️ **Gear:** ${gear}\n🥚 **Egg:** ${egg}\n🎭 **Cosmetic:** ${cosmetic}`,
      ephemeral: false
    });
  }
});

async function registerCommands() {
  const commands = [
    new SlashCommandBuilder()
      .setName("stok")
      .setDescription("Anlık stok durumunu gösterir")
      .toJSON()
  ];

  const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

  try {
    console.log("Slash komutları yükleniyor...");
    await rest.put(Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID), {
      body: commands
    });
    console.log("Slash komutları yüklendi.");
  } catch (error) {
    console.error("Komut yükleme hatası:", error);
  }
}

client.login(process.env.TOKEN);
