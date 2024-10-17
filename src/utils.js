import { checkUUID } from './utils/checkUUID.js';
import { ensureUUID } from './utils/ensureUUID.js';
import { fetchPassword } from './utils/fetchPassword.js';
import { getIPAddress } from './utils/getIPAddress.js';
import { getFontFingerprint } from './utils/fontFingerprint.js';
import { getAudioFingerprint } from './utils/audioFingerprint.js';
import { getFingerprint } from './utils/fingerprint.js';
import { writeUUID } from './utils/writeUUID.js';
import { fetchKey, fetchToken } from './utils/firestore.js';

export const Utils = {
    checkUUID,
    fetchPassword,
    ensureUUID,
    getFontFingerprint,
    getIPAddress,
    getAudioFingerprint,
    getFingerprint,
    writeUUID,
    fetchToken,
    fetchKey
};
