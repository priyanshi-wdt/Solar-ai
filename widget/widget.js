// window.SolarAI = {
//     init(config = {}) {
//         console.log("SolarAI Started", config);

//         const button = document.createElement("button");

//         button.id = "solar-ai-button";

//         button.innerHTML = "🎤";

//         document.body.appendChild(button);

//         let iframe = null;
//         let started = false;

//         window.addEventListener("message", (event) => {
//             console.log("Received message:", event.data);
//             if (event.data?.type !== "VOICE_AI_STATE") return;
//         });

//         button.onclick = () => {
//             if (!started) {
//                 started = true;

//                 iframe = document.createElement("iframe");

//                 iframe.style.display = "none";
//                 iframe.allow = "microphone";

//                 // iframe.src = `https://solar-ai-livid.vercel.app/?companyId=${config.companyId}`;
//                 iframe.src = `http://localhost:5173/?companyId=${config.companyId}`;

//                 document.body.appendChild(iframe);
//             } else {
//                 started = false;

//                 iframe.contentWindow.postMessage(
//                     {
//                         type: "VOICE_AI_END",
//                     },
//                     "*",
//                 );
//             }

//             // button.onclick = () => {
//             //     if (started) return;

//             //     started = true;

//             //     const iframe = document.createElement("iframe");

//             //     iframe.style.width = "0";
//             //     iframe.style.height = "0";
//             //     iframe.style.border = "0";
//             //     iframe.style.position = "absolute";
//             //     iframe.style.left = "-9999px";

//             //     iframe.allow = "microphone";
//             //     // iframe.src = "https://solar-ai-livid.vercel.app?companyId=" + config.companyId;
//             //      iframe.src =
//             //         `https://solar-ai-livid.vercel.app/?companyId=${config.companyId}`;

//             //     document.body.appendChild(iframe);
//             // };
//         };
//     },
// };

window.SolarAI = {
    init(config = {}) {
        const iframe = document.createElement("iframe");
        iframe.src = `https://solar-ai-livid.vercel.app/?companyId=${config.companyId}`;
        // iframe.src = `http://localhost:5173/?companyId=${config.companyId}`;
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
