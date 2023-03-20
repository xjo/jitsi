// @flow

import React from 'react';
import { View } from 'react-native';

import { IconRaiseHand } from '../../../base/icons';
import { BaseIndicator } from '../../../base/react';
import { connect } from '../../../base/redux';
import AbstractRaisedHandIndicator, {
    type Props as AbstractProps,
    _mapStateToProps
} from '../AbstractRaisedHandIndicator';

import styles from './styles';


type Props = AbstractProps & {

    /**
     * Whether or not connection indicator are visible.
     */
    connectionIndicatorVisibility: boolean,

    /**
     * Whether or not tile view layout has been enabled as the user preference.
     */
    isTileViewEnabled: boolean
};

/**
 * Thumbnail badge showing that the participant would like to speak.
 *
 * @augments Component
 */
class RaisedHandIndicator extends AbstractRaisedHandIndicator<Props> {

    /**
     * Renders the platform specific indicator element.
     *
     * @returns {React$Element<*>}
     */
    _renderIndicator() {
        const { connectionIndicatorVisibility, isTileViewEnabled } = this.props;

        let raisedHandIndicatorStyles;

        if (connectionIndicatorVisibility) {
            if (isTileViewEnabled) {
                raisedHandIndicatorStyles = styles.raisedHandIndicatorTileView;
            } else {
                raisedHandIndicatorStyles = styles.raisedHandIndicator;
            }
        } else {
            raisedHandIndicatorStyles = styles.raisedHandIndicatorTileView;
        }

        return (
            <View style = { raisedHandIndicatorStyles }>
                <BaseIndicator
                    icon = { IconRaiseHand }
                    iconStyle = { styles.raisedHandIcon } />
            </View>
        );
    }
}

export default connect(_mapStateToProps)(RaisedHandIndicator);
