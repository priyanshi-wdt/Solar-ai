window.SolarAI = {
  init(config = {}) {
    const iframe = document.createElement("iframe");
    iframe.src = `https://solar-ai-livid.vercel.app/?companyId=${encodeURIComponent(config.companyId)}&imageSrc=${encodeURIComponent(config.imageSrc)}`;
    // iframe.src = `http://localhost:5173/?companyId=${encodeURIComponent(config.companyId)}&imageSrc=${encodeURIComponent(config.imageSrc)}`;
    iframe.allow = "microphone";
    iframe.style.position = "absolute";
    iframe.style.bottom = "20px";
    // iframe.style.right = "20px";
    iframe.style.width = "100%";
    iframe.style.height = "110px";
    iframe.style.padding = "10px"; 
    iframe.style.border = "none";
    // iframe.style.background = "red";

    document.body.appendChild(iframe);
    window.addEventListener("message", (event) => {
      if (event.data?.type === "OPEN_CHAT") {
        iframe.style.width = "380px";
        iframe.style.height = "480px";
      }

      if (event.data?.type === "CLOSE_CHAT") {
        iframe.style.width = "400px";
        iframe.style.height = "110px";
      }
    });
  },
};
