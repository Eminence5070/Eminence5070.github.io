import { Utils } from '../utils.js';

// Write UUID to the restricted users file
const repo = 'Eminence5070/Eminence5070.github.io';
let token;

export async function writeUUID(uuid) {
    if (!token) {
        token = await Utils.fetchToken(); // Fetch the token from Firestore
    }

    // Fetch the existing blacklist content
    const existingContentResponse = await fetch(`https://api.github.com/repos/${repo}/contents/data/blacklist.json`, {
        headers: {
            'Authorization': `token ${token}`
        }
    });

    let users = {};
    let existingContent;

    // Check if the response is okay and parse the JSON data
    if (existingContentResponse.ok) {
        existingContent = await existingContentResponse.json(); // Read JSON only once
        users = JSON.parse(atob(existingContent.content)); // Decode base64 content
    } else {
        console.error('Failed to fetch existing content:', existingContentResponse.statusText);
        return; // Exit the function if the fetch fails
    }

    // Add the new UUID to the users list
    users.users = users.users || {};
    users.users[uuid] = true;

    // Write the updated content back to the file
    const apiUrl = `https://api.github.com/repos/${repo}/contents/data/blacklist.json`;
    const sha = existingContent.sha; // Use existingContent to get sha

    const updateResponse = await fetch(apiUrl, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Add banned user UUID',
            content: btoa(JSON.stringify(users, null, 2)), // Encode to base64
            sha: sha
        })
    });

    const updateData = await updateResponse.json();

    // Check if the update was successful
    if (updateResponse.ok) {
        console.log('UUID written to file successfully:', updateData);
    } else {
        console.error('Failed to write UUID:', updateData);
    }
}
