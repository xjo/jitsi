import { maybeRedirectToWelcomePage } from '../app/actions.web';
import { IStore } from '../app/types';

import {
    CANCEL_LOGIN,
    LOGIN,
    LOGOUT
} from './actionTypes';

export * from './actions.any';

/**
 * Cancels {@ink LoginDialog}.
 *
 * @returns {{
 *     type: CANCEL_LOGIN
 * }}
 */
export function cancelLogin() {
    return {
        type: CANCEL_LOGIN
    };
}

/**
 * Cancels authentication, closes {@link WaitForOwnerDialog}
 * and navigates back to the welcome page only in the case of authentication required error.
 * We can be showing the dialog while lobby is enabled and participant is still waiting there and hiding this dialog
 * should do nothing.
 *
 * @returns {Function}
 */
export function cancelWaitForOwner() {
    return (dispatch: IStore['dispatch'], getState: IStore['getState']) => {
        const { authRequired } = getState()['features/base/conference'];

        authRequired && dispatch(maybeRedirectToWelcomePage());
    };
}

/**
 * Redirect to the default location (e.g. Welcome page).
 *
 * @returns {Function}
 */
export function redirectToDefaultLocation() {
    return (dispatch: IStore['dispatch']) => dispatch(maybeRedirectToWelcomePage());
}

/**
 * Login.
 *
 * @returns {{
 *     type: LOGIN
 * }}
 */
export function login() {
    return {
        type: LOGIN
    };
}

/**
 * Logout.
 *
 * @returns {{
 *     type: LOGOUT
 * }}
 */
export function logout() {
    return {
        type: LOGOUT
    };
}

/**
 * Opens token auth URL page.
 *
 * @param {string} receivedTokenAuthServiceUrl - URL pointing to JWT token authentication service.
 * @param {string} tokenAuthServiceUrl - Authentication service URL.
 *
 * @returns {Function}
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function openTokenAuthUrl(receivedTokenAuthServiceUrl?: string | undefined, tokenAuthServiceUrl?: string): any {
    // Dummy.
}
