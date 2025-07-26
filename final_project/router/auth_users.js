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
        const token = jwt.sign({ data: password }, "fingerprint_customer", { expiresIn: 60 * 60 }); 
        req.session.authorization = { token, username };
        return res.status(200).json({ message: "Successful login" });

    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    try {
        const isbn = req.params.isbn;
        const review = req.body.review;
        const username = req.session.authorization?.username;

        if (!books[isbn]) {
            return res.status(404).json({ message: `Book with ISBN: ${isbn} not found.` });
        }
        if (!review) {
            return res.status(400).json({ message: `No review text submitted.` });
        }
        const isModifiedReviewMsg = (books[isbn].reviews[username]) 
            ? "Book review updated successfully: " 
            : "New review added successfully: "; 

        books[isbn].reviews[username] = review;  // use username as the unique key for book reviews
        return res.status(200).json({ message: isModifiedReviewMsg + review});
    
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    try {
        const isbn = req.params.isbn;
        const username = req.session.authorization?.username;

        if (!books[isbn]) {
            return res.status(404).json({ message: `Book with ISBN: ${isbn} not found.` });
        }
        if (!books[isbn].reviews[username]) {
            return res.status(404).json({ message: `No review by this user found.` });
        }

        delete books[isbn].reviews[username];
        return res.status(200).json({ message: `Review by ${username} deleted.`});
    
    } catch (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
