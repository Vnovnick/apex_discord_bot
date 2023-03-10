import "dotenv/config";
import fetch from "node-fetch";
import { verifyKey } from "discord-interactions";
import { InteractionResponseType } from "discord-interactions";

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function checkUserName(userObject, nickName) {
  if (nickName) {
    return nickName;
  } else {
    return userObject.username;
  }
}

export function VerifyDiscordRequest(clientKey) {
  return function (req, res, buf, encoding) {
    const signature = req.get("X-Signature-Ed25519");
    const timestamp = req.get("X-Signature-Timestamp");

    const isValidRequest = verifyKey(buf, signature, timestamp, clientKey);
    if (!isValidRequest) {
      res.status(401).send("Bad request signature");
      throw new Error("Bad request signature");
    }
  };
}

export async function DiscordRequest(endpoint, options) {
  // append endpoint to root API URL
  const url = "https://discord.com/api/v10/" + endpoint;
  // Stringify payloads
  if (options.body) options.body = JSON.stringify(options.body);
  // Use node-fetch to make requests
  const res = await fetch(url, {
    headers: {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      "Content-Type": "application/json; charset=UTF-8",
    },
    ...options,
  });
  // throw API errors
  if (!res.ok) {
    const data = await res.json();
    console.log(res.status);
    throw new Error(JSON.stringify(data));
  }
  // return original response
  return res;
}

export const setEmbedColor = (rank) => {
  switch (rank) {
    case "Bronze":
      return 4929078;
    case "Silver":
      return 7500402;
    case "Gold":
      return 16764010;
    case "Platinum":
      return 2253920;
    case "Diamond":
      return 2719487;
    case "Master":
      return 8396031;
    case "Predator":
      return 11213338;
    default:
      return 6316128;
  }
};

export const legendEmbed = (
  legendName,
  firstTrack,
  firstVal,
  secondTrack,
  secondVal,
  thirdTrack,
  thirdVal,
  imgUrl
) => {
  const embed = [
    {
      fields: [
        {
          name: "Legend: ",
          value: legendName,
          inline: false,
        },
        {
          name: "First Tracker: ",
          value: `${firstTrack} - *${firstVal}*`,
          inline: false,
        },
        {
          name: "Second Tracker: ",
          value: `${secondTrack} - *${secondVal}*`,
          inline: false,
        },
        {
          name: "Third Tracker: ",
          value: `${thirdTrack} - *${thirdVal}*`,
          inline: false,
        },
      ],
      image: {
        url: imgUrl,
      },
    },
  ];
  return embed;
};

export const legendEmbedWithRank = (
  legendName,
  firstTrack,
  firstVal,
  firstRankPos,
  firstRankPercent,
  secondTrack,
  secondVal,
  secondRankPos,
  secondRankPercent,
  thirdTrack,
  thirdVal,
  thirdRankPos,
  thirdRankPercent,
  imgUrl
) => {
  const embed = [
    {
      // title: legendName,
      fields: [
        // {
        //   name: "Legend: ",
        //   value: legendName,
        //   inline: false,
        // },
        {
          name: "First Active Tracker: ",
          value: `${firstTrack} - *${firstVal}*\nRank Pos: *${firstRankPos}*\nTop ${firstRankPercent}%`,
          inline: false,
        },
        {
          name: "Second Active Tracker: ",
          value: `${secondTrack} - *${secondVal}*\nRank Pos: *${secondRankPos}*\nTop ${secondRankPercent}%`,
          inline: false,
        },
        {
          name: "Third Active Tracker: ",
          value: `${thirdTrack} - *${thirdVal}*\nRank Pos: *${thirdRankPos}*\nTop ${thirdRankPercent}%`,
          inline: false,
        },
      ],
      image: {
        url: imgUrl,
      },
    },
  ];
  return embed;
};

export const legendMissingData = (legendName, imgUrl) => {
  const embed = [
    {
      // title: legendName,
      image: {
        url: imgUrl,
      },
    },
  ];
  return embed;
};

export const setLegendImage = (legend, data) => {
  if (legend === "Mad Maggie") {
    return "https://api.mozambiquehe.re//assets//icons//mad%20maggie.png";
  } else {
    return data.legends.all[legend].ImgAssets.icon;
  }
};

export const legendStatsSubCommand = (legend, statData, response) => {
  const capLegend = capitalizeFirstLetter(legend);

  if (statData.legends.all[capLegend].data) {
    return response.send({
      type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
      data: {
        content: `${statData.global.name}'s ${capLegend} stats: `,
        embeds: legendEmbedWithRank(
          capLegend,
          statData.legends.all[capLegend].data[0].name,
          statData.legends.all[capLegend].data[0].value,
          statData.legends.all[capLegend].data[0].rank.rankPos,
          statData.legends.all[capLegend].data[0].rank.topPercent,
          statData.legends.all[capLegend].data[1].name,
          statData.legends.all[capLegend].data[1].value,
          statData.legends.all[capLegend].data[1].rank.rankPos,
          statData.legends.all[capLegend].data[1].rank.topPercent,
          statData.legends.all[capLegend].data[2].name,
          statData.legends.all[capLegend].data[2].value,
          statData.legends.all[capLegend].data[2].rank.rankPos,
          statData.legends.all[capLegend].data[2].rank.topPercent,
          setLegendImage(capLegend, statData)
        ),
      },
    });
  }
  return response.send({
    type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
    data: {
      content: `Data unavailable. Select ${capLegend} in game to generate data.`,
    },
  });
};
