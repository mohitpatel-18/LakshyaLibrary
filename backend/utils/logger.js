import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const getTimestamp = () => new Date().toISOString();

const logToFile = (level, message) => {
  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  const logEntry = `[${getTimestamp()}] [${level.toUpperCase()}] ${message}\n`;
  fs.appendFileSync(logFile, logEntry);
};

export const logger = {
  info: (message) => {
    console.log(`\x1b[36m[INFO]\x1b[0m ${message}`);
    logToFile('info', message);
  },
  error: (message) => {
    console.error(`\x1b[31m[ERROR]\x1b[0m ${message}`);
    logToFile('error', message);
  },
  warn: (message) => {
    console.warn(`\x1b[33m[WARN]\x1b[0m ${message}`);
    logToFile('warn', message);
  },
  debug: (message) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`\x1b[35m[DEBUG]\x1b[0m ${message}`);
      logToFile('debug', message);
    }
  },
  success: (message) => {
    console.log(`\x1b[32m[SUCCESS]\x1b[0m ${message}`);
    logToFile('success', message);
  },
};
