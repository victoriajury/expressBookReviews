const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
    return !users.some(user => user.username === username);
}

const authenticatedUser = (username,password)=>{ //returns boolean
    return users.some(user => user.username === username && user.password === password);
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ message: "Username and password is required." });
        }

        if (!authenticatedUser(username, password)) {
            return res.status(401).json({ message: "Invalid username or password." });
        }

        // Verify JWT token
        const token = jwt.sign({ username }, "access", { expiresIn: "1h" });
        req.session.authorization = { token, username };
        return res.status(200).json({ message: "Successful login" });
        
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
