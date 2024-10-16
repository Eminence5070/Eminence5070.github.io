export async function getFingerprint() {
    // get font stuffz
    async function getFonts() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        const fontList = [
            'Arial', 'Verdana', 'Times New Roman', 'Courier New', 'Georgia'
        ];

        const fontResults = [];

        fontList.forEach(font => {
            context.font = `72px "${font}"`;
            const width = context.measureText("Hello").width;
            fontResults.push(`${font}:${width}`);
        });

        return fontResults.join(',');
    }

    // get audio stuffs
    async function getAudioFingerprint() {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const sampleRate = audioContext.sampleRate;
        const latency = audioContext.baseLatency;
        return `SampleRate:${sampleRate}-Latency:${latency}`;
    }

    // get ip
    async function getIPAddress() {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        return `IP:${data.ip}`;
    }

    // bundle it together
    try {
        const fonts = await getFonts();
        const audioFingerprint = await getAudioFingerprint();
        const ipAddress = await getIPAddress();

        const fingerprint = [fonts, audioFingerprint, ipAddress].join('-');
        
        return fingerprint;
    } catch (error) {
        console.error("Error collecting fingerprint data:", error);
    }
};
