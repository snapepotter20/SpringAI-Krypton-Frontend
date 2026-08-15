async function readJson(response) {
  if (!response.ok) {
    const fallbackMessage = `Krypton backend returned ${response.status}`;

    try {
      const payload = await response.json();
      throw new Error(payload.message || fallbackMessage);
    } catch (error) {
      if (error instanceof Error && error.message !== "Unexpected end of JSON input") {
        throw error;
      }

      throw new Error(fallbackMessage);
    }
  }

  return response.json();
}

export async function listChats(signal) {
  const response = await fetch("/api/chats", { signal });
  return readJson(response);
}

export async function getChat(chatId, signal) {
  const response = await fetch(`/api/chats/${chatId}`, { signal });
  return readJson(response);
}

export async function createChat(title = "New Krypton chat", signal) {
  const response = await fetch("/api/chats", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title }),
    signal
  });

  return readJson(response);
}

export async function sendMessage(chatId, prompt, files, signal) {
  const formData = new FormData();
  formData.append("prompt", prompt);

  files.forEach((file) => {
    formData.append("files", file);
  });

  const response = await fetch(`/api/chats/${chatId}/messages`, {
    method: "POST",
    body: formData,
    signal
  });

  return readJson(response);
}
