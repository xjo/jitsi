import React, { Component } from "react";
import { connect } from "react-redux";

// @ts-expect-error
import VideoLayout from "../../../../modules/UI/videolayout/VideoLayout";
import { IReduxState } from "../../app/types";
import { VIDEO_TYPE } from "../../base/media/constants";
import { getLocalParticipant } from "../../base/participants/functions";
// import Watermarks from "../../base/react/components/web/Watermarks";
import { getHideSelfView } from "../../base/settings/functions.any";
import { getVideoTrackByParticipant } from "../../base/tracks/functions.web";
import { setColorAlpha } from "../../base/util/helpers";
import StageParticipantNameLabel from "../../display-name/components/web/StageParticipantNameLabel";
import { FILMSTRIP_BREAKPOINT } from "../../filmstrip/constants";
import {
    getVerticalViewMaxWidth,
    isFilmstripResizable,
} from "../../filmstrip/functions.web";
import SharedVideo from "../../shared-video/components/web/SharedVideo";
import Captions from "../../subtitles/components/web/Captions";
import { setTileView } from "../../video-layout/actions.web";
import Whiteboard from "../../whiteboard/components/web/Whiteboard";
import { isWhiteboardEnabled } from "../../whiteboard/functions";
import { setSeeWhatIsBeingShared } from "../actions.web";
import { getLargeVideoParticipant } from "../functions";
import ScreenSharePlaceholder from "./ScreenSharePlaceholder.web";

import { IParticipant } from "../../base/participants/types";
import StaticImageWrapper from "./StaticImageWrapper.web";
import RenderSpeakerNodes from "./RenderSpeakerNodes.web";
import VideoTrack from "../../base/media/components/web/VideoTrack";
import { getCurrentLayout } from "../../video-layout/functions.web";
import { LAYOUTS } from "../../video-layout/constants";
import {
    isScreenShareParticipantById,
    getParticipantByIdOrUndefined,
} from "../../../features/base/participants/functions";
import {
    isLocalTrackMuted,
    isRemoteTrackMuted,
} from "../../base/tracks/functions.web";
import { MEDIA_TYPE } from "../../base/media/constants";
import { isVideoPlayable } from "../../filmstrip/functions.web";
import { addStageParticipant } from "../../filmstrip/actions.web";

// Hack to detect Spot.
const SPOT_DISPLAY_NAME = "Meeting Room";

interface IProps {
    /**
     * The alpha(opacity) of the background.
     */
    _backgroundAlpha?: number;

    /**
     * The user selected background color.
     */
    _customBackgroundColor: string;

    /**
     * The user selected background image url.
     */
    _customBackgroundImageUrl: string;

    /**
     * Whether the screen-sharing placeholder should be displayed or not.
     */
    _displayScreenSharingPlaceholder: boolean;

    /**
     * Whether or not the hideSelfView is enabled.
     */
    _hideSelfView: boolean;

    /**
     * Prop that indicates whether the chat is open.
     */
    _isChatOpen: boolean;

    /**
     * Whether or not the local screen share is on large-video.
     */
    _isScreenSharing: boolean;

    /**
     * The large video participant id.
     */
    _largeVideoParticipantId: string;

    /**
     * Local Participant id.
     */
    _localParticipantId: string;

    /**
     * Used to determine the value of the autoplay attribute of the underlying
     * video element.
     */
    _noAutoPlayVideo: boolean;

    /**
     * Whether or not the filmstrip is resizable.
     */
    _resizableFilmstrip: boolean;

    /**
     * Whether or not the screen sharing is visible.
     */
    _seeWhatIsBeingShared: boolean;

    /**
     * Whether or not to show dominant speaker badge.
     */
    _showDominantSpeakerBadge: boolean;

    /**
     * The width of the vertical filmstrip (user resized).
     */
    _verticalFilmstripWidth?: number | null;

    /**
     * The max width of the vertical filmstrip.
     */
    _verticalViewMaxWidth: number;

    /**
     * Whether or not the filmstrip is visible.
     */
    _visibleFilmstrip: boolean;

    /**
     * Whether or not the whiteboard is enabled.
     */
    _whiteboardEnabled: boolean;

    /**
     * The Redux dispatch function.
     */
    dispatch: Function;

    _participantsList: Array<any>;
    _isTileLayout: boolean;
    _userTileViewEnable: boolean;
    _isAnyoneSharingScreenInRemote: boolean;
}

/** .
 * Implements a React {@link Component} which represents the large video (a.k.a.
 * The conference participant who is on the local stage) on Web/React.
 *
 * @augments Component
 */
class LargeVideo extends Component<IProps> {
    _tappedTimeout: number | undefined;

    _containerRef: React.RefObject<HTMLDivElement>;

    _wrapperRef: React.RefObject<HTMLDivElement>;

    /**
     * Constructor of the component.
     *
     * @inheritdoc
     */
    constructor(props: IProps) {
        super(props);

        this._containerRef = React.createRef<HTMLDivElement>();
        this._wrapperRef = React.createRef<HTMLDivElement>();

        this._clearTapTimeout = this._clearTapTimeout.bind(this);
        this._onDoubleTap = this._onDoubleTap.bind(this);
        this._updateLayout = this._updateLayout.bind(this);
    }

    /**
     * Implements {@code Component#componentDidUpdate}.
     *
     * @inheritdoc
     */
    componentDidUpdate(prevProps: IProps) {
        const {
            _isTileLayout,
            _userTileViewEnable,
            dispatch,
            _visibleFilmstrip,
            _isScreenSharing,
            _seeWhatIsBeingShared,
            _largeVideoParticipantId,
            _hideSelfView,
            _localParticipantId,
            _participantsList,
        } = this.props;

        if (_participantsList.length > 0) {
            if (!_userTileViewEnable && _isTileLayout) {
                dispatch(setTileView(false));
            }
        }

        if (prevProps._visibleFilmstrip !== _visibleFilmstrip) {
            this._updateLayout();
        }

        if (
            prevProps._isScreenSharing !== _isScreenSharing &&
            !_isScreenSharing
        ) {
            this.props.dispatch(setSeeWhatIsBeingShared(false));
        }

        if (_isScreenSharing && _seeWhatIsBeingShared) {
            VideoLayout.updateLargeVideo(_largeVideoParticipantId, true, true);
        }

        if (
            _largeVideoParticipantId === _localParticipantId &&
            prevProps._hideSelfView !== _hideSelfView
        ) {
            VideoLayout.updateLargeVideo(_largeVideoParticipantId, true, false);
        }
    }

    /**
     * Implements React's {@link Component#render()}.
     *
     * @inheritdoc
     * @returns {React$Element}
     */
    render() {
        const {
            _isAnyoneSharingScreenInRemote,
            _displayScreenSharingPlaceholder,
            _isChatOpen,
            _noAutoPlayVideo,
            _showDominantSpeakerBadge,
            _whiteboardEnabled,
            _participantsList,
            _isTileLayout,
        } = this.props;
        const style = this._getCustomStyles();
        const className = `videocontainer${_isChatOpen ? " shift-right" : ""}`;

        return (
            <div
                className={className}
                id="largeVideoContainer"
                ref={this._containerRef}
                style={style}
            >
                {!_isTileLayout && (
                    <>
                        <StaticImageWrapper />
                        <RenderSpeakerNodes list={_participantsList} />
                    </>
                )}

                <SharedVideo />
                {_whiteboardEnabled && <Whiteboard />}
                <div id="etherpad" />

                {/* <Watermarks /> */}

                <div id="dominantSpeaker" onTouchEnd={this._onDoubleTap}>
                    <div className="dynamic-shadow" />
                    <div id="dominantSpeakerAvatarContainer" />
                </div>
                <div id="remotePresenceMessage" />
                <span id="remoteConnectionMessage" />
                <div id="largeVideoElementsContainer" style={{ visibility: _isAnyoneSharingScreenInRemote ? 'visible' : 'hidden' }}>
                    <div id="largeVideoBackgroundContainer" />
                    {/*
                     * FIXME: the architecture of elements related to the large
                     * video and the naming. The background is not part of
                     * largeVideoWrapper because we are controlling the size of
                     * the video through largeVideoWrapper. That's why we need
                     * another container for the background and the
                     * largeVideoWrapper in order to hide/show them.
                     */}
                    <div
                        id="largeVideoWrapper"
                        onTouchEnd={this._onDoubleTap}
                        ref={this._wrapperRef}
                        role="figure"
                    >
                        {_displayScreenSharingPlaceholder ? (
                            <ScreenSharePlaceholder />
                        ) : (
                            <video
                                autoPlay={!_noAutoPlayVideo}
                                id="largeVideo"
                                muted={true}
                                playsInline={
                                    true
                                } /* for Safari on iOS to work */
                            />
                        )}
                    </div>
                </div>
                {interfaceConfig.DISABLE_TRANSCRIPTION_SUBTITLES || (
                    <Captions />
                )}
                {_showDominantSpeakerBadge && <StageParticipantNameLabel />}
            </div>
        );
    }

    /**
     * Refreshes the video layout to determine the dimensions of the stage view.
     * If the filmstrip is toggled it adds CSS transition classes and removes them
     * when the transition is done.
     *
     * @returns {void}
     */
    _updateLayout() {
        const { _verticalFilmstripWidth, _resizableFilmstrip } = this.props;

        if (
            _resizableFilmstrip &&
            Number(_verticalFilmstripWidth) >= FILMSTRIP_BREAKPOINT
        ) {
            this._containerRef.current?.classList.add("transition");
            this._wrapperRef.current?.classList.add("transition");
            VideoLayout.refreshLayout();

            setTimeout(() => {
                this._containerRef?.current &&
                    this._containerRef.current.classList.remove("transition");
                this._wrapperRef?.current &&
                    this._wrapperRef.current.classList.remove("transition");
            }, 1000);
        } else {
            VideoLayout.refreshLayout();
        }
    }

    /**
     * Clears the '_tappedTimout'.
     *
     * @private
     * @returns {void}
     */
    _clearTapTimeout() {
        clearTimeout(this._tappedTimeout);
        this._tappedTimeout = undefined;
    }

    /**
     * Creates the custom styles object.
     *
     * @private
     * @returns {Object}
     */
    _getCustomStyles() {
        const styles: any = {};
        const {
            _customBackgroundColor,
            _customBackgroundImageUrl,
            _verticalFilmstripWidth,
            _verticalViewMaxWidth,
            _visibleFilmstrip,
        } = this.props;

        // styles.backgroundImage = "url('images/custom-background/bg1.png')";
        // styles.backgroundSize = 'contain'
        // styles.backgroundRepeat = 'no-repeat'
        // styles.backgroundPosition = 'center'
        // styles.backgroundColor = _customBackgroundColor || interfaceConfig.DEFAULT_BACKGROUND;

        if (this.props._backgroundAlpha !== undefined) {
            const alphaColor = setColorAlpha(
                styles.backgroundColor,
                this.props._backgroundAlpha
            );

            styles.backgroundColor = alphaColor;
        }

        if (_customBackgroundImageUrl) {
            styles.backgroundImage = `url(${_customBackgroundImageUrl})`;
            styles.backgroundSize = "cover";
        }

        if (
            _visibleFilmstrip &&
            Number(_verticalFilmstripWidth) >= FILMSTRIP_BREAKPOINT
        ) {
            styles.width = `calc(100% - ${_verticalViewMaxWidth || 0}px)`;
        }

        return styles;
    }

    /**
     * Sets view to tile view on double tap.
     *
     * @param {Object} e - The event.
     * @private
     * @returns {void}
     */
    _onDoubleTap(e: React.TouchEvent) {
        e.stopPropagation();
        e.preventDefault();

        if (this._tappedTimeout) {
            this._clearTapTimeout();
            this.props.dispatch(setTileView(true));
        } else {
            this._tappedTimeout = window.setTimeout(this._clearTapTimeout, 300);
        }
    }
}

/**
 * Maps (parts of) the Redux state to the associated LargeVideo props.
 *
 * @param {Object} state - The Redux state.
 * @private
 * @returns {IProps}
 */
function _mapStateToProps(state: IReduxState) {
    const testingConfig = state["features/base/config"].testing;
    const { backgroundColor, backgroundImageUrl } =
        state["features/dynamic-branding"];
    const { isOpen: isChatOpen } = state["features/chat"];
    const { width: verticalFilmstripWidth, visible } =
        state["features/filmstrip"];
    const { defaultLocalDisplayName, hideDominantSpeakerBadge } =
        state["features/base/config"];
    const { seeWhatIsBeingShared } = state["features/large-video"];
    const localParticipantId = getLocalParticipant(state)?.id;
    const largeVideoParticipant = getLargeVideoParticipant(state);
    const videoTrack = getVideoTrackByParticipant(state, largeVideoParticipant);
    const isLocalScreenshareOnLargeVideo =
        largeVideoParticipant?.id?.includes(localParticipantId ?? "") &&
        videoTrack?.videoType === VIDEO_TYPE.DESKTOP;
    const isOnSpot = defaultLocalDisplayName === SPOT_DISPLAY_NAME;

    const _userTileViewEnable =
        state["features/video-layout"].tileViewOwnEnabled;
    const tracks = state["features/base/tracks"];

    const getVideoTrackForEachParticipants = (item: IParticipant) => {
        const local = item.local;
        const videoTrack = getVideoTrackByParticipant(state, item);
        return videoTrack ? (
            <VideoTrack
                style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                }}
                muted={local ? undefined : true}
                videoTrack={videoTrack}
            />
        ) : null;
    };

    const getMuteScreenShareStatus = (participantID: string) => {
        let isAudioMuted = true;
        let isScreenSharing = false;
        const participant = getParticipantByIdOrUndefined(state, participantID);
        if (participant?.local) {
            isAudioMuted = isLocalTrackMuted(tracks, MEDIA_TYPE.AUDIO);
        } else if (
            !participant?.fakeParticipant ||
            isScreenShareParticipantById(state, participantID)
        ) {
            // remote participants excluding shared video
            const track = getVideoTrackByParticipant(state, participant);

            isScreenSharing = track?.videoType === "desktop";
            isAudioMuted = isRemoteTrackMuted(
                tracks,
                MEDIA_TYPE.AUDIO,
                participantID
            );
        }
        return { isAudioMuted, isScreenSharing };
    };

    const getAllParticipants = (state: any) => {
        let participants = state["features/base/participants"];
        let listRemote: Array<any> = [];
        for (let [key, value] of participants?.remote) {
            listRemote.push(value);
        }
        listRemote.push(participants.local);

        listRemote.map((item: IParticipant) => {
            let { isAudioMuted, isScreenSharing } = getMuteScreenShareStatus(
                item.id
            );

            // @ts-ignore
            item.isVideoPlayable = isVideoPlayable(state, item.id);
            // @ts-ignore
            item.isAudioMuted = isAudioMuted;
            // @ts-ignore
            item.isScreenSharing = isScreenSharing;
            // @ts-ignore
            item.video = getVideoTrackForEachParticipants(item);
            return item;
        });

        return listRemote;
    };
    
    const participantsList: Array<IParticipant> = getAllParticipants(state);
    const isTileView = getCurrentLayout(state) === LAYOUTS.TILE_VIEW;
    const _isAnyoneSharingScreenInRemote = participantsList.filter((item: IParticipant) => item.id !== localParticipantId
    ).filter((item: any) => item.isScreenSharing === true).length > 0;

    return {
        _userTileViewEnable,
        _isTileLayout: isTileView,
        _isAnyoneSharingScreenInRemote,
        _participantsList: participantsList,
        _backgroundAlpha: state["features/base/config"].backgroundAlpha,
        _customBackgroundColor: backgroundColor,
        _customBackgroundImageUrl: backgroundImageUrl,
        _displayScreenSharingPlaceholder: Boolean(
            isLocalScreenshareOnLargeVideo && !seeWhatIsBeingShared && !isOnSpot
        ),
        _hideSelfView: getHideSelfView(state),
        _isChatOpen: isChatOpen,
        _isScreenSharing: Boolean(isLocalScreenshareOnLargeVideo),
        _largeVideoParticipantId: largeVideoParticipant?.id ?? "",
        _localParticipantId: localParticipantId ?? "",
        _noAutoPlayVideo: Boolean(testingConfig?.noAutoPlayVideo),
        _resizableFilmstrip: isFilmstripResizable(state),
        _seeWhatIsBeingShared: Boolean(seeWhatIsBeingShared),
        _showDominantSpeakerBadge: !hideDominantSpeakerBadge,
        _verticalFilmstripWidth: verticalFilmstripWidth.current,
        _verticalViewMaxWidth: getVerticalViewMaxWidth(state),
        _visibleFilmstrip: visible,
        _whiteboardEnabled: isWhiteboardEnabled(state),
    };
}

export default connect(_mapStateToProps)(LargeVideo);
