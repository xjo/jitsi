// @flow

import { useEffect, useState } from 'react';
import { Keyboard } from 'react-native';

import { toState } from '../../redux';

export const useKeyboardHeight = () => {
    const [ keyboardHeight, setKeyboardHeight ] = useState(0);

    const onKeyboardDidShow = e => {
        setKeyboardHeight(e.endCoordinates.height);
    };

    const onKeyboardDidHide = () => {
        setKeyboardHeight(0);
    };

    useEffect(() => {
        const keyboardShow = Keyboard.addListener('keyboardDidShow', onKeyboardDidShow);
        const keyboardHide = Keyboard.addListener('keyboardDidHide', onKeyboardDidHide);

        return () => {
            keyboardShow.remove();
            keyboardHide.remove();
        };
    }, []);

    return keyboardHeight;
};

/**
 *
 * Returns the client width.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/config.
 * @returns {number}.
 */
export function getClientWidth(stateful: Object) {
    const state = toState(stateful)['features/base/responsive-ui'];

    return state.clientWidth;
}

/**
 *
 * Returns the client height.
 *
 * @param {(Function|Object)} stateful - The (whole) redux state, or redux's
 * {@code getState} function to be used to retrieve the state
 * features/base/config.
 * @returns {number}.
 */
export function getClientHeight(stateful: Object) {
    const state = toState(stateful)['features/base/responsive-ui'];

    return state.clientHeight;
}
