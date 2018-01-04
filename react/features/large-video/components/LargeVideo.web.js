/* @flow */

import PropTypes from 'prop-types';
import React, { Component } from 'react';

import { RTCBrowserType } from '../../base/lib-jitsi-meet';
import { Watermarks } from '../../base/react';
import { VideoQualityLabel } from '../../video-quality';
import { RecordingLabel } from '../../recording';

declare var interfaceConfig: Object;

/**
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * the conference participant who is on the local stage) on Web/React.
 *
 * @extends Component
 */
export default class LargeVideo extends Component<*> {
    static propTypes = {
        /**
         * True if the {@code VideoQualityLabel} should not be displayed.
         */
        hideVideoQualityLabel: PropTypes.bool
    };

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {ReactElement}
     */
    render() {
        const supportsVideoBackground = !RTCBrowserType.isFirefox()
            && !RTCBrowserType.isTemasysPluginUsed();

        return (
            <div
                className = 'videocontainer'
                id = 'largeVideoContainer'>
                <div id = 'sharedVideo'>
                    <div id = 'sharedVideoIFrame' />
                </div>
                <div id = 'etherpad' />

                <Watermarks />

                <div id = 'dominantSpeaker'>
                    <div className = 'dynamic-shadow' />
                    <img
                        id = 'dominantSpeakerAvatar'
                        src = '' />
                </div>
                <div id = 'remotePresenceMessage' />
                <span id = 'remoteConnectionMessage' />
                <div>
                    {

                        /**
                         * FIXME: The LargeVideo component should be in charge
                         * of how the large video background is rendered.
                         * However, in order to coordinate video transition
                         * timing between large video and the background video,
                         * the logic for updating the background video is left
                         * in the non-react large video component.
                         */
                    }
                    {
                        supportsVideoBackground
                            ? <div id = 'largeVideoBackgroundContainer' />
                            : null
                    }
                    {

                        /**
                         * FIXME: the architecture of elements related to the
                         * large video and  the naming. The background is not
                         * part of largeVideoWrapper because we are controlling
                         * the size of the video through largeVideoWrapper.
                         * That's why we need another container for the the
                         * background and the largeVideoWrapper in order to
                         * hide/show them.
                         */
                    }
                    <div id = 'largeVideoWrapper'>
                        <video
                            autoPlay = { true }
                            id = 'largeVideo'
                            muted = { true } />
                    </div>
                </div>
                <span id = 'localConnectionMessage' />
                { this.props.hideVideoQualityLabel
                    ? null : <VideoQualityLabel /> }
                <RecordingLabel />
            </div>
        );
    }
}
