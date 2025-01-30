import dotenv from "dotenv";

dotenv.config();

export const CheckIntervalMs = parseInt(
  process.env.CHECK_INTERVAL_MS || "10000"
);
export const CheckMaxDelayMs = parseInt(
  process.env.CHECK_MAX_DELAY_MS || "10000"
);

export const Url = process.env.URL || "https://info-car.pl";
export const Login = process.env.LOGIN;
export const Password = process.env.PASSWORD;
export const CheckNextDays = parseInt(process.env.CHECK_NEXT_DAYS || "21");
export const CheckNextDaysMs = CheckNextDays * 24 * 60 * 60 * 1000;

export const TwilioConfig = {
  SendTo: process.env.TWILIO_SEND_TO,
  SendToDebug: process.env.TWILIO_SEND_TO_DEBUG,
  From: process.env.TWILIO_FROM,
  SID: process.env.TWILIO_SID,
  AuthToken: process.env.TWILIO_AUTH_TOKEN,
};
