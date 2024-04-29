const fs = require('fs');
const path = require('path');

function log(message) {
  const timestamp = new Date().toISOString();
  const logEntry = `[${timestamp}] ${message}\n`;
  const logFilePath = path.join(__dirname, '..', 'log.log');

  fs.readFile(logFilePath, 'utf8', (err, data) => {
    if (err && err.code !== 'ENOENT') {
      console.error('Error reading log file:', err);
      return;
    }

    const content = data ? logEntry + data : logEntry;

    fs.writeFile(logFilePath, content, (err) => {
      if (err) {
        console.error('Error writing log file:', err);
      }
    });
  });
}

module.exports = { log };
