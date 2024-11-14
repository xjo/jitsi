import { urlObjectToString } from '../../react/features/base/util/uri';

/**
 * Participant.
 */
export class Participant {
    /**
     * The current context.
     * @private
     */
    private context: { roomName: string };
    private _name: string;
    private _endpointId: string;

    /**
     * The default config to use when joining.
     * @private
     */
    private config = {
        analytics: {
            disabled: true
        },
        debug: true,
        requireDisplayName: false,
        testing: {
            testMode: true
        },
        disableAEC: true,
        disableNS: true,
        disable1On1Mode: true,
        disableModeratorIndicator: true,
        enableTalkWhileMuted: false,
        gatherStats: true,
        p2p: {
            enabled: false,
            useStunTurn: false
        },
        pcStatsInterval: 1500,
        prejoinConfig: {
            enabled: false
        },
        toolbarConfig: {
            alwaysVisible: true
        }
    };

    /**
     * Creates a participant with given name.
     * @param name
     */
    constructor(name: string) {
        this._name = name;
    }

    /**
     * Returns participant endpoint ID.
     * @returns {Promise<string>} The endpoint ID.
     */
    async getEndpointId() {
        if (!this._endpointId) {
            this._endpointId = await this.driver.execute(() => { // eslint-disable-line arrow-body-style
                return APP.conference.getMyUserId();
            });
        }

        return this._endpointId;
    }

    /**
     * The driver it uses.
     */
    get driver() {
        return browser.getInstance(this._name);
    }

    /**
     * The name.
     */
    get name() {
        return this._name;
    }

    /**
     * Joins conference.
     */
    async joinConference(context: { roomName: string }, skipInMeetingChecks = false) {
        this.context = context;

        const url = urlObjectToString({
            room: context.roomName,
            configOverwrite: this.config,
            interfaceConfigOverwrite: {
                SHOW_CHROME_EXTENSION_BANNER: false
            },
            userInfo: {
                displayName: this._name
            }
        });

        await this.driver.setTimeout({ 'pageLoad': 30000 });

        await this.driver.url(url);

        await this.waitForPageToLoad();

        await this.waitToJoinMUC();

        await this.postLoadProcess(skipInMeetingChecks);
    }

    /**
     * Loads stuff after the page loads.
     * @private
     */
    private async postLoadProcess(skipInMeetingChecks) {
        const driver = this.driver;

        const parallel = [];

        parallel.push(driver.execute((name, sessionId) => {
            APP.UI.dockToolbar(true);

            // disable keyframe animations (.fadeIn and .fadeOut classes)
            $('<style>.notransition * { '
                + 'animation-duration: 0s !important; -webkit-animation-duration: 0s !important; transition:none; '
                + '} </style>').appendTo(document.head);

            $('body').toggleClass('notransition');

            document.title = `${name}`;

            console.log(`lib-jitsi-meet version: ${JitsiMeetJS.version} sessionId: ${sessionId}`);
        }, this._name, driver.sessionId));

        // disable the blur effect in firefox as it has some performance issues
        if (driver.capabilities.firefox) {
            parallel.push(driver.execute(() => {
                try {
                    const blur = document.querySelector('.video_blurred_container');

                    if (blur) {
                        document.querySelector('.video_blurred_container').style.display = 'none';
                    }
                } catch (e) {} // eslint-disable-line no-empty
            }));
        }

        if (skipInMeetingChecks) {
            await Promise.all(parallel);

            return;
        }

        parallel.push(this.waitForIceConnected());
        parallel.push(this.waitForSendReceiveData());

        await Promise.all(parallel);
    }

    /**
     * Waits for the page to load.
     */
    async waitForPageToLoad() {
        return this.driver.waitUntil(
            () => this.driver.execute(() => document.readyState === 'complete'),
            {
                timeout: 30 * 1000, // 30 seconds
                timeoutMsg: 'Timeout waiting for Page Load Request to complete.'
            }
        );
    }

    /**
     * Waits to join the muc.
     */
    async waitToJoinMUC() {
        return this.driver.waitUntil(
            () => this.driver.execute(() => APP.conference.isJoined()),
            {
                timeout: 10 * 1000, // 10 seconds
                timeoutMsg: 'Timeout waiting to join muc.'
            }
        );
    }

    /**
     * Waits for ICE to get connected.
     */
    async waitForIceConnected() {
        const driver = this.driver;

        return driver.waitUntil(async () =>
            driver.execute(() => APP.conference.getConnectionState() === 'connected'), {
            timeout: 15000,
            timeoutMsg: 'expected ICE to be connected for 15s'
        });
    }

    /**
     * Waits for send and receive data.
     */
    async waitForSendReceiveData() {
        const driver = this.driver;

        return driver.waitUntil(async () =>
            driver.execute(() => {
                try {
                    const stats = APP.conference.getStats();
                    const bitrateMap = stats.bitrate;
                    const rtpStats = {
                        uploadBitrate: bitrateMap?.upload,
                        downloadBitrate: bitrateMap?.download
                    };

                    return rtpStats.uploadBitrate > 0 && rtpStats.downloadBitrate > 0;
                } catch (e) {
                    console.error('error', e.message, e.cause);
                }
            }), {
            timeout: 15000,
            timeoutMsg: 'expected to receive/send data in 15s'
        });
    }

    /**
     * Waits for remote streams.
     * @param number The number of remote streams o wait for.
     */
    async waitForRemoteStreams(number: number) {
        const driver = this.driver;

        return driver.waitUntil(async () =>
            driver.execute(count => APP.conference.getNumberOfParticipantsWithTracks() >= count, number), {
            timeout: 15000,
            timeoutMsg: 'expected remote streams in 15s'
        });
    }
}
