import { Utils } from "../utils.js";

const repo = "Eminence5070/Eminence5070.github.io";
let token;

// write user's UUID to blacklist.json
export async function writeUUID(uuid) {
  if (!token) {
    token = await Utils.fetchToken();
  }

  const existingContentResponse = await fetch(
    `https://api.github.com/repos/${repo}/contents/data/blacklist.json`,
    {
      headers: {
        Authorization: `token ${token}`,
      },
    }
  );

  let users = {};
  let existingContent;

  if (existingContentResponse.ok) {
    existingContent = await existingContentResponse.json();
    users = JSON.parse(atob(existingContent.content));
  } else {
    console.error(
      "Failed to fetch existing content:",
      existingContentResponse.statusText
    );
    return;
  }

  users.users = users.users || {};
  users.users[uuid] = true;

  const apiUrl = `https://api.github.com/repos/${repo}/contents/data/blacklist.json`;
  const sha = existingContent.sha;

  const updateResponse = await fetch(apiUrl, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Add banned user UUID",
      content: btoa(JSON.stringify(users, null, 2)),
      sha: sha,
    }),
  });

  const updateData = await updateResponse.json();

  if (updateResponse.ok) {
    console.log("UUID written to file successfully:", updateData);
  } else {
    console.error("Failed to write UUID:", updateData);
  }
}
