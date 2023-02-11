# Apex Stat Tracking Discord Bot

### In-progress features

- Get most recent match data (requires patreon sub with API - progress cancelled)
- Find a way to link Origin and Discord (or at least get player usernames) to make requests w/o having to change server nickname

### Completed Features (So far only supported for PC/Origin players)

- Get Player info (/myinfo)

  - Request made with either Discord Username or Server Nickname
    - User must set their nickname to their Origin username if Discord username isn't the same as their Origin username

- Get Player Legend Stats (/mylegendstats)

  - Same UserName restriction as the /myinfo command
  - Subcommands created for all legends
    - /mylegendstats "legendname"
  - Limitation: since the API only has data ready for most recently used legends, not all stats for legends are available. User must select the legend in game, or use them, to then see the stats with the /mylegendstats command

- Get Latest Apex News Updates (/news)
  - Two Subcommands:
    - /latest - gives the latest news update
    - /lastthree - gives the last three news updates (command name might be changed)
