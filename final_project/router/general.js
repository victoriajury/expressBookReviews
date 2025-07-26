const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    if (!books || Object.keys(books).length === 0) {
        return res.status(404).json({message: "No books found"})
    }
    return res.status(200).json(books)
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    try {
        const isbn = req.params.isbn;
        if (!books[isbn]) {
            return res.status(404).json({ message: `Book with ISBN: ${isbn} not found.` });
        }
        return res.status(200).json(books[isbn])
    
    } catch (err) {
        return res.status(500).json({ message: "Error in request.", error: err });
    }
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    try {
        const author = req.params.author;
        const filterBooksByAuthor = Object.values(books).filter( book => book.author.toLowerCase() === author.toLocaleLowerCase())
        if (!filterBooksByAuthor) {
            return res.status(404).json({ message: `Books by author: ${author} not found.` });
        }
        return res.status(200).json(filterBooksByAuthor)
    
    } catch (err) {
        return res.status(500).json({ message: "Error in request.", error: err });
    }
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    try {
        const title = req.params.title;
        const filterBooksByTitle = Object.values(books).filter( book => book.title.toLowerCase() === title.toLocaleLowerCase())
        if (!filterBooksByTitle) {
            return res.status(404).json({ message: `Book with title: ${title} not found.` });
        }
        return res.status(200).json(filterBooksByTitle)
    
    } catch (err) {
        return res.status(500).json({ message: "Error in request.", error: err });
    }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    try {
        const isbn = req.params.isbn;
        if (!books[isbn]) {
            return res.status(404).json({ message: `Book with ISBN: ${isbn} not found.` });
        }
        const book = books[isbn]
        if (!book.review || Object.keys(book.reviews).length === 0) {
            return res.status(404).json({message: `There are no reviews yet for '${book.title}'`});
        }
        return res.status(200).json(book.reviews);
    
    } catch (err) {
        return res.status(500).json({ message: "Error in request.", error: err });
    }
});

module.exports.general = public_users;
