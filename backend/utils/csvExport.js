import { createObjectCsvWriter } from 'csv-writer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { logger } from './logger.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure exports directory exists
const exportsDir = path.join(__dirname, '../exports');
if (!fs.existsSync(exportsDir)) {
  fs.mkdirSync(exportsDir, { recursive: true });
}

/**
 * Generate CSV export from data
 * @param {Array} data - Array of objects to export
 * @param {Array} headers - Array of header strings
 * @param {String} filename - Output filename
 * @returns {String} Path to generated CSV file
 */
export const generateCSVExport = async (data, headers, filename) => {
  try {
    const filePath = path.join(exportsDir, filename);

    // Convert headers array to csv-writer format
    const csvHeaders = headers.map((header, index) => ({
      id: Object.keys(data[0] || {})[index] || `field${index}`,
      title: header
    }));

    // If data is empty, create file with headers only
    if (!data || data.length === 0) {
      const csvWriter = createObjectCsvWriter({
        path: filePath,
        header: csvHeaders
      });
      await csvWriter.writeRecords([]);
      logger.info(`Empty CSV file created: ${filename}`);
      return filePath;
    }

    // Create CSV writer with dynamic headers based on first data object
    const dataKeys = Object.keys(data[0]);
    const mappedHeaders = dataKeys.map((key, index) => ({
      id: key,
      title: headers[index] || key
    }));

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: mappedHeaders
    });

    await csvWriter.writeRecords(data);
    logger.success(`CSV file generated: ${filename} with ${data.length} records`);

    return filePath;
  } catch (error) {
    logger.error(`Error generating CSV: ${error.message}`);
    throw error;
  }
};

/**
 * Clean up old export files (older than 24 hours)
 */
export const cleanupOldExports = () => {
  try {
    const files = fs.readdirSync(exportsDir);
    const now = Date.now();
    const dayInMs = 24 * 60 * 60 * 1000;

    files.forEach(file => {
      const filePath = path.join(exportsDir, file);
      const stats = fs.statSync(filePath);
      
      if (now - stats.mtimeMs > dayInMs) {
        fs.unlinkSync(filePath);
        logger.info(`Deleted old export file: ${file}`);
      }
    });
  } catch (error) {
    logger.error(`Error cleaning up exports: ${error.message}`);
  }
};

export default { generateCSVExport, cleanupOldExports };
