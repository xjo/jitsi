const fs = require('node:fs');

/**
 * Initialize logger for a driver.
 * @param driver The driver.
 * @param name The name of the participant.
 * @param folder the folder to save the file.
 */
export function initLogger(driver, name, folder) {
    driver.logFile = `${folder}/${name}.log`;
    driver.sessionSubscribe({ events: [ 'log.entryAdded' ] });

    driver.on('log.entryAdded', async (entry: any) => {
        try {
            await fs.appendFileSync(driver.logFile, `${entry.text}\n`);
        } catch (err) {
            console.log(err);
        }
    });
}

/**
 * Returns the content of the log file.
 * @param driver The driver which log file is requested.
 */
export function getLogs(driver) {
    if (!driver.logFile) {
        return;
    }

    return fs.readFileSync(driver.logFile, 'utf8');
}

/**
 * Logs a message in the logfile.
 * @param driver The participant in which log file to write.
 * @param message The message to add.
 */
export async function logInfo(driver, message) {
    if (!driver.logFile) {
        return;
    }

    try {
        await fs.appendFileSync(driver.logFile, `${message}\n`);
    } catch (err) {
        console.log(err);
    }
}

