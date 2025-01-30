import { chromium } from "playwright";
import { AuthUrl, ExamFormUrl } from "../urls";
import Logger from "../log";

const feature = process.env.REGISTER_FEATURE === "true";
const login = process.env.REGISTER_LOGIN ?? "";
const password = process.env.REGISTER_PASSWORD ?? "";
const pesel = process.env.REGISTER_PESEL ?? "";
const pkk = process.env.REGISTER_PKK ?? "";
const firstName = process.env.REGISTER_FIRST_NAME ?? "";
const lastName = process.env.REGISTER_LAST_NAME ?? "";
const email = process.env.REGISTER_EMAIL ?? "";
const phone = process.env.REGISTER_PHONE ?? "";

export const register = async () => {
  if (!feature) {
    Logger.info("Register feature is disabled");
    return;
  }

  Logger.info("Registering for the exam");
  try {
    const browser = await chromium.launch({
      headless: false,
      args: ["--window-size=1920,1080"],
    });

    const context = await browser.newContext({
      viewport: { width: 1920, height: 1080 },
    });

    const page = await context.newPage();

    // Zaloguj się
    await page.goto(AuthUrl);
    await page.fill("#username", login ?? "");
    await page.fill("#password", password ?? "");
    await page.click("#register-button");

    // Wypełnij dane
    await page.goto(ExamFormUrl);
    await page.click(".item__select-wrapper");
    await page.fill("#firstname", firstName);
    await page.fill("#lastname", lastName);
    await page.fill("#pesel", pesel);
    await page.fill("#pkk", pkk);
    await page.click("#category-select");
    await page.click("#b");
    await page.fill("#email", email);
    await page.fill("#phoneNumber", phone);
    await page.click("#regulations-text");
    await page.click("#next-btn");

    // Wybierz województwo
    await page.click("#province");
    await page.click("text=' śląskie '");

    // Wybierz ośrodek egzaminacyjny
    await page.click("#organization");
    await page.click("text=' WORD Katowice '");

    await page.click("#next-btn");

    // Wybierz rodzaj egzaminu
    await page.click("[aria-label='PRACTICE']");
    await page.click("#practiceExamsButton0");
    await page.click("#confirm-modal-btn");
    await page.click("#next-btn");

    // Wait for a long time to keep the browser open
    await page.waitForTimeout(1_000_000);
  } catch (error) {
    Logger.error("Error on registration:", error);
  } finally {
    Logger.info("Registration exited");
  }
};
