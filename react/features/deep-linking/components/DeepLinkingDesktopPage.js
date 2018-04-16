/* @flow */

import Button, { ButtonGroup } from '@atlaskit/button';
import { AtlasKitThemeProvider } from '@atlaskit/theme';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import { createDeepLinkingPageEvent, sendAnalytics } from '../../analytics';
import { translate } from '../../base/i18n';

import {
    openWebApp,
    openDesktopApp
} from '../actions';
import { _TNS } from '../constants';

declare var interfaceConfig: Object;

/**
 * The type of the React {@code Component} props of
 * {@link DeepLinkingDesktopPage}.
 */
 type Props = {

    /**
     * Used to dispatch actions from the buttons.
     */
    dispatch: Dispatch<*>,

    /**
     * Used to obtain translations.
     */
    t: Function
};

/**
 * React component representing the deep linking page.
 *
 * @class DeepLinkingDesktopPage
 */
class DeepLinkingDesktopPage<P : Props> extends Component<P> {
    /**
     * Initializes a new {@code DeepLinkingDesktopPage} instance.
     *
     * @param {Object} props - The read-only React {@code Component} props with
     * which the new instance is to be initialized.
     */
    constructor(props: P) {
        super(props);

        // Bind event handlers so they are only bound once per instance.
        this._openDesktopApp = this._openDesktopApp.bind(this);
        this._onLaunchWeb = this._onLaunchWeb.bind(this);
        this._onTryAgain = this._onTryAgain.bind(this);
    }

    /**
     * Implements the Component's componentDidMount method.
     *
     * @inheritdoc
     */
    componentDidMount() {
        this._openDesktopApp();
        sendAnalytics(
            createDeepLinkingPageEvent(
                'displayed', 'DeepLinkingDesktop', { isMobileBrowser: false }));
    }

    /**
     * Renders the component.
     *
     * @returns {ReactElement}
     */
    render() {
        const { t } = this.props;
        const { NATIVE_APP_NAME, SHOW_DEEP_LINKING_IMAGE } = interfaceConfig;
        const rightColumnStyle
            = SHOW_DEEP_LINKING_IMAGE ? null : { width: '100%' };

        return (

            // Enabling light theme because of the color of the buttons.
            <AtlasKitThemeProvider mode = 'light'>
                <div className = 'deep-linking-desktop'>
                    <div className = 'header'>
                        <img
                            className = 'logo'
                            src = '../images/logo-deep-linking.png' />
                    </div>
                    <div className = 'content'>
                        {
                            SHOW_DEEP_LINKING_IMAGE
                                ? <div className = 'leftColumn'>
                                    <div className = 'leftColumnContent'>
                                        <div className = 'image' />
                                    </div>
                                </div> : null
                        }
                        <div
                            className = 'rightColumn'
                            style = { rightColumnStyle }>
                            <div className = 'rightColumnContent'>
                                <h1 className = 'title'>
                                    {
                                        t(`${_TNS}.title`,
                                        { app: NATIVE_APP_NAME })
                                    }
                                </h1>
                                <p className = 'description'>
                                    {
                                        t(`${_TNS}.description`,
                                            { app: NATIVE_APP_NAME })
                                    }
                                </p>
                                <div className = 'buttons'>
                                    <ButtonGroup>
                                        <Button
                                            appearance = 'default'
                                            onClick = { this._onTryAgain }>
                                            { t(`${_TNS}.tryAgainButton`) }
                                        </Button>
                                        <Button onClick = { this._onLaunchWeb }>
                                            { t(`${_TNS}.launchWebButton`) }
                                        </Button>
                                    </ButtonGroup>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </AtlasKitThemeProvider>
        );
    }

    _openDesktopApp: () => {}

    /**
     * Dispatches the <tt>openDesktopApp</tt> action.
     *
     * @returns {void}
     */
    _openDesktopApp() {
        this.props.dispatch(openDesktopApp());
    }

    _onTryAgain: () => {}

    /**
     * Handles try again button clicks.
     *
     * @returns {void}
     */
    _onTryAgain() {
        sendAnalytics(
            createDeepLinkingPageEvent(
                'clicked', 'tryAgainButton', { isMobileBrowser: false }));
        this._openDesktopApp();
    }

    _onLaunchWeb: () => {}

    /**
     * Handles launch web button clicks.
     *
     * @returns {void}
     */
    _onLaunchWeb() {
        sendAnalytics(
            createDeepLinkingPageEvent(
                'clicked', 'launchWebButton', { isMobileBrowser: false }));
        this.props.dispatch(openWebApp());
    }
}

export default translate(connect()(DeepLinkingDesktopPage));
