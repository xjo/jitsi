// eslint-disable-next-line no-unused-vars
import { Participant } from '../helpers/Participant';

/**
 * Filmstrip elements.
 */
export default class Filmstrip {
    private participant: Participant;

    /**
     * Initializes for a participant.
     * @param participant
     */
    constructor(participant: Participant) {
        this.participant = participant;
    }

    /**
     * Asserts that {@code participant} shows or doesn't show the audio
     * mute icon for the conference participant identified by
     * {@code testee}.
     *
     * @param testee the {@code WebParticipant} for whom we're checking the status of audio muted icon.
     * @param reverse if {@code true}, the method will assert the absence of the "mute" icon;
     * otherwise, it will assert its presence.
     */
    async assertAudioMuteIconIsDisplayed(testee: Participant, reverse = false) {
        let id;

        if (testee === this.participant) {
            id = 'localVideoContainer';
        } else {
            id = `participant_${await testee.getEndpointId()}`;
        }

        const mutedIconXPath
            = `//span[@id='${id}']//span[contains(@id, 'audioMuted')]//*[local-name()='svg' and @id='mic-disabled']`;

        await this.participant.driver.$(mutedIconXPath).waitForDisplayed({
            reverse,
            timeout: 2000,
            timeoutMsg: `Audio mute icon is not displayed for ${testee.name}`
        });
    }
}
