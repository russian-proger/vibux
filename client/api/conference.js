import * as API from '.';

/**
 * Check if conference exists
 * @param {number} conference_id 
 * @todo
 */
export async function exists(conference_id) {
    let result = await API.query(`conference/exists/${conference_id}`, API.METHOD.GET);
    console.log(result);
    return result.answer;
}

/**
 * Create new conference
 * @returns {string} conference ID
 */
export async function create() {
    return await API.query(`conference/create`);
}