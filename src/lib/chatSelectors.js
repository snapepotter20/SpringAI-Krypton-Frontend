export function getLastUserPrompt(messages) {
  return [...messages].reverse().find((message) => message.role === "user")?.content ?? "";
}

export function getChatTitle(chat) {
  return chat?.title || "New Krypton chat";
}

export function getChatSubtitle(chat) {
  if (!chat?.messages?.length) {
    return "Ready for a first prompt";
  }

  return chat.lastMessagePreview || chat.messages[chat.messages.length - 1].content;
}
