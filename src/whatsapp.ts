import Twilio from "twilio";
import { TwilioConfig } from "./env";
import Logger from "./log";

const client = Twilio(TwilioConfig.SID, TwilioConfig.AuthToken);

export const sendMessage = async (message: string) => {
  try {
    const response = await client.messages.create({
      from: `whatsapp:${TwilioConfig.From}`,
      to: `whatsapp:${TwilioConfig.SendTo}`,
      body: message,
    });
    Logger.info("Message sent:", response.sid);
  } catch (error) {
    Logger.error("Error sending message:", error);
  }
};
