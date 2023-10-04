import React, { useCallback, useState } from 'react';
import { FlatList } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';

import { IReduxState } from '../../../../../app/types';
import JitsiScreen from '../../../../../base/modal/components/JitsiScreen';
import { equals } from '../../../../../base/redux/functions';
import Input from '../../../../../base/ui/components/native/Input';
import {
    getBreakoutRooms,
    getCurrentRoomId,
    isAddBreakoutRoomButtonVisible,
    isAutoAssignParticipantsVisible,
    isInBreakoutRoom
} from '../../../../../breakout-rooms/functions';

import AddBreakoutRoomButton from './AddBreakoutRoomButton';
import AutoAssignButton from './AutoAssignButton';
import { CollapsibleRoom } from './CollapsibleRoom';
import LeaveBreakoutRoomButton from './LeaveBreakoutRoomButton';
import styles from './styles';


const BreakoutRooms = () => {
    const currentRoomId = useSelector(getCurrentRoomId);
    const inBreakoutRoom = useSelector(isInBreakoutRoom);
    const isBreakoutRoomsSupported = useSelector((state: IReduxState) => state['features/base/conference'].conference?.getBreakoutRooms()?.isSupported());
    const onSearchStringChange = useCallback((text: string) =>{
        setSearchString(text)
    }, [])
    const rooms = Object.values(useSelector(getBreakoutRooms, equals))
        .filter(room => room.id !== currentRoomId)
        .sort((p1, p2) => (p1?.name || '').localeCompare(p2?.name || ''));
    const [ searchString, setSearchString ] = useState('');
    const showAddBreakoutRoom = useSelector(isAddBreakoutRoomButtonVisible);
    const showAutoAssign = useSelector(isAutoAssignParticipantsVisible);
    const { t } = useTranslation();

    return(
        <JitsiScreen
            safeAreaInsets = { [ 'bottom' ] }
            style = { styles.breakoutRoomsContainer }>
            <Input
                clearable = { true }
                customStyles = {{
                    container: styles.inputContainer,
                    input: styles.centerInput }}
                onChange = { onSearchStringChange }
                placeholder = { t('participantsPane.search') }
                value = { searchString } />
            <FlatList
                data = {[]}
                keyExtractor = { (_e, i) => 'dom' + i.toString() }
                ListEmptyComponent = { null }
                renderItem = { null }
                ListHeaderComponent = {() =>
                    <>
                        {
                            showAutoAssign && <AutoAssignButton />
                        }
                        {
                            inBreakoutRoom && <LeaveBreakoutRoomButton />
                        }
                        {
                            isBreakoutRoomsSupported
                            && rooms.map(room => (<CollapsibleRoom
                                key = { room.id }
                                room = { room }
                                roomId = { room.id }
                                searchString = { searchString } />))
                        }
                        {
                            showAddBreakoutRoom && <AddBreakoutRoomButton />
                        }
                    </>
            } />
        </JitsiScreen>
    )
}

export default BreakoutRooms;
