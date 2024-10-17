export async function fetchPassword() {
    try {
        const response = await fetch('/data/$password');
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        const data = await response.text();
        const decodedData = atob(data);
        
        return decodedData; // Return the decoded data if needed
    } catch (error) {
        console.error('Error fetching password:', error);
        return null; // Return null in case of error
    }
}
