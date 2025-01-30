class Logger {
  private static getDateTime(): string {
    const now = new Date();
    return now.toISOString();
  }

  private static getIcon(level: string): string {
    switch (level) {
      case "info":
        return "ℹ️";
      case "warn":
        return "⚠️";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  }

  static log(level: "info" | "warn" | "error", ...args: any[]): void {
    const dateTime = this.getDateTime();
    const icon = this.getIcon(level);
    console.log(`[${dateTime}] ${icon}`, ...args);
  }

  static info(...args: any[]): void {
    this.log("info", ...args);
  }

  static warn(...args: any[]): void {
    this.log("warn", ...args);
  }

  static error(...args: any[]): void {
    this.log("error", ...args);
  }
}

export default Logger;
