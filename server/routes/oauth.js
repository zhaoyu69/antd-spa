const express = require('express');
const router = express.Router();
const axios = require('axios');

// Fill in your client ID and client secret that you obtained
// while registering the application
const clientID = 'b7f8065ab0c7188c2a21';
const clientSecret = '3cb858d3e80379d5d6ff2f2b70d0296b5a4f0147';

router.get('/redirect', async (req, res, next) => {
    const requestToken = req.query.code;
    console.log('authorization code:', requestToken);

    const tokenResponse = await axios({
        method: 'post',
        url: 'https://github.com/login/oauth/access_token?' +
            `client_id=${clientID}&` +
            `client_secret=${clientSecret}&` +
            `code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    });

    const accessToken = tokenResponse.data.access_token;
    console.log(`access token: ${accessToken}`);

    const result = await axios({
        method: 'get',
        url: `https://api.github.com/user`,
        headers: {
            accept: 'application/json',
            Authorization: `token ${accessToken}`
        }
    });
    console.log(result.data);
    const {name, id} = result.data;

    res.cookie('mspa_user', `{"username":"${name}", "password":"${id}"}`);
    res.redirect(`http://localhost:3000/app`);
});

module.exports = router;
