// const { createLogger, format, transports } = require("winston");
// const { combine, timestamp, label, printf } = format;

// const myFormat = printf(({ level, message, timestamp }) => {
//   return `${timestamp} ${level}: ${message}`;
// });

// const loggertracker = createLogger({
//   level: "info",
//   format: combine(timestamp(), myFormat),
//   transports: [
//     //
//     // - Write to all logs with level `info` and below to `combined.log`
//     // - Write all logs error (and below) to `error.log`.
//     //
//     new transports.File({ filename: "logs/errortracker.log", level: "error" }),
//     new transports.File({ filename: "logs/combinedtracker.log" }),
//   ],
// });

// loggertracker.info("Info string");
// loggertracker.error("Error string");

// module.exports = { loggertracker };
const winston = require("winston");

const loggertracker = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.simple(),
    winston.format.colorize(),
    winston.format.prettyPrint(),
    winston.format.errors({ stack: true })
  ),

  transports: [
    new winston.transports.File({
      filename: "logs/errortracker.log",
      level: "error",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.simple(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true })
      ),
    }),
    new winston.transports.File({
      filename: "logs/combinedtracker.log",
      level: "info",
      format: winston.format.combine(
        winston.format.timestamp({
          format: "YYYY-MM-DD HH:mm:ss",
        }),
        winston.format.simple(),
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.errors({ stack: true })
      ),
    }),
  ],
});

if (process.env.ENVIRONMENT !== "production") {
  loggertracker.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    })
  );
}

module.exports = { loggertracker };
