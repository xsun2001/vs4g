import locales from "@/locales/zh-CN";

const LocalizerImpl: (messageId: string) => string = messageId => {
  const parts = messageId.split(".");
  if (parts[0] !== "") {
    console.warn("Cannot find message for id: " + messageId);
    return messageId;
  }
  let message = locales;
  for (let i = 1; i < parts.length; i++) {
    message = message[parts[i]];
    if (message === undefined) {
      console.warn("Cannot find message for id: " + messageId);
      return messageId;
    }
  }
  if (typeof message === "string") {
    return message;
  } else {
    console.warn("Cannot find message for id: " + messageId);
    return messageId;
  }
};

export default LocalizerImpl;