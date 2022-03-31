// @flow

import React from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text, TouchableRipple } from 'react-native-paper';

import { HEADER_BACK_NAV_BUTTON_ID } from '../../../../../tests/mobile/constants';
import { Icon } from '../../../base/icons';
import BaseTheme from '../../../base/ui/components/BaseTheme';
import styles from '../../../conference/components/native/styles';

type Props = {

    /**
     * Is the button disabled?
     */
    disabled?: boolean,

    /**
     * Label of the button.
     */
    label?: string,

    /**
     * Callback to invoke when the {@code HeaderNavigationButton} is clicked/pressed.
     */
    onPress?: Function,

    /**
     * The ImageSource to be rendered as image.
     */
    src?: Object,

    /**
     * Header has two actions.
     */
    twoActions?: boolean
}

const HeaderNavigationButton
    = ({
        disabled,
        label,
        onPress,
        src,
        twoActions
    }: Props) =>
        (
            <>
                {
                    src ? (
                        <TouchableOpacity
                            onPress = { onPress }
                            style = { styles.headerNavigationButton }
                            testID = { HEADER_BACK_NAV_BUTTON_ID }>
                            <Icon
                                size = { 20 }
                                src = { src }
                                style = { styles.headerNavigationIcon } />
                        </TouchableOpacity>
                    ) : (
                        <TouchableRipple
                            disabled = { disabled }
                            onPress = { onPress }
                            rippleColor = { BaseTheme.palette.screen01Header }
                            testID = { HEADER_BACK_NAV_BUTTON_ID }>
                            <Text
                                style = {
                                    twoActions
                                        ? styles.headerNavigationTextBold
                                        : styles.headerNavigationText
                                }>
                                { label }
                            </Text>
                        </TouchableRipple>
                    )}
            </>
        );


export default HeaderNavigationButton;
