import React, { PureComponent } from 'react';
import { ViewStyle } from 'react-native';
import { Divider } from 'react-native-paper';
import { connect } from 'react-redux';

import { IReduxState, IStore } from '../../../app/types';
import { hideSheet } from '../../../base/dialog/actions';
import BottomSheet from '../../../base/dialog/components/native/BottomSheet';
import { bottomSheetStyles } from '../../../base/dialog/components/native/styles';
import SettingsButton from '../../../base/settings/components/native/SettingsButton';
import BreakoutRoomsButton
    from '../../../breakout-rooms/components/native/BreakoutRoomsButton';
import SharedDocumentButton from '../../../etherpad/components/SharedDocumentButton.native';
import ReactionMenu from '../../../reactions/components/native/ReactionMenu';
import { shouldDisplayReactionsButtons } from '../../../reactions/functions.any';
import LiveStreamButton from '../../../recording/components/LiveStream/native/LiveStreamButton';
import RecordButton from '../../../recording/components/Recording/native/RecordButton';
import SecurityDialogButton
    from '../../../security/components/security-dialog/native/SecurityDialogButton';
import SharedVideoButton from '../../../shared-video/components/native/SharedVideoButton';
import SpeakerStatsButton from '../../../speaker-stats/components/native/SpeakerStatsButton';
import { isSpeakerStatsDisabled } from '../../../speaker-stats/functions';
import ClosedCaptionButton from '../../../subtitles/components/native/ClosedCaptionButton';
import TileViewButton from '../../../video-layout/components/TileViewButton';
import styles from '../../../video-menu/components/native/styles';
import WhiteboardButton from '../../../whiteboard/components/native/WhiteboardButton';
import { getMovableButtons } from '../../functions.native';

import AudioOnlyButton from './AudioOnlyButton';
import LinkToSalesforceButton from './LinkToSalesforceButton';
import OpenCarmodeButton from './OpenCarmodeButton';
import RaiseHandButton from './RaiseHandButton';
import ScreenSharingButton from './ScreenSharingButton';
import {
    IconCar,
    IconGear,
    IconPlay
} from '../../../base/icons/svg';
import { NOTIFY_CLICK_MODE } from '../../types';
import CustomOptionButton from './CustomOptionButton';


/**
 * The type of the React {@code Component} props of {@link OverflowMenu}.
 */
interface IProps {

    /**
     * Toolbar buttons which have their click exposed through the API.
     */
    _buttonsWithNotifyClick: Map<string, NOTIFY_CLICK_MODE>;

    /**
     * Custom Toolbar buttons.
     */
    _customToolbarButtons?: Array<{ backgroundColor?: string; icon: string; id: string; text: string; }>;

    /**
     * True if breakout rooms feature is available, false otherwise.
     */
    _isBreakoutRoomsSupported?: boolean;

    /**
     * True if the overflow menu is currently visible, false otherwise.
     */
    _isOpen: boolean;

    /**
     * Whether or not speaker stats is disable.
     */
    _isSpeakerStatsDisabled?: boolean;

    /**
     * Whether the recoding button should be enabled or not.
    */
   _recordingEnabled: boolean;

   /**
    * Whether or not any reactions buttons should be displayed.
    */
   _shouldDisplayReactionsButtons: boolean;

    /**
     * The width of the screen.
     */
    _width: number;

    /**
     * Used for hiding the dialog when the selection was completed.
     */
    dispatch: IStore['dispatch'];
}

interface IState {

    /**
     * True if the bottom sheet is scrolled to the top.
     */
    scrolledToTop: boolean;
}

/**
 * Implements a React {@code Component} with some extra actions in addition to
 * those in the toolbar.
 */
class OverflowMenu extends PureComponent<IProps, IState> {
    /**
     * Initializes a new {@code OverflowMenu} instance.
     *
     * @inheritdoc
     */
    constructor(props: IProps) {
        super(props);

        this.state = {
            scrolledToTop: true
        };

        // Bind event handlers so they are only bound once per instance.
        this._onCancel = this._onCancel.bind(this);
        this._renderReactionMenu = this._renderReactionMenu.bind(this);
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const {
            _buttonsWithNotifyClick,
            _isBreakoutRoomsSupported,
            _isSpeakerStatsDisabled,
            _shouldDisplayReactionsButtons,
            _width,
            dispatch
        } = this.props;
        const toolbarButtons = getMovableButtons(_width);

        const buttonProps = {
            afterClick: this._onCancel,
            showLabel: true,
            styles: bottomSheetStyles.buttons
        };

        const topButtonProps = {
            afterClick: this._onCancel,
            dispatch,
            showLabel: true,
            styles: {
                ...bottomSheetStyles.buttons,
                style: {
                    ...bottomSheetStyles.buttons.style,
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16
                }
            }
        };

        const buttons = [{
            key: 'sharedvideo',
            icon: IconPlay,
            text: 'toolbar.sharedvideo'
        }, {
            key: 'carmode',
            icon: IconCar,
            text: 'carmode.labels.buttonLabel'
        }, {
            key: 'settings',
            icon: IconGear,
            text: 'settings.buttonLabel'
        }]

        return (
            <BottomSheet
                renderFooter = { _shouldDisplayReactionsButtons && !toolbarButtons.has('raisehand')
                    ? this._renderReactionMenu
                    : undefined }>
                <OpenCarmodeButton { ...topButtonProps } />
                <AudioOnlyButton { ...buttonProps } />
                {
                    !_shouldDisplayReactionsButtons && !toolbarButtons.has('raisehand')
                        && <RaiseHandButton { ...buttonProps } />
                }
                {/* @ts-ignore */}
                <Divider style = { styles.divider as ViewStyle } />
                <SecurityDialogButton { ...buttonProps } />
                <RecordButton { ...buttonProps } />
                <LiveStreamButton { ...buttonProps } />
                <LinkToSalesforceButton { ...buttonProps } />
                <WhiteboardButton { ...buttonProps } />
                {/* @ts-ignore */}
                <Divider style = { styles.divider as ViewStyle } />
                <SharedVideoButton { ...buttonProps } />
                {!toolbarButtons.has('screensharing') && <ScreenSharingButton { ...buttonProps } />}
                {!_isSpeakerStatsDisabled && <SpeakerStatsButton { ...buttonProps } />}
                {!toolbarButtons.has('tileview') && <TileViewButton { ...buttonProps } />}
                {_isBreakoutRoomsSupported && <BreakoutRoomsButton { ...buttonProps } />}
                {/* @ts-ignore */}
                <Divider style = { styles.divider as ViewStyle } />
                <ClosedCaptionButton { ...buttonProps } />
                <SharedDocumentButton { ...buttonProps } />
                <SettingsButton { ...buttonProps } />
                <Divider style = { styles.divider as ViewStyle } />
                {
                    buttons.map(({ key,...rest }) => (
                        <CustomOptionButton
                            { ...rest }
                            { ...buttonProps }
                            key = { key }
                            notifyClick = { _buttonsWithNotifyClick?.get(key) } />
                    ))
                }
            </BottomSheet>
        );
    }

    /**
     * Hides this {@code OverflowMenu}.
     *
     * @private
     * @returns {void}
     */
    _onCancel() {
        this.props.dispatch(hideSheet());
    }

    /**
     * Function to render the reaction menu as the footer of the bottom sheet.
     *
     * @returns {React$Element}
     */
    _renderReactionMenu() {
        return (
            <ReactionMenu
                onCancel = { this._onCancel }
                overflowMenu = { true } />
        );
    }
}

/**
 * Function that maps parts of Redux state tree into component props.
 *
 * @param {Object} state - Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state: IReduxState) {
    const { conference } = state['features/base/conference'];
    const { customToolbarButtons } = state['features/base/config'];

    return {
        _buttonsWithNotifyClick: state['features/toolbox'].buttonsWithNotifyClick,
        _customToolbarButtons: customToolbarButtons,
        _isBreakoutRoomsSupported: conference?.getBreakoutRooms()?.isSupported(),
        _isSpeakerStatsDisabled: isSpeakerStatsDisabled(state),
        _shouldDisplayReactionsButtons: shouldDisplayReactionsButtons(state),
        _width: state['features/base/responsive-ui'].clientWidth
    };
}

export default connect(_mapStateToProps)(OverflowMenu);
