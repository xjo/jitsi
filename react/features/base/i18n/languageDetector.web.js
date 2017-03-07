/* @flow */

import BrowserLanguageDetector from 'i18next-browser-languagedetector';

import configLanguageDetector from './configLanguageDetector';

declare var interfaceConfig: Object;

/**
 * The ordered list (by name) of language detectors to be utilized as backends
 * by the singleton language detector for Web.
 *
 * @type {Array<string>}
 */
const order = [
    'querystring',
    'localStorage',
    configLanguageDetector.name
];

// Allow i18next to detect the system language reported by the Web browser
// itself.
interfaceConfig.LANG_DETECTION && order.push('navigator');

/**
 * The singleton language detector for Web.
 */
const languageDetector
    = new BrowserLanguageDetector(
        /* services */ null,
        /* options */ {
            caches: [ 'localStorage' ],
            lookupLocalStorage: 'language',
            lookupQuerystring: 'lang',
            order
        });

// Add the language detector which looks the language up in the config. Its
// order has already been established above.
languageDetector.addDetector(configLanguageDetector);

export default languageDetector;
