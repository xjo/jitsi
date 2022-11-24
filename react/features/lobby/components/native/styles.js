import BaseTheme from '../../../base/ui/components/BaseTheme.native';


export default {

    lobbyChatWrapper: {
        backgroundColor: BaseTheme.palette.ui01,
        alignItems: 'stretch',
        flexDirection: 'column',
        justifyItems: 'center',
        height: '100%'
    },

    passwordJoinButtons: {
        top: 40
    },

    contentContainer: {
        alignItems: 'center',
        backgroundColor: BaseTheme.palette.uiBackground,
        bottom: 0,
        display: 'flex',
        height: 388,
        justifyContent: 'center',
        position: 'absolute',
        width: '100%',
        zIndex: 1
    },

    formWrapper: {
        alignItems: 'center',
        justifyContent: 'center'
    },

    customInput: {
        position: 'relative',
        textAlign: 'center',
        top: BaseTheme.spacing[6],
        width: 352
    },

    joiningMessage: {
        color: BaseTheme.palette.text01,
        marginHorizontal: BaseTheme.spacing[3],
        textAlign: 'center'
    },

    loadingIndicator: {
        marginBottom: BaseTheme.spacing[3]
    },

    // KnockingParticipantList

    knockingParticipantList: {
        backgroundColor: BaseTheme.palette.ui01
    },


    knockingParticipantListDetails: {
        flex: 1,
        marginLeft: BaseTheme.spacing[2]
    },

    knockingParticipantListEntry: {
        alignItems: 'center',
        flexDirection: 'row'
    },

    knockingParticipantListText: {
        color: 'white'
    },

    lobbyButtonAdmit: {
        position: 'absolute',
        right: 176
    },

    lobbyButtonChat: {
        position: 'absolute',
        right: 96
    },

    lobbyButtonReject: {
        position: 'absolute',
        right: 8
    },

    lobbyTitle: {
        ...BaseTheme.typography.heading5,
        color: BaseTheme.palette.text01,
        marginBottom: BaseTheme.spacing[3],
        textAlign: 'center'
    },

    lobbyWaitingFragmentContainer: {
        height: 260
    }
};
