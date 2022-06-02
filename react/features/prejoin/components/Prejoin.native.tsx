import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Text, View, TouchableOpacity, TextInput } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import JitsiScreen from '../../base/modal/components/JitsiScreen';
import { getLocalParticipant } from '../../base/participants';
import { getFieldValue } from '../../base/react';
import { ASPECT_RATIO_NARROW } from '../../base/responsive-ui';
import { updateSettings } from '../../base/settings';
import { LargeVideo } from '../../large-video/components';
import AudioMuteButton from '../../toolbox/components/AudioMuteButton';
import VideoMuteButton from '../../toolbox/components/VideoMuteButton';

import styles from './styles';


const Prejoin: React.FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const aspectRatio = useSelector(
            state => state['features/base/responsive-ui']?.aspectRatio
    );
    const localParticipant = useSelector(state => getLocalParticipant(state));
    const participantName = localParticipant?.name;
    const [ displayName, setDisplayName ]
        = useState(participantName || '');
    const onChangeDisplayName = useCallback(event => {
        const displayName = getFieldValue(event);

        setDisplayName(displayName);
        dispatch(updateSettings({
            displayName
        }));
    }, [ onChangeDisplayName ]);

    let contentStyles;
    let largeVideoContainerStyles;
    let contentContainerStyles;
    let toolboxContainerStyles;

    if (aspectRatio === ASPECT_RATIO_NARROW) {
        contentContainerStyles = styles.contentContainer;
        largeVideoContainerStyles = styles.largeVideoContainer;
        toolboxContainerStyles = styles.toolboxContainer;
    } else {
        contentContainerStyles = styles.contentContainerWide;
        contentStyles = styles.contentWide;
        largeVideoContainerStyles = styles.largeVideoContainerWide;
        toolboxContainerStyles = styles.toolboxContainerWide;
    }

    return (
        <JitsiScreen
            style = { styles.contentWrapper }>
            <View style = { contentStyles }>
                <View style = { largeVideoContainerStyles }>
                    <LargeVideo />
                </View>
                <View style = { contentContainerStyles }>
                    <View style = { styles.formWrapper }>
                        <TextInput
                            onChangeText = { onChangeDisplayName }
                            placeholder = { t('dialog.enterDisplayName') }
                            style = { styles.field }
                            value = { displayName } />
                        <TouchableOpacity
                            style = { [
                                styles.button,
                                styles.primaryButton
                            ] }>
                            <Text style = { styles.primaryButtonText }>
                                { t('prejoin.joinMeeting') }
                            </Text>
                        </TouchableOpacity>
                    </View>
                    <View style = { toolboxContainerStyles }>
                        <AudioMuteButton
                            styles = { styles.buttonStylesBorderless } />
                        <VideoMuteButton
                            styles = { styles.buttonStylesBorderless } />
                    </View>
                </View>
            </View>
        </JitsiScreen>
    );
};

export default Prejoin;
