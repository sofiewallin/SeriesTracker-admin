/**
 * Express server.
 * 
 * Sets "dist" as a static directory and makes sure that all 
 * routes in application renders through index.html in dist.
 * 
 * @author: Sofie Wallin
 */

const express = require('express');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/*', function(req, res) {
	res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Sets port and starts server
const port = process.env.PORT || 3040; 
app.listen(port, () => console.log(`Server started. Listening on port ${port}...`));
