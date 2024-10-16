import { fetchToken } from './firebase.js';
import { getFingerprint } from './fingerprint.js';

const repo = 'Eminence5070/Eminence5070.github.io';
let token;

// ensure UUID exists in localStorage
export async function ensureUUID() {
    if (!localStorage.getItem('vertex_uuid')) {
        localStorage.setItem('vertex_uuid', await getFingerprint());
    }
}



// check if UUID is in the restricted users list
export async function checkUUID(uuid) {
    if (!token) {
        token = await fetchToken(); // fetch the token from Firestore
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

// write UUID to the restricted users file
export async function writeUUID(uuid) {
    if (!token) {
        token = await fetchToken(); // fetch the token from Firestore
    }

    const existingContent = await fetch(`https://api.github.com/repos/${repo}/contents/data/restricted-users.json`, {
        headers: {
            'Authorization': `token ${token}`
        }
    });

    let users = {};

    if (existingContent.ok) {
        const data = await existingContent.json();
        users = JSON.parse(atob(data.content));
    }

    // add the new UUID to the users list
    users.users = users.users || {};
    users.users[uuid] = true;

    // write the updated content back to the file
    const apiUrl = `https://api.github.com/repos/${repo}/contents/data/restricted-users.json`;
    const sha = existingContent.ok ? (await existingContent.json()).sha : null;

    fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Add banned user UUID',
            content: btoa(JSON.stringify(users, null, 2)), // encode to base64
            sha: sha
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.content) {
            console.log('UUID written to file successfully:', data);
            alert('UUID written to file successfully!');
        } else {
            console.error('Failed to write UUID:', data);
            alert('Failed to write UUID. Check console for details.');
        }
    })
    .catch(error => {
        console.error('Error writing UUID to file:', error);
        alert('Error writing UUID to file. Check console for details.');
    });
}
