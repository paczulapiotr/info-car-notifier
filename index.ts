import { sleep } from "bun";
import { auth, init, closestDate, type Context } from "./src/page";
import { CheckIntervalMs, CheckMaxDelayMs, CheckNextDays, CheckNextDaysMs } from "./src/env";
import Logger from "./src/log";
import { loadExamDate, saveExamDate } from "./src/file";
import { sendMessage } from "./src/whatsapp";
import { ExamFormUrl, SelectDateUrl } from "./src/urls";
import { register } from "./src/form/register";

const onExamFound = async (date: Date) => {
  examDate = date;
  saveExamDate(date);
  const formatted = examDate.toLocaleString("pl-PL");
  Logger.info("💥💥💥 NEW EXAM DATE: ", formatted);
  register();
  await sendMessage(
    `💥💥💥 ${formatted}\n\nPokaz terminy:${SelectDateUrl}\n\nDo formularza: ${ExamFormUrl}`
  );
};
const ctx: Context = { bearer: null };

Logger.info("Application starting...");

const page = await init(ctx);
let run = true;
let examDate = await loadExamDate();

process.on("SIGINT", () => {
  run = false;
  Logger.info("Application stopping...");
});

while (run) {
  try {
    if (ctx.bearer == null) {
      await auth(page);
    }

    const date = await closestDate(page, ctx);

    if (
      date != null &&
      (examDate == null || date.getTime() != examDate.getTime()) &&
      date.getTime() <= Date.now() + CheckNextDaysMs
    ) {
      await onExamFound(date);
    }
  } catch (error) {
    Logger.error("Error occurred:", error);
  }

  const randomDelay =
    CheckIntervalMs + Math.floor(Math.random() * CheckMaxDelayMs);
  Logger.info(`Waiting for ${randomDelay}ms...`);
  await sleep(randomDelay);
}

Logger.info("Application stopped...");
