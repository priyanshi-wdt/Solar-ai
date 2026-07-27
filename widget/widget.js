window.SolarAI = {
  init(config = {}) {
    console.log("SolarAI Started", config);

    const button = document.createElement("button");

    button.id = "solar-ai-button";

    button.innerHTML = "🎤";

    document.body.appendChild(button);

    let iframe = null;
    let started = false;

    button.onclick = () => {
      if (!started) {
        started = true;

        iframe = document.createElement("iframe");

        iframe.style.display = "none";
        iframe.allow = "microphone";

        iframe.src = `https://solar-ai-livid.vercel.app/?companyId=${config.companyId}`;

        document.body.appendChild(iframe);
      } else {
        started = false;

        iframe.contentWindow.postMessage(
          {
            type: "VOICE_AI_END",
          },
          "*",
        );
      }

      // button.onclick = () => {
      //     if (started) return;

      //     started = true;

      //     const iframe = document.createElement("iframe");

      //     iframe.style.width = "0";
      //     iframe.style.height = "0";
      //     iframe.style.border = "0";
      //     iframe.style.position = "absolute";
      //     iframe.style.left = "-9999px";

      //     iframe.allow = "microphone";
      //     // iframe.src = "https://solar-ai-livid.vercel.app?companyId=" + config.companyId;
      //      iframe.src =
      //         `https://solar-ai-livid.vercel.app/?companyId=${config.companyId}`;

      //     document.body.appendChild(iframe);
      // };
    };
  },
};
