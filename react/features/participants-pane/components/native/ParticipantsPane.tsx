import React, { useCallback } from 'react';
import { FlatList } from 'react-native';
import { useSelector } from 'react-redux';

import JitsiScreen from '../../../base/modal/components/JitsiScreen';
import { isLocalParticipantModerator } from '../../../base/participants/functions';

import LobbyParticipantList from './LobbyParticipantList';
import MeetingParticipantList from './MeetingParticipantList';
import ParticipantsPaneFooter from './ParticipantsPaneFooter';
import styles from './styles';


/**
 * Participants pane.
 *
 * @returns {React$Element<any>}
 */
const ParticipantsPane = () => {
    const isLocalModerator = useSelector(isLocalParticipantModerator);
    const keyExtractor
        = useCallback((e: undefined, i: number) => i.toString(), []);

    return (
        <JitsiScreen
            footerComponent = { isLocalModerator ? ParticipantsPaneFooter : undefined }
            safeAreaInsets = { [ 'bottom' ] }
            style = { styles.participantsPaneContainer }>

            { /*Fixes warning regarding nested lists*/ }
            <FlatList
                data = {[] as ReadonlyArray<undefined>}
                keyExtractor = { keyExtractor }

                /* eslint-disable react/jsx-no-bind */
                ListHeaderComponent = {() => (
                    <>
                        <LobbyParticipantList />
                        <MeetingParticipantList />
                    </>
                )}
                renderItem = { null } />
        </JitsiScreen>
    );
};

export default ParticipantsPane;
