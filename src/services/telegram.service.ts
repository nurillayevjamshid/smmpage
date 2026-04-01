export const telegramService = {
  /**
   * Test the Telegram Bot Token using the getMe method
   */
  async testConnection(token: string, chatId?: string): Promise<boolean> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/getMe`);
      const data = await response.json();
      if (!data.ok) return false;

      if (chatId) {
        const chatResponse = await fetch(`https://api.telegram.org/bot${token}/getChat?chat_id=${chatId}`);
        const chatData = await chatResponse.json();
        if (!chatData.ok) {
          console.error("Chat validation failed:", chatData.description);
          return false;
        }
      }
      return true;
    } catch (error) {
      console.error("Telegram connection test failed:", error);
      return false;
    }
  },

  /**
   * Send a text message to a Telegram chat/channel
   */
  async sendText(token: string, chatId: string, text: string): Promise<any> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          text: text,
          parse_mode: "HTML",
        }),
      });
      const data = await response.json();
      if (!data.ok) throw new Error(data.description || "Failed to send message");
      return data;
    } catch (error) {
      console.error("Telegram sendText failed:", error);
      throw error;
    }
  },

  /**
   * Send a photo to a Telegram chat/channel
   */
  async sendPhoto(token: string, chatId: string, photoUrl: string, caption?: string): Promise<any> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendPhoto`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          photo: photoUrl,
          caption: caption || "",
          parse_mode: "HTML",
        }),
      });
      const data = await response.json();
      if (!data.ok) throw new Error(data.description || "Failed to send photo");
      return data;
    } catch (error) {
      console.error("Telegram sendPhoto failed:", error);
      throw error;
    }
  },

  /**
   * Send a video to a Telegram chat/channel
   */
  async sendVideo(token: string, chatId: string, videoUrl: string, caption?: string): Promise<any> {
    try {
      const response = await fetch(`https://api.telegram.org/bot${token}/sendVideo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chat_id: chatId,
          video: videoUrl,
          caption: caption || "",
          parse_mode: "HTML",
        }),
      });
      const data = await response.json();
      if (!data.ok) throw new Error(data.description || "Failed to send video");
      return data;
    } catch (error) {
      console.error("Telegram sendVideo failed:", error);
      throw error;
    }
  }
};
