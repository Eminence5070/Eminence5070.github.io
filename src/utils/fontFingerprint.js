export async function getFontFingerprint() {
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