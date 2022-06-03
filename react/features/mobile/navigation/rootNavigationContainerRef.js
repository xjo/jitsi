// @flow

import React from 'react';

import { toState } from '../../base/redux';

import { isWelcomePageAppEnabled } from './components/welcome/functions';
import { _sendReadyToClose } from './constants';
import { screen } from './routes';

// $FlowExpectedError
export const rootNavigationRef = React.createRef();

/**
 * User defined navigation action included inside the reference to the container.
 *
 * @param {string} name - Destination name of the route that has been defined somewhere.
 * @param {Object} params - Params to pass to the destination route.
 * @returns {Function}
 */
export function navigateRoot(name: string, params: Object) {
    // $FlowExpectedError
    return rootNavigationRef.current?.navigate(name, params);
}

/**
 * Navigates back to Welcome page, if it's available.
 *
 * @param {Object|Function} stateful - Either the whole Redux state object or the Redux store's {@code getState} method.
 * @param {Function} dispatch - Redux dispatch function.
 * @returns {void}
 */
export function goBackToRoot(stateful: Function | Object, dispatch: Function) {
    const state = toState(stateful);

    if (isWelcomePageAppEnabled(state)) {
        navigateRoot(screen.root);
    } else {
        // For JitsiSDK, WelcomePage is not available
        _sendReadyToClose(dispatch);
    }
}
