import { ReducerRegistry } from '../base/redux';

import { SET_SHARED_VIDEO_STATUS, SET_SHARED_VIDEO_OWNER } from './actionTypes';

/**
 * Reduces the Redux actions of the feature features/youtube-player.
 */
ReducerRegistry.register('features/youtube-player', (state = {}, action) => {
    switch (action.type) {
    case SET_SHARED_VIDEO_STATUS:
        return {
            ...state,
            status: action.status,
            time: action.time
        };
    case SET_SHARED_VIDEO_OWNER:
        return {
            ...state,
            ownerId: action.ownerId
        };
    default:
        return state;
    }
});
