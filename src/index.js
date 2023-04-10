const fs = require("fs");

if (!fs.existsSync("./config.json")) {
    const template = {
        port: "2065",
        whitelist: false,
        auth: false,
        "display-ip": "localhost",
        client: false,
    };

    fs.writeFileSync("./config.json", JSON.stringify(template), "utf8");
}

const web = require("./web.js");

const config = require("./config.js");

// Setup express
const express = require("express");
const app = express();
const port = config.port();

// Import things
const serverVersions = require("./helpers/versions.js");
const passkeys = require("./passkeys.js");
const endpoints = require("./endpoints.js");

// DEV
if (config.auth() && !config.authkey()) {
    passkeys.setPasskey("AAABBB");
}
else if (config.auth() && config.authkey()) {
    console.log("Authkey is set, skipping passkey creation");
    passkeys.setPasskey(config.authkey());
}

// Auth middleware if auth is enabled
const authMiddleware = async (req, res, next) => {
    if (config.auth()) {
        let providedAuthKey = 
            req.headers["x-authKey"];

        try {
            const isAMatch = await passkeys
                .comparePasskey(providedAuthKey);

            if (!isAMatch) {
                return res
                    .status(405)
                    .json({ error: "Bad Authorization" });
            }
        } catch (error) {
            return res
                .status(500)
                .json({ error: "Internal Server Error" });
        }
    }

    next();
}

// Add endpoints
// endpoints.root(app);
// endpoints.versions(app);
// endpoints.servers(app);

app.get("/", (req, res) => {
    res.json({
        alive: true,
        whitelist: config.whitelist,
        auth: config.auth(),
    });
});

// get routes
app.use('/servers', require('./routes/servers'));
app.use('/versions', require('./routes/versions'));





// investigate maybe not using this as the client 
// GUI is another application
// can be used in develop mode to test the daemon
if (config.client) {
    web.pull().then((done) => {
        web.server(app, express);
    });
}

// API Endpoint to get System Memory
app.get("/systemMemory", (req, res) => {
    config.systemMemory().then((data) => {
        res.json({ memory: data });
    });
});

// API Endpoint to create a new server
app.post("/create-server", (req, res) => {
    if (process.argv.includes("dev")) {
        res.json({
            underConstruction: "true",
            debugActivated: "true",
        });
    } else {
        res.json({
            underConstruction: "true",
        });
    }
});

// Show the server's IP address
app.listen(port, () => {
    console.log(
        `[X] ------- Daemon running on http://${config.ip()}:${config.port()} ------- [X]`
    );
});