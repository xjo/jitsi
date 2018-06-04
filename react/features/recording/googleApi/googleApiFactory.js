// @flow

import { hasElectronIntegration } from './functions';
import googleElectronClient from './googleElectronClient';
import googleWebClient from './googleWebClient';

declare var JitsiMeetElectron: Object;

export default {
    /**
     * Obtains the Google client for the current platform.
     *
     * @returns {Object} The client to use for interacting with the Google API.
     */
    getClient() {
        if (hasElectronIntegration()) {
            return googleElectronClient;
        }

        return googleWebClient;
    }
};
