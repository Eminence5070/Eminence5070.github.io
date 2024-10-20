import { Utils } from "../utils.js";

// collects your fingerprint
export async function getFingerprint() {
  try {
    const font = await Utils.getFontFingerprint();
    const audioFingerprint = await Utils.getAudioFingerprint();
    const ipAddress = await Utils.getIPAddress();

    const fingerprint = [font, audioFingerprint, ipAddress].join("-");

    return fingerprint;
  } catch (error) {
    console.error("Error collecting fingerprint data:", error);
  }
}
