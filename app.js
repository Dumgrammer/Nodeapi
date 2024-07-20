const express = require('express');

const app = express();

app.use((req, res, next) => {
    res.status(200).json({
        message: 'Parang php logic lang din pala'
    })
});
//This would behave like a middleware

module.exports = app