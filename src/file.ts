import { promises as fs } from "fs";
import { join } from "path";
import Logger from "./log";

const examDateFilePath = join(process.cwd(), "examDate.json");

export const saveExamDate = async (date: Date | undefined) => {
  if (date) {
    await fs.writeFile(
      examDateFilePath,
      JSON.stringify({ examDate: date.toISOString() })
    );
  }
};

export const loadExamDate = async (): Promise<Date | undefined> => {
  try {
    const data = await fs.readFile(examDateFilePath, "utf-8");
    const parsed = JSON.parse(data);
    return new Date(parsed.examDate);
  } catch (error) {
    Logger.error("Could not load exam date:", error);
    return undefined;
  }
};
