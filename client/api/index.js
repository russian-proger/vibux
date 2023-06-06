export const API_URI = `${window.location.origin}/api/`;

export const METHOD = {
    GET: "GET",
    POST: "POST"
};

export async function query(path, method=METHOD.POST, body=undefined) {
    return fetch(`${API_URI}${path}`, {
        method,
        body
    }).then(res => res.json());
}

import * as Conference from './conference';

export {
    Conference
};
