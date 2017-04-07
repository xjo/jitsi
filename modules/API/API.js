/* global APP, getConfigParamsFromUrl */
import postisInit from 'postis';

/**
 * List of the available commands.
 * @type {{
 *              displayName: inputDisplayNameHandler,
 *              toggleAudio: toggleAudio,
 *              toggleVideo: toggleVideo,
 *              toggleFilmStrip: toggleFilmStrip,
 *              toggleChat: toggleChat,
 *              toggleContactList: toggleContactList
 *          }}
 */
let commands = {};

const hashParams = getConfigParamsFromUrl();

/**
 * JitsiMeetExternalAPI id - unique for a webpage.
 */
const jitsiMeetExternalApiId = hashParams.jitsi_meet_external_api_id;

/**
 * Object that will execute sendMessage
 */
const target = window.opener ? window.opener : window.parent;

/**
 * Postis instance. Used to communicate with the external application.
 */
let postis;

/**
 * Current status (enabled/disabled) of API.
 */
let enabled = false;

/**
 * Initializes supported commands.
 *
 * @returns {void}
 */
function initCommands() {
    commands = {
        'display-name':
            APP.conference.changeLocalDisplayName.bind(APP.conference),
        'toggle-audio': APP.conference.toggleAudioMuted.bind(APP.conference),
        'toggle-video': APP.conference.toggleVideoMuted.bind(APP.conference),
        'toggle-film-strip': APP.UI.toggleFilmStrip,
        'toggle-chat': APP.UI.toggleChat,
        'toggle-contact-list': APP.UI.toggleContactList,
        'toggle-share-screen':
            APP.conference.toggleScreenSharing.bind(APP.conference),
        'video-hangup': () => APP.conference.hangup(),
        'email': APP.conference.changeLocalEmail,
        'avatar-url': APP.conference.changeLocalAvatarUrl,
        'remote-control-event': event =>
            APP.remoteControl.onRemoteControlAPIEvent(event)
    };
    Object.keys(commands).forEach(key => {
        postis.listen(key, args => commands[key](...args));
    });
}

/**
 * Sends message to the external application.
 *
 * @param {Object} message - The message to be sent.
 * @returns {void}
 */
function sendMessage(message) {
    if (enabled) {
        postis.send(message);
    }
}

/**
 * Check whether the API should be enabled or not.
 *
 * @returns {boolean}
 */
function shouldBeEnabled() {
    return typeof jitsiMeetExternalApiId === 'number';
}

/**
 * Sends event object to the external application that has been subscribed
 * for that event.
 *
 * @param {string} name - The name event.
 * @param {Object} object - Data associated with the event.
 * @returns {void}
 */
function triggerEvent(name, object) {
    if (enabled) {
        sendMessage({ method: name,
            params: object });
    }
}

/**
 * Implements API class that communicates with external api class
 * and provides interface to access Jitsi Meet features by external
 * applications that embed Jitsi Meet
 */
class API {
    /**
     * Initializes the APIConnector. Setups message event listeners that will
     * receive information from external applications that embed Jitsi Meet.
     * It also sends a message to the external application that APIConnector
     * is initialized.
     *
     * @param {Object} options - Optional parameters.
     * @param {boolean} options.forceEnable - If true the module will be
     * enabled.
     * @returns {void}
     */
    init(options = {}) {
        if (!shouldBeEnabled() && !options.forceEnable) {
            return;
        }

        enabled = true;

        if (!postis) {
            this._initPostis();
        }
    }

    /**
     * Initializes postis library.
     *
     * @returns {void}
     *
     * @private
     */
    _initPostis() {
        const postisOptions = {
            window: target
        };

        if (typeof jitsiMeetExternalApiId === 'number') {
            postisOptions.scope
                = `jitsi_meet_external_api_${jitsiMeetExternalApiId}`;
        }
        postis = postisInit(postisOptions);
        initCommands();
    }

    /**
     * Notify external application (if API is enabled) that message was sent.
     *
     * @param {string} body - Message body.
     * @returns {void}
     */
    notifySendingChatMessage(body) {
        triggerEvent('outgoing-message', { 'message': body });
    }

    /**
     * Notify external application (if API is enabled) that
     * message was received.
     *
     * @param {Object} options - Object with the message properties.
     * @returns {void}
     */
    notifyReceivedChatMessage(options = {}) {
        const { id, nick, body, ts } = options;

        if (APP.conference.isLocalId(id)) {
            return;
        }

        triggerEvent(
            'incoming-message',
            { 'from': id,
                'nick': nick,
                'message': body,
                'stamp': ts }
        );
    }

    /**
     * Notify external application (if API is enabled) that
     * user joined the conference.
     *
     * @param {string} id - User id.
     * @returns {void}
     */
    notifyUserJoined(id) {
        triggerEvent('participant-joined', { id });
    }

    /**
     * Notify external application (if API is enabled) that
     * user left the conference.
     *
     * @param {string} id - User id.
     * @returns {void}
     */
    notifyUserLeft(id) {
        triggerEvent('participant-left', { id });
    }

    /**
     * Notify external application (if API is enabled) that
     * user changed their nickname.
     *
     * @param {string} id - User id.
     * @param {string} displayName - User nickname.
     * @returns {void}
     */
    notifyDisplayNameChanged(id, displayName) {
        triggerEvent('display-name-change', { id,
            displayname: displayName });
    }

    /**
     * Notify external application (if API is enabled) that
     * the conference has been joined.
     *
     * @param {string} room - The room name.
     * @returns {void}
     */
    notifyConferenceJoined(room) {
        triggerEvent('video-conference-joined', { roomName: room });
    }

    /**
     * Notify external application (if API is enabled) that
     * user changed their nickname.
     *
     * @param {string} room - User id.
     * @param {string} displayName - User nickname.
     * @returns {void}
     */
    notifyConferenceLeft(room) {
        triggerEvent('video-conference-left', { roomName: room });
    }

    /**
     * Notify external application (if API is enabled) that
     * we are ready to be closed.
     *
     * @returns {void}
     */
    notifyReadyToClose() {
        triggerEvent('video-ready-to-close', {});
    }

    /**
     * Sends remote control event.
     *
     * @param {RemoteControlEvent} event - The remote control event.
     * @returns {void}
     */
    sendRemoteControlEvent(event) {
        sendMessage({ method: 'remote-control-event',
            params: event });
    }

    /**
     * Removes the listeners.
     *
     * @returns {void}
     */
    dispose() {
        if (enabled) {
            postis.destroy();
        }
    }
}

export default new API();
