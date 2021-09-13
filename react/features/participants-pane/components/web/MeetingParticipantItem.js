// @flow

import React, { useEffect, useMemo, useState } from 'react';

import { JitsiTrackEvents } from '../../../base/lib-jitsi-meet';
import { MEDIA_TYPE } from '../../../base/media';
import {
    getLocalParticipant,
    getParticipantByIdOrUndefined,
    getParticipantDisplayName,
    isParticipantModerator
} from '../../../base/participants';
import { connect } from '../../../base/redux';
import {
    getLocalAudioTrack,
    getTrackByMediaTypeAndParticipant,
    isParticipantAudioMuted,
    isParticipantVideoMuted
} from '../../../base/tracks';
import { ACTION_TRIGGER, type MediaState, MEDIA_STATE } from '../../constants';
import {
    getParticipantAudioMediaState,
    getParticipantVideoMediaState,
    getQuickActionButtonType
} from '../../functions';
import ParticipantQuickAction from '../ParticipantQuickAction';

import ParticipantItem from './ParticipantItem';
import { ParticipantActionEllipsis } from './styled';

type Props = {

    /**
     * Media state for audio.
     */
    _audioMediaState: MediaState,

    /**
     * The audio track related to the participant.
     */
    _audioTrack: ?Object,

    /**
     * Media state for video.
     */
    _videoMediaState: MediaState,


    /**
     * The display name of the participant.
     */
    _displayName: string,

    /**
     * True if the participant is the local participant.
     */
    _local: Boolean,

    /**
     * Shared video local participant owner.
     */
    _localVideoOwner: boolean,

    /**
     * The participant.
     */
    _participant: Object,

    /**
     * The participant ID.
     *
     * NOTE: This ID may be different from participantID prop in the case when we pass undefined for the local
     * participant. In this case the local participant ID will be filled trough _participantID prop.
     */
    _participantID: string,

    /**
     * The type of button to be rendered for the quick action.
     */
    _quickActionButtonType: string,

    /**
     * True if the participant have raised hand.
     */
    _raisedHand: boolean,

    /**
     * The translated ask unmute text for the qiuck action buttons.
     */
    askUnmuteText: string,

    /**
     * Is this item highlighted
     */
    isHighlighted: boolean,

    /**
     * Callback used to open a confirmation dialog for audio muting.
     */
    muteAudio: Function,

    /**
     * The translated text for the mute participant button.
     */
    muteParticipantButtonText: string,

    /**
     * Callback for the activation of this item's context menu
     */
    onContextMenu: Function,

    /**
     * Callback for the mouse leaving this item
     */
    onLeave: Function,

    /**
     * Callback used to open an actions drawer for a participant.
     */
    openDrawerForParticipant: Function,

    /**
     * True if an overflow drawer should be displayed.
     */
    overflowDrawer: boolean,


    /**
     * The aria-label for the ellipsis action.
     */
    participantActionEllipsisLabel: string,

    /**
     * The ID of the participant.
     */
    participantID: ?string,

    /**
     * The translated "you" text.
     */
    youText: string
};

/**
 * Implements the MeetingParticipantItem component.
 *
 * @param {Props} props - The props of the component.
 * @returns {ReactElement}
 */
function MeetingParticipantItem({
    _audioMediaState,
    _audioTrack,
    _videoMediaState,
    _displayName,
    _local,
    _localVideoOwner,
    _participant,
    _participantID,
    _quickActionButtonType,
    _raisedHand,
    askUnmuteText,
    isHighlighted,
    muteAudio,
    muteParticipantButtonText,
    onContextMenu,
    onLeave,
    openDrawerForParticipant,
    overflowDrawer,
    participantActionEllipsisLabel,
    youText
}: Props) {

    const [ hasAudioLevels, setHasAudioLevel ] = useState(false);
    const [ registeredEvent, setRegisteredEvent ] = useState(false);

    const _updateAudioLevel = level => {
        const audioLevel = typeof level === 'number' && !isNaN(level)
            ? level : 0;

        setHasAudioLevel(audioLevel > 0.009);
    };

    useEffect(() => {
        if (_audioTrack && !registeredEvent) {
            const { jitsiTrack } = _audioTrack;

            jitsiTrack && jitsiTrack.on(JitsiTrackEvents.TRACK_AUDIO_LEVEL_CHANGED, _updateAudioLevel);
            setRegisteredEvent(true);
        }
    }, [ _audioTrack ]);

    const _getAudioMediaState = useMemo(() => {
        if (_audioMediaState === MEDIA_STATE.UNMUTED && hasAudioLevels) {
            return MEDIA_STATE.DOMINANT_SPEAKER;
        }

        return _audioMediaState;
    }, [ hasAudioLevels, _audioMediaState ]);

    return (
        <ParticipantItem
            actionsTrigger = { ACTION_TRIGGER.HOVER }
            audioMediaState = { _getAudioMediaState }
            displayName = { _displayName }
            isHighlighted = { isHighlighted }
            isModerator = { isParticipantModerator(_participant) }
            local = { _local }
            onLeave = { onLeave }
            openDrawerForParticipant = { openDrawerForParticipant }
            overflowDrawer = { overflowDrawer }
            participantID = { _participantID }
            raisedHand = { _raisedHand }
            videoMediaState = { _videoMediaState }
            youText = { youText }>

            {!overflowDrawer && !_participant?.isFakeParticipant
                && <>
                    <ParticipantQuickAction
                        askUnmuteText = { askUnmuteText }
                        buttonType = { _quickActionButtonType }
                        muteAudio = { muteAudio }
                        muteParticipantButtonText = { muteParticipantButtonText }
                        participantID = { _participantID } />
                    <ParticipantActionEllipsis
                        aria-label = { participantActionEllipsisLabel }
                        onClick = { onContextMenu } />
                 </>
            }

            {!overflowDrawer && _localVideoOwner && _participant?.isFakeParticipant && (
                <ParticipantActionEllipsis
                    aria-label = { participantActionEllipsisLabel }
                    onClick = { onContextMenu } />
            )}
        </ParticipantItem>
    );
}

/**
 * Maps (parts of) the redux state to the associated props for this component.
 *
 * @param {Object} state - The Redux state.
 * @param {Object} ownProps - The own props of the component.
 * @private
 * @returns {Props}
 */
function _mapStateToProps(state, ownProps): Object {
    const { participantID } = ownProps;
    const { ownerId } = state['features/shared-video'];
    const localParticipantId = getLocalParticipant(state).id;

    const participant = getParticipantByIdOrUndefined(state, participantID);

    const _isAudioMuted = isParticipantAudioMuted(participant, state);
    const _isVideoMuted = isParticipantVideoMuted(participant, state);
    const _audioMediaState = getParticipantAudioMediaState(participant, _isAudioMuted, state);
    const _videoMediaState = getParticipantVideoMediaState(participant, _isVideoMuted, state);
    const _quickActionButtonType = getQuickActionButtonType(participant, _isAudioMuted, state);

    const tracks = state['features/base/tracks'];
    const _audioTrack = participantID === localParticipantId
        ? getLocalAudioTrack(tracks) : getTrackByMediaTypeAndParticipant(tracks, MEDIA_TYPE.AUDIO, participantID);

    return {
        _audioMediaState,
        _audioTrack,
        _videoMediaState,
        _displayName: getParticipantDisplayName(state, participant?.id),
        _local: Boolean(participant?.local),
        _localVideoOwner: Boolean(ownerId === localParticipantId),
        _participant: participant,
        _participantID: participant?.id,
        _quickActionButtonType,
        _raisedHand: Boolean(participant?.raisedHand)
    };
}

export default connect(_mapStateToProps)(MeetingParticipantItem);
