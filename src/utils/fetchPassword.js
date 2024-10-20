// fetches the password
export async function fetchPassword() {
  try {
    const response = await fetch("/data/$password");
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.text();
    const decodedData = atob(data);

    return decodedData;
  } catch (error) {
    console.error("Error fetching password:", error);
    return null;
  }
}
