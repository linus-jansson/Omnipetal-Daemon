const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    // get servers from database; return servers to client

    res.status(200).send('Hello World');
});

router.post('/create-server', (req, res) => {

    const { 
        version, // 1.0 , 19.1.4...
        type, // vanilla, modded, paperMc
        // here is also where the initial server properties would be set
        // like max players, difficulty, etc, any unspecified properties 
        // would be set to default

        shouldStartOnCreation // true, false
    } = req.body;
    
    const new_server_object = {
        serverId: 1231231231254,
        serverNick: 'random string ( fluffy bunny)'
    }

    // Create data directory for the server eg /servers/fluffy-bunny-1231231231254

    if (shouldStartOnCreation) {
        // pull the docker image with the correct settings

    }


    // save to sql database

    res.status(201)
        .json({ 
            status: 'success', 
            note: "not implemented", 
            data: new_server_object 
        });
});

router.delete('/delete-server', (req, res) => {
    res.status(200).json({ status: 'success', note: "not implemented" });
});


router.put('/start-server', (req, res) => {
    const { serverId } = req.body;

    res.status(200).json({ status: 'success', note: "not implemented" });
});

router.get('/server-info', (req, res) => {
    // reatrive players online
    // amount of system performance used
    const { serverId } = req.query.serverId;
});

module.exports = router;
