import { Utils } from '../utils.js';

export async function getFingerprint() {
    // export fingerprinting data
    try {
        const font = await Utils.getFontFingerprint();
        const audioFingerprint = await Utils.getAudioFingerprint();
        const ipAddress = await Utils.getIPAddress();

        const fingerprint = [font, audioFingerprint, ipAddress].join('-');
        
        return fingerprint;
    } catch (error) {
        console.error("Error collecting fingerprint data:", error);
    }
};
