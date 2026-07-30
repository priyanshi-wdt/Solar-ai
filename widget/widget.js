window.SolarAI = {
    init(config = {}) {
        const iframe = document.createElement("iframe");
        // iframe.src = `https://solar-ai-livid.vercel.app/?companyId=${config.companyId}`;
        iframe.src = `http://localhost:5173/?companyId=${config.companyId}`;
        iframe.allow = "microphone";
        iframe.style.position = "fixed";
        iframe.style.bottom = "20px";
        iframe.style.right = "20px";
        iframe.style.width = "210px";
        iframe.style.height = "110px";
        iframe.style.padding = '10px',
            iframe.style.border = "none";
        // iframe.style.background = "red";

        document.body.appendChild(iframe);
        window.addEventListener("message", (event) => {
            if (event.data?.type === "OPEN_CHAT") {
                iframe.style.width = "350px";
                iframe.style.height = "450px";
            }

            if (event.data?.type === "CLOSE_CHAT") {
                iframe.style.width = "210px";
                iframe.style.height = "110px";
            }
        });
    },
};
