import { chromium, type Page } from "playwright";
import { AuthUrl, ExamsApiUrl, SelectDateUrl } from "./urls";
import { CheckNextDays, Login, Password } from "./env";
import type { ExamsResponse } from "./types";
import Logger from "./log";

export type Context = {
  bearer: string | null;
};

export const init = async (ctx: Context) => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  page.on("request", (request) => {
    const authHeader = request.headers()["authorization"];
    if (authHeader != null && authHeader.startsWith("Bearer")) {
      ctx.bearer = authHeader;
    }
  });

  return page;
};

export const auth = async (page: Page) => {
  Logger.info("Authenticating");
  await page.goto(AuthUrl);
  await page.fill("#username", Login ?? "");
  await page.fill("#password", Password ?? "");
  await page.click("#register-button");
  await page.goto(SelectDateUrl);
  await page.waitForSelector("text=Sprawdź dostępność terminów egzaminu na prawo jazdy");

  return page;
};

export const closestDate = async (
  page: Page,
  ctx: Context
): Promise<Date | null> => {
  Logger.info("Fetching exams");
  const [result, error, response] = await page.evaluate(
    async ({ url, ctx, checkNextDays }) => {
      const body = {
        category: "B",
        startDate: new Date().toISOString(),
        endDate: new Date(
          new Date().setDate(new Date().getDate() + checkNextDays)
        ).toISOString(),
        wordId: "45",
      };

      let response: Response | null = null;
      try {
        response = null;
        response = await fetch(url, {
          method: "PUT",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            authorization: ctx.bearer!,
          },
          body: JSON.stringify(body),
        });

        const res = (await response.json()) as ExamsResponse;
        return [res, null];
      } catch (error) {
        return [null, error, response];
      }
    },
    {
      url: ExamsApiUrl,
      checkNextDays: CheckNextDays,
      ctx,
    }
  );
    
  if (error != null) {
    ctx.bearer = null;
    Logger.error(`Error fetching exams: ${JSON.stringify(error)}, for response: ${JSON.stringify(response)}`);
    return null;
  }

  const practiceExam = result?.schedule?.scheduledDays
    ?.find((x) => x.scheduledHours.some((y) => y.practiceExams.length > 0))
    ?.scheduledHours?.find((x) => x.practiceExams.length > 0);

  const date = practiceExam?.practiceExams[0]?.date;

  return date ? new Date(date) : null;
};
