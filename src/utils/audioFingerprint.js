// get audio fingerprint
export async function getAudioFingerprint() {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const latency = audioContext.baseLatency;
    return `SampleRate:${sampleRate}-Latency:${latency}`;
}