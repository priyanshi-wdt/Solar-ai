require("dotenv").config();

const app = require("./app");
const http = require("http");
const companyRoutes = require("./routes/companyRoutes");
const chatRoutes = require("./routes/chatRoutes");

const {
    startWebSocketServer
} = require("./websocket/server");


const PORT = 5000;


const server = http.createServer(app);
app.use("/company", companyRoutes);
app.use("/api/chat", chatRoutes);

startWebSocketServer(server);


server.listen(PORT,()=>{

    console.log(
        `Server running on port ${PORT}`
    );

});