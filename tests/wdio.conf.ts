import AllureReporter from '@wdio/allure-reporter';

import { getLogs, initLogger, logInfo } from './helpers/browserLogger';

const allure = require('allure-commandline');

// This is deprecated without alternative (https://github.com/nodejs/node/issues/32483)
// we need it to be able to reuse jitsi-meet code in tests
require.extensions['.web.ts'] = require.extensions['.ts'];

const chromeArgs = [
    '--allow-insecure-localhost',
    '--use-fake-ui-for-media-stream',
    '--use-fake-device-for-media-stream',
    '--disable-plugins',
    '--mute-audio',
    '--disable-infobars',
    '--autoplay-policy=no-user-gesture-required',
    '--auto-select-desktop-capture-source=Your Entire screen',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-setuid-sandbox',
    '--use-file-for-fake-audio-capture=tests/resources/fakeAudioStream.wav'
];

if (process.env.RESOLVER_RULES) {
    chromeArgs.push(`--host-resolver-rules=${process.env.RESOLVER_RULES}`);
}
if (process.env.ALLOW_INSECURE_CERTS === 'true') {
    chromeArgs.push('--ignore-certificate-errors');
}
if (process.env.HEADLESS === 'true') {
    chromeArgs.push('--headless');
    chromeArgs.push('--window-size=1400,600');
}
if (process.env.VIDEO_CAPTURE_FILE) {
    chromeArgs.push(`use-file-for-fake-video-capture=${process.env.VIDEO_CAPTURE_FILE}`);
}

const chromePreferences = {
    'intl.accept_languages': 'en-US'
};

const TEST_RESULTS_DIR = 'test-results';

export const config: WebdriverIO.MultiremoteConfig = {

    runner: 'local',

    specs: [
        'specs/**'
    ],
    maxInstances: 1,

    baseUrl: 'https://alpha.jitsi.net/torture',
    tsConfigPath: '../tsconfig.web.json',

    // Default timeout for all waitForXXX commands.
    waitforTimeout: 1000,

    // Default timeout in milliseconds for request
    // if browser driver or grid doesn't send response
    connectionRetryTimeout: 15000,

    // Default request retries count
    connectionRetryCount: 3,

    framework: 'jasmine',

    jasmineOpts: {
        defaultTimeoutInterval: 60000
    },

    capabilities: {
        participant1: {
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: chromeArgs,
                    prefs: chromePreferences
                }
            }
        },
        participant2: {
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: chromeArgs,
                    prefs: chromePreferences
                },
                'wdio:exclude': [
                    'specs/alone/**'
                ]
            }
        },
        participant3: {
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: chromeArgs,
                    prefs: chromePreferences
                },
                'wdio:exclude': [
                    'specs/2way/**'
                ]
            }
        },
        participant4: {
            capabilities: {
                browserName: 'chrome',
                'goog:chromeOptions': {
                    args: chromeArgs,
                    prefs: chromePreferences
                },
                'wdio:exclude': [
                    'specs/3way/**'
                ]
            }
        }
    },

    // Level of logging verbosity: trace | debug | info | warn | error | silent
    logLevel: 'trace',
    logLevels: {
        webdriver: 'info'
    },

    // Set directory to store all logs into
    outputDir: TEST_RESULTS_DIR,

    reporters: [
        [ 'junit', {
            outputDir: TEST_RESULTS_DIR,
            outputFileFormat(options) { // optional
                return `results-${options.cid}.xml`;
            }
        } ],
        [ 'allure', {
            // addConsoleLogs: true,
            outputDir: `${TEST_RESULTS_DIR}/allure-results`,
            disableWebdriverStepsReporting: true,
            disableWebdriverScreenshotsReporting: true,
            useCucumberStepReporter: false
        } ]
    ],

    // =====
    // Hooks
    // =====
    /**
     * Gets executed before test execution begins. At this point you can access to all global
     * variables like `browser`. It is the perfect place to define custom commands.
     * @param {Array.<Object>} capabilities list of capabilities details
     * @param {Array.<String>} specs        List of spec file paths that are to be run
     * @param {object}         browser      instance of created browser/device session
     */
    before(capabilities, specs, browser) {
        browser.instances.forEach((instance: string) => {
            initLogger(browser[instance], instance, TEST_RESULTS_DIR);
        });
    },

    /**
     * Gets executed before the suite starts (in Mocha/Jasmine only).
     * @param {object} suite suite details
     */
    beforeSuite(suite) {
        browser.instances.forEach((instance: string) => {
            logInfo(browser[instance], `---=== Begin ${suite.file.substring(suite.file.lastIndexOf('/') + 1)} ===---`);
        });
    },

    /**
     * Function to be executed before a test (in Mocha/Jasmine only)
     * @param {object} test    test object
     */
    beforeTest(test) {
        browser.instances.forEach((instance: string) => {
            logInfo(browser[instance], `---=== Start test ${test.fullName} ===---`);
        });
    },

    /**
     * Function to be executed after a test (in Mocha/Jasmine only)
     * @param {object}  test             test object
     * @param {object}  context          scope object the test was executed with
     * @param {Error}   error     error object in case the test fails, otherwise `undefined`
     */
    afterTest: async function(test, context, { error }) {
        browser.instances.forEach((instance: string) =>
            logInfo(browser[instance], `---=== End test ${test.fullName} ===---`));

        if (error) {
            const allProcessing = [];

            browser.instances.forEach((instance: string) => {
                const bInstance = browser.getInstance(instance);

                allProcessing.push(bInstance.takeScreenshot().then(shot => {
                    AllureReporter.addAttachment(
                        `Screenshot-${instance}`,
                        Buffer.from(shot, 'base64'),
                        'image/png');
                }));


                AllureReporter.addAttachment(`console-logs-${instance}`, getLogs(bInstance), 'text/plain');

                allProcessing.push(bInstance.getPageSource().then(source => {
                    AllureReporter.addAttachment(`html-source-${instance}`, source, 'text/plain');
                }));
            });

            await Promise.all(allProcessing);
        }
    },

    /**
     * Hook that gets executed after the suite has ended (in Mocha/Jasmine only).
     * @param {object} suite suite details
     */
    afterSuite(suite) {
        browser.instances.forEach((instance: string) => {
            logInfo(browser[instance], `---=== End ${suite.file.substring(suite.file.lastIndexOf('/') + 1)} ===---`);
        });
    },

    /**
     * Gets executed after all workers have shut down and the process is about to exit.
     * An error thrown in the `onComplete` hook will result in the test run failing.
     */
    onComplete() {
        const reportError = new Error('Could not generate Allure report');
        const generation = allure([
            'generate', `${TEST_RESULTS_DIR}/allure-results`,
            '--clean', '--single-file',
            '--report-dir', `${TEST_RESULTS_DIR}/allure-report`
        ]);

        return new Promise<void>((resolve, reject) => {
            const generationTimeout = setTimeout(
                () => reject(reportError),
                5000);

            generation.on('exit', eCode => {
                clearTimeout(generationTimeout);

                if (eCode !== 0) {
                    return reject(reportError);
                }

                console.log('Allure report successfully generated');
                resolve();
            });
        });
    }
};
