window.SolarAI = {
    init(config = {}) {
        console.log("SolarAI Started", config);

        const button = document.createElement("button");

        button.id = "solar-ai-button";

        button.innerHTML = "🎤";

        document.body.appendChild(button);

        // function updateWidgetStatus(status) {
        //   if (status === "listening") {
        //     button.innerHTML = "🔴";
        //   } else if (status === "speaking") {
        //     button.innerHTML = "🔊";
        //   } else {
        //     button.innerHTML = "🎤";
        //   }
        // }

        let started = false;

        button.onclick = () => {
            if (started) return;

            started = true;

            const iframe = document.createElement("iframe");

            iframe.style.width = "0";
            iframe.style.height = "0";
            iframe.style.border = "0";
            iframe.style.position = "absolute";
            iframe.style.left = "-9999px";

            iframe.allow = "microphone";
            // iframe.src = "https://solar-ai-livid.vercel.app?companyId=" + config.companyId;
             iframe.src =
                `https://restaurant-ai-qp3u.vercel.app/?companyId=${config.companyId}`;

            document.body.appendChild(iframe);
        };


    },
};
