const mongoose = require('mongoose');

exports.connectToDB = async () => {
    try {
        // Ensure the environment variable is correctly named (case-sensitive)
        console.log("Mongo URI:", process.env.MONGO_URI);

        const uri = process.env.MONGO_URI; 
        if (!uri) {
            throw new Error("MONGO_URI is not defined in .env");
        }
        
        const connection = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("DB connected: " + connection.connection.host);
    } catch (err) {
        console.error("DB connection error:", err);
    }
};
