import os
import asyncio
import discord
from discord import app_commands
from discord.ext import tasks
from dotenv import load_dotenv
import database
import main  # the pipeline

load_dotenv()
database.init_db()

intents = discord.Intents.default()
bot = discord.Client(intents=intents)
tree = app_commands.CommandTree(bot)


@bot.event
async def on_ready():
    # DEV ONLY: push commands to each server instantly.
    # Global sync (plain tree.sync()) can take up to an hour to appear.
    for guild in bot.guilds:
        tree.copy_global_to(guild=guild)
        await tree.sync(guild=guild)

    print(f"Logged in as {bot.user} ({bot.user.id})")
    print(f"In {len(bot.guilds)} server(s)")

    if not news_loop.is_running():
        news_loop.start()


@tree.command(name="setup", description="Choose the channel where space news gets posted.")
@app_commands.describe(channel="The channel to post space news in")
@app_commands.checks.has_permissions(manage_guild=True)
async def setup(interaction: discord.Interaction, channel: discord.TextChannel):
    database.register_guild(str(interaction.guild_id), str(channel.id))
    await interaction.response.send_message(
        f"Done. Space news will post to {channel.mention}.", ephemeral=True
    )


@setup.error
async def setup_error(interaction: discord.Interaction, error):
    if isinstance(error, app_commands.MissingPermissions):
        await interaction.response.send_message(
            "You need the Manage Server permission to do that.", ephemeral=True
        )


@bot.event
async def on_guild_remove(guild):
    database.remove_guild(str(guild.id))
    print(f"Removed from {guild.name}, cleaned its row.")


@tasks.loop(minutes=10)
async def news_loop():
    # Blocking pipeline (SNAPI, Jina, OpenAI) runs off the event loop
    try:
        approved = await asyncio.to_thread(main.run_pipeline)
    except Exception as e:
        print(f"Pipeline error: {e}")
        return

    if not approved:
        return

    for cid in database.get_all_channels():
        channel = bot.get_channel(int(cid))
        if channel is None:
            try:
                channel = await bot.fetch_channel(int(cid))
            except discord.DiscordException:
                print(f"Cannot access channel {cid}, skipping")
                continue

        for art in approved:
            content = f"**{art['title']}**\n{art['summary']}\n{art['url']}"
            try:
                await channel.send(content)
            except discord.DiscordException as e:
                print(f"Failed to send to {cid}: {e}")


@news_loop.before_loop
async def before_news_loop():
    await bot.wait_until_ready()


bot.run(os.environ["DISCORD_BOT_TOKEN"])