import { ensureThreeParticipants, toggleMuteAndCheck } from '../../helpers/participants';

describe('ActiveSpeaker ', () => {
    const context = {};

    it('testActiveSpeaker', async () => {
        await ensureThreeParticipants(context);

        await toggleMuteAndCheck(context.p1, context.p2);
        await toggleMuteAndCheck(context.p2, context.p1);
        await toggleMuteAndCheck(context.p3, context.p1);

        // participant1 becomes active speaker - check from participant2's perspective
        await testActiveSpeaker(context.p1, context.p2, context.p3);

        // participant3 becomes active speaker - check from participant2's perspective
        await testActiveSpeaker(context.p3, context.p2, context.p1);

        // participant2 becomes active speaker - check from participant1's perspective
        await testActiveSpeaker(context.p2, context.p1, context.p3);

        // check the displayed speakers, there should be only one speaker
        await assertOneDominantSpeaker(context.p1);
        await assertOneDominantSpeaker(context.p2);
        await assertOneDominantSpeaker(context.p3);
    });
});

/**
 * Tries to make given participant an active speaker by un-muting it.
 * Verifies from {@code participant2}'s perspective that the active speaker
 * has been displayed on the large video area. Mutes him back.
 *
 * @param activeSpeaker <tt>Participant</tt> instance of the
 * participant who will be tested as an active speaker.
 * @param otherParticipant1 <tt>Participant</tt> of the participant who will
 * be observing and verifying active speaker change.
 * @param otherParticipant2 used only to print some debugging info
 */
async function testActiveSpeaker(
        activeSpeaker: Paticipant, otherParticipant1: Participant, otherParticipant2: Participants) {
    activeSpeaker.log(`Start testActiveSpeaker for participant: ${activeSpeaker.name}`);

    const speakerEndpoint = await activeSpeaker.getEndpointId();

    // just a debug print to go in logs
    activeSpeaker.log('Unmuting in testActiveSpeaker');

    // Unmute
    await activeSpeaker.getToolbar().clickAudioUnmuteButton();

    // just a debug print to go in logs
    otherParticipant1.log(`Participant unmuted in testActiveSpeaker ${speakerEndpoint}`);
    otherParticipant2.log(`Participant unmuted in testActiveSpeaker ${speakerEndpoint}`);

    await activeSpeaker.getFilmstrip().assertAudioMuteIconIsDisplayed(activeSpeaker, true);

    // Verify that the user is now an active speaker from otherParticipant1's perspective
    const otherParticipant1Driver = otherParticipant1.driver;

    await otherParticipant1Driver.waitUntil(
        () => otherParticipant1Driver.execute(id => APP.UI.getLargeVideoID() === id, speakerEndpoint),
        {
            timeout: 30_1000, // 30 seconds
            timeoutMsg: 'Active speaker not displayed on large video.'
        });

    // just a debug print to go in logs
    activeSpeaker.log('Muting in testActiveSpeaker');

    // Mute back again
    await activeSpeaker.getToolbar().clickAudioMuteButton();

    // just a debug print to go in logs
    otherParticipant1.log(`Participant muted in testActiveSpeaker ${speakerEndpoint}`);
    otherParticipant2.log(`Participant muted in testActiveSpeaker ${speakerEndpoint}`);

    await otherParticipant1.getFilmstrip().assertAudioMuteIconIsDisplayed(activeSpeaker);
}

/**
 * Asserts that the number of small videos with the dominant speaker
 * indicator displayed equals 1.
 * @param participant the participant to check
 */
async function assertOneDominantSpeaker(participant: Participant) {
    expect((await participant.driver.$$(
        '//span[not(contains(@class, "tile-view"))]//span[contains(@class,"dominant-speaker")]')).length).toBe(1);
}
