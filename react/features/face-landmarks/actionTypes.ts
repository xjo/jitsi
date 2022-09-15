/**
 * Redux action type dispatched in order to add a face expression.
 *
 * {
 *      type: ADD_FACE_EXPRESSION,
 *      faceExpression: string,
 *      duration: number
 * }
 */
export const ADD_FACE_EXPRESSION = 'ADD_FACE_EXPRESSION';

/**
 * Redux action type dispatched in order to add a expression to the face expressions buffer.
 *
 * {
 *      type: ADD_TO_FACE_EXPRESSIONS_BUFFER,
 *      faceExpression: string
 * }
*/
export const ADD_TO_FACE_EXPRESSIONS_BUFFER = 'ADD_TO_FACE_EXPRESSIONS_BUFFER';

/**
 * Redux action type dispatched in order to clear the face expressions buffer in the state.
 *
 * {
 *      type: CLEAR_FACE_EXPRESSIONS_BUFFER
 * }
*/
export const CLEAR_FACE_EXPRESSIONS_BUFFER = 'CLEAR_FACE_EXPRESSIONS_BUFFER';

/**
 * Redux action type dispatched in order to update coordinates of a detected face.
 *
 * {
 *      type: UPDATE_FACE_COORDINATES,
 *      faceBox: Object({ left, bottom, right, top }),
 *      participantId: string
 * }
 */
export const UPDATE_FACE_COORDINATES = 'UPDATE_FACE_COORDINATES';

/**
 * Redux action type dispatched in order to signal new face coordinates were obtained for the local participant.
 *
 * {
 *      type: NEW_FACE_COORDINATES,
 *      faceBox: Object({ left, bottom, right, top }),
 *      participantId: string
 * }
 */
 export const NEW_FACE_COORDINATES = 'NEW_FACE_COORDINATES';

 /**
  * Redux action type dispatched in order to send the camera off timestamp to services.
  * {
  *      type: CAMERA_OFF_TIMESTAMP,
  *      timestamp: number,
  * }
*/
export const CAMERA_OFF_TIMESTAMP = 'CAMERA_OFF_TIMESTAMP';
