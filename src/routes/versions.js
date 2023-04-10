const express = require("express");
const serverVersions = require("../helpers/versions.js");

const router = express.Router();


const validSoftware = ["vanilla"];

// API Endpoint to get MC Server Versions
router.get("/", (req, res) => {
    let software = req.query?.software;
    if (!validSoftware.includes(software)) 
        return res.json({ error: "Invalid type" });
    serverVersions
        .getVersionList(software)
        .then((versions) => {
            res.json(versions);
        });
});

// API Endpoint to get latest MC Server Version
router.get("/latest", (req, res) => {
    let software = req.query?.software;
    if (!validSoftware.includes(software)) 
        return res.json({ error: "Invalid software" });
    
    serverVersions
        .getVersionList(software)
        .then((versions) => {
            res.json(versions[0]);
        });
});

// API Endpoint to get specific MC Server Version
router.get("/version", (req, res) => {
    let software = req.query?.software;
    if (!validSoftware.includes(software)) 
        return res.json({ error: "Invalid software" });

    serverVersions
        .getVersion(software, req.query.version)
        .then((versions) => {
            res.json(versions);
        });
});

// API Endpoint to get MC Server Versions
router.get("/download", (req, res) => {
    let software = req.query?.software;
    if (!validSoftware.includes(software)) 
        return res.json({ error: "Invalid software" });

    serverVersions
        .getVersionDownload(software, req.query.version)
        .then((url) => {
            res.json({ id: req.query.version, url: url });
        });
});


module.exports = router;
