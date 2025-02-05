// Function to adjust the font size based on text length
function autoResizeText(element) {
    let textLength = element.textContent.trim().length;
  
    // Set base font size and minimum font size
    let fontSize = 20;
    const minFontSize = 10;
  
    // Scale font size based on text length, starting to resize at 11 characters
    if (textLength > 11) {
      fontSize = Math.max(20 - (textLength - 11) * 0.5, minFontSize); // Scale down after 11 characters
    }
  
    // Apply the calculated font size
    element.style.fontSize = `${fontSize}px`;
  }
  
  // Constantly resize text for all h3 elements using an interval
  setInterval(() => {
    const h3Elements = document.querySelectorAll("h3");
  
    // Apply the auto-resize function for each h3 element
    h3Elements.forEach((el) => {
      autoResizeText(el);
    });
  }, 200); // Interval of 200 milliseconds (adjust as needed)
  