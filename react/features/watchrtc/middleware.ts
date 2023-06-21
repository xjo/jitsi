import { AnyAction } from 'redux';

import { IStore } from '../app/types';
import { LIB_WILL_INIT } from '../base/lib-jitsi-meet/actionTypes';
import MiddlewareRegistry from '../base/redux/MiddlewareRegistry';

import watchRTCHandler from './watchRTCHandler';
import { isWatchRTCEnabled } from './functions';
import logger from './logger';

/**
 * Middleware which intercepts lib-jitsi-meet initialization and conference join in order init the
 * watchRTC.
 *
 * @param {Store} store - The redux store.
 * @returns {Function}
 */
MiddlewareRegistry.register((store: IStore) => (next: Function) => (action: AnyAction) => {
    const { getState } = store;
    const state = getState();
    const config = state['features/base/config'];
    const { watchRTCConfigParams } = config;

    switch (action.type) {
    case LIB_WILL_INIT: {
        if (isWatchRTCEnabled(state)) {
            // watchRTC "proxies" WebRTC functions such as GUM and RTCPeerConnection by rewriting the global
            // window functions. Because lib-jitsi-meet uses references to those functions that are taken on
            // init, we need to add these proxies before it initializes, otherwise lib-jitsi-meet will use the
            // original non proxy versions of these functions.
            try {
                if (watchRTCConfigParams) {
                    watchRTCHandler.init(watchRTCConfigParams);
                } else {
                    logger.error("WatchRTC enabled but no configuration");
                }
            } catch (error) {
                logger.error("Failed to initialize WatchRTC: ", error);
            }
        }
        break;
    }
    }

    return next(action);
});
