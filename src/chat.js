let iframe;

async function createChatFrame() {
  try {
    const response = await fetch("https://corsproxy.io/?url=https://gljwsxkst95k.share.zrok.io/");
    const srcdoc = "<base href='https://gljwsxkst95k.share.zrok.io/'>" + await response.text();

    iframe = document.createElement("iframe");
    iframe.srcdoc = srcdoc;
    iframe.style.position = "absolute";
    iframe.style.top = "0";
    iframe.style.left = "80px";
    iframe.style.width = "calc(100% - 80px)";
    iframe.style.height = "100vh";
    iframe.style.border = "none";

    document.body.appendChild(iframe);
  } catch (error) {
    console.error("Error fetching the iframe content:", error);
  }
}

function toggleChat() {
  if (iframe) {
    iframe.style.display = iframe.style.display === "none" ? "block" : "none";
  } else {
    createChatFrame();
  }
}
