const eras = {
  beginning: {
    First_Section: {
      start: 1636987092159,
      end: 1638205715933,
      messages: [],
    },
    Second_Section: {
      start: 1640127179126,
      end: 1643249702778,
      messages: [],
    },
  },
  secondChapter: {
    First_Section_of_Second_Chapter: {
      start: 1671119547680,
      end: 1671582083815,
      messages: [],
    },
  },
};
// end: 1714082322790,
const sanitizeMessage = (message) => {
  return {
    source: message.source !== undefined ? message.source : "",
    sender_name: message.sender_name !== undefined ? message.sender_name : "",
    timestamp_ms: message.timestamp_ms !== undefined ? message.timestamp_ms : 0,
    timestamp: new Date(message.timestamp_ms)
      .toLocaleString("en-US", {
        // year: "numeric",
        month: "short",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", ""),
    content: message.content !== undefined ? message.content : "",
    gifs: Array.isArray(message.gifs) ? message.gifs : [],
    share: {
      link: message.share?.link !== undefined ? message.share.link : "",
      share_text:
        message.share?.share_text !== undefined ? message.share.share_text : "",
      original_content_owner:
        message.share?.original_content_owner !== undefined
          ? message.share.original_content_owner
          : "",
      profile_share_username:
        message.share?.profile_share_username !== undefined
          ? message.share.profile_share_username
          : "",
      profile_share_name:
        message.share?.profile_share_name !== undefined
          ? message.share.profile_share_name
          : "",
    },
    photos: Array.isArray(message.photos) ? message.photos : [],
    videos: Array.isArray(message.videos) ? message.videos : [],
    is_geo_blocked_for_viewer:
      message.is_geo_blocked_for_viewer !== undefined
        ? message.is_geo_blocked_for_viewer
        : false,
    reactions: Array.isArray(message.reactions) ? message.reactions : [],
    // map((reaction) => ({
    //     reaction: reaction.reaction ?? "", // Correctly accessing the reaction and actor from each reaction object
    //     actor: reaction.actor ?? "",
    //   }))
    // : [],
    user_ids: Array.isArray(message.user_ids) ? message.user_ids : [],
  };
};

const findEraAndChapter = (dict, timestamp) => {
  for (const era in dict) {
    for (const chapter in dict[era]) {
      if (
        timestamp >= dict[era][chapter].start &&
        timestamp <= dict[era][chapter].end
      ) {
        return { era, chapter };
      }
    }
  }
  return { era: null, chapter: null };
};

const filterAndGroupMessagesBySenderAndTime = async (messages) => {
  let dict = JSON.parse(JSON.stringify(eras));
  const timeDifferenceRange = 20; // minutes
  if (!messages.length) return dict;

  let currentGroup = [];
  let lastTimestamp = null;

  const regex = /^Reacted.*to your message $/;
  const filteredMessages = messages.filter(
    (message) => !regex.test(message.content)
  );

  filteredMessages.forEach((message, index) => {
    const timestamp = message.timestamp_ms;
    const isNewDay =
      !lastTimestamp ||
      new Date(timestamp).toDateString() !==
        new Date(lastTimestamp).toDateString();
    const timeDifference = lastTimestamp
      ? (timestamp - lastTimestamp) / 60000
      : Number.MAX_VALUE;
    const isNewSender =
      !currentGroup.length ||
      message.sender_name !== currentGroup[currentGroup.length - 1].sender_name;

    // Determine if starting a new group based on time or day change
    if (isNewSender || timeDifference > timeDifferenceRange || isNewDay) {
      if (currentGroup.length === 1) {
        currentGroup[0].class = ""; // Single message in group, set class to ''
      } else if (currentGroup.length > 1) {
        currentGroup[currentGroup.length - 1].class = "last"; // End of group, set class to 'last'
      }
      if (currentGroup.length) {
        const { era, chapter } = findEraAndChapter(
          dict,
          currentGroup[0].timestamp_ms
        );
        if (era && chapter) {
          dict[era][chapter].messages.push([...currentGroup]);
        }
      }
      currentGroup = []; // Start a new group
    }

    // Determine timestamp log: Only assign if there's a new day or significant time gap
    const shouldAssignTimestamp =
      isNewDay || timeDifference > timeDifferenceRange;
    const timestampLog = shouldAssignTimestamp
      ? new Date(timestamp)
          .toLocaleString("en-US", {
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })
          .replace(",", "")
      : null;

    // Add message to the current group
    currentGroup.push({
      ...sanitizeMessage(message),
      class: currentGroup.length === 0 ? "first" : "middle",
      timestamp_log:
        currentGroup.length === 0 && shouldAssignTimestamp
          ? timestampLog
          : null,
    });

    lastTimestamp = timestamp; // Update last timestamp
  });

  // Handle the last group
  if (currentGroup.length === 1) {
    currentGroup[0].class = ""; // Single message in group, set class to ''
  } else if (currentGroup.length > 1) {
    currentGroup[currentGroup.length - 1].class = "last"; // End of group, set class to 'last'
  }
  if (currentGroup.length) {
    const { era, chapter } = findEraAndChapter(currentGroup[0].timestamp_ms);
    if (era && chapter) {
      dict[era][chapter].messages.push(currentGroup);
    }
  }

  return dict;
};

const processMessages = async (messages) => {
  const groupedEras = await filterAndGroupMessagesBySenderAndTime(messages);
  // const processedEras = await editTimestampLogs(groupedEras);
  return groupedEras;
};

module.exports = { processMessages };
