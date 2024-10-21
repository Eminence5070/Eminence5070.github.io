import { checkUUID } from "./utils/checkUUID.js";
import { ensureUUID } from "./utils/ensureUUID.js";
import { fetchPassword } from "./utils/fetchPassword.js";
import { getIPAddress } from "./utils/getIPAddress.js";
import { getFontFingerprint } from "./utils/fontFingerprint.js";
import { getAudioFingerprint } from "./utils/audioFingerprint.js";
import { getFingerprint } from "./utils/getFingerprint.js";
import { writeUUID } from "./utils/writeUUID.js";
import { fetchKey, fetchToken } from "./utils/firestore.js";
import { fetchChangelog, parseChangelog } from "./utils/fetchChangelog.js";

export const Utils = {
  checkUUID,
  fetchPassword,
  ensureUUID,
  getFontFingerprint,
  fetchChangelog,
  parseChangelog,
  getIPAddress,
  getAudioFingerprint,
  getFingerprint,
  writeUUID,
  fetchChangelog,
  fetchToken,
  fetchKey,
};
