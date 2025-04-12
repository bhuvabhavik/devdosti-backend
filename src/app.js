// Importing the express module (Express is a Node.js web framework)
const express = require("express");

// Creating an express application (this will be our main server instance)
const app = express(); 

// -----------------------------------------------
// ROUTES
// -----------------------------------------------

// This route will handle GET requests sent to "/test"
// Example: http://localhost:3000/test
app.use("/test", (req, res) => { 
    res.send("Hello from server"); // Sends plain text response to client
});

// This route will handle GET requests sent to "/hello"
// Example: http://localhost:3000/hello
app.use("/hello", (req, res) => { 
    res.send("Hello server, kem choo?"); // Fun greeting in Gujarati 😉
});

// This is the default or fallback route
// If no above routes match, this one will respond
// Example: http://localhost:3000/
app.use("/", (req, res) => { 
    res.send("Hello from default"); 
});

// -----------------------------------------------
// Starting the server on port 3000
// -----------------------------------------------
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});

/* 
===================================================================================

===================================================================================

1️⃣ What are dependencies?
---------------------------------
Dependencies are the external Node.js modules (libraries) your project needs to work.
For example: express, mongoose, bcrypt, etc.
They are installed using npm and listed in your package.json file.
Example: "express": "^4.18.2"

📦 They're stored in the node_modules folder.

2️⃣ What is the use of "-g" while npm install?
-----------------------------------------------------
"-g" stands for "global".
When you run: npm install -g <package-name>
That package is installed globally (available system-wide), not just for one project.

Use cases:
- nodemon
- create-react-app
- eslint

✅ Global packages are usually CLI tools you use from terminal.

3️⃣ Difference between caret (^) and tilde (~) in package.json?
----------------------------------------------------------------------
- ^ (Caret): Accept updates that do **not change the first major version**.
  👉 Example: ^1.2.3 will allow 1.3.0, 1.4.0 ... but **not 2.0.0**

- ~ (Tilde): Accept updates that do **not change the minor version**.
  👉 Example: ~1.2.3 will allow only patch updates: 1.2.4, 1.2.5 ... but **not 1.3.0**

🎯 Caret (^) is more flexible, Tilde (~) is more safe and controlled.

===================================================================================
*/