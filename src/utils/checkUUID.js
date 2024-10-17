import { Utils } from '../utils.js';

const repo = 'Eminence5070/Eminence5070.github.io';
let token;

// check if UUID is in the restricted users list
export async function checkUUID(uuid) {
    if (!token) {
        token = await Utils.fetchToken(); // fetch the token from Firestore
    }

    const response = await fetch(`https://api.github.com/repos/${repo}/contents/data/restricted-users.json`, {
        headers: {
            'Authorization': `token ${token}`
        }
    });

    if (response.ok) {
        const data = await response.json();
        const content = JSON.parse(atob(data.content));

        // check if UUID is in the users list
        return content.users && content.users[uuid] ? true : false;
    } else if (response.status === 404) {
        return false;
    } else {
        console.error('Error fetching restricted users:', response.statusText);
        return false;
    }
}