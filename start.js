require('dotenv').config();
const chalk = require("chalk");



// add process logging for unhandled rejections
process.on("unhandledRejection", (reason, promise) => {
    console.error("Unhandled Rejection at:", promise, "reason:", reason);
    // Application specific logging, throwing an error, or other logic here
});

// add process logging for uncaught exceptions
process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception thrown");
    console.error(err);
});

const start = async () => {
    const mongoose = require('./db/mongo')

    const URI = process.env.mongodb;

    await mongoose
        .connect(URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        .then(async () => {console.log(chalk.green(`mongoose connected to [${URI}]`))})
        .catch(() => {console.warn(chalk.red(`mongoose failed to connected to [${URI}]`))});

    const mongo = mongoose.connection;

    if (mongo.states[mongo.readyState] === "disconnected") {
        console.log(chalk.blue(`State: ${mongo.states[mongo.readyState]} URI: ${URI}`));
        throw new Error("Something is wrong, DB connection not previously established and now is disconnected.");
    }


    require("./src/discord");
}

start()