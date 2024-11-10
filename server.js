const express = require("express");
require('dotenv').config();  // Only one dotenv config needed
require("./config/db").connectToDB();  // Ensure DB connection
const cors = require("cors");
const app = express();
const server = require("http").createServer(app);
app.use(express.json());
app.use(cors());

const uploadRoute = require("./routes/uploadRoute");
app.use("/upload", uploadRoute);

const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;

const io = require("socket.io")(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const USER_SOCKET_MAP = new Map();

const authRoute = require("./routes/auth");
const postRoute = require("./routes/post");
const userRoute = require("./routes/user");
const chatRoute = require("./routes/chat");
const storyRoute = require("./routes/story");
const User = require("./models/User");

app.use("/auth", authRoute);
app.use("/post", postRoute);
app.use("/user", userRoute);
app.use("/chat", chatRoute);
app.use("/story", storyRoute);

app.get("/test", (req, res) => {
  res.send("Hello from the other side");
});

io.on("connect", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("online", async ({ uid }) => {
    console.log(`User online event received with uid: ${uid}`);
    USER_SOCKET_MAP.set(socket.id, uid);
    const result = await User.updateOne({ _id: uid }, { $set: { online: true } });
    console.log(`User update result:`, result); // Debugging line
});


  socket.on("typingon", ({ uid, roomId }) => {
    socket.broadcast.emit(`typinglistenon${roomId}`, uid);
  });
  socket.on("typingoff", ({ uid, roomId }) => {
    socket.broadcast.emit(`typinglistenoff${roomId}`, uid);
  });
  socket.on("disconnect", async () => {
    const uid = USER_SOCKET_MAP.get(socket.id); // Get the user ID
    if (uid) { // Check if uid is available
        await User.updateOne(
            { _id: uid },
            { $set: { online: false, lastSeen: Date.now() } }
        );
        USER_SOCKET_MAP.delete(socket.id);
        console.log(`User ${uid} disconnected and status updated.`);
    }
});

});

server.listen(process.env.PORT, () => {
  console.log(`Server running at port: ${process.env.PORT}`);
});
