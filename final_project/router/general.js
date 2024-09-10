const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
      if (!isValid(username)) {
          users.push({"username": username, "password": password});
          return res.status(200).json({message: "User successfully registered. Now you can login"});
      } else {
          return res.status(404).json({message: "User already exists!"});
      }
  }
  return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  return res.send(JSON.stringify(books, null, 4));
  // return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const bookNum = req.params.isbn;
  return res.send(JSON.stringify(books[bookNum], null, 4));
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const bookAuthor = req.params.author;
  const regex = new RegExp(bookAuthor, 'gi');
  let filteredBooks = [];
  Object.values(books).forEach((book) => {
    if(book.author.search(regex) != -1) {
      filteredBooks.push(book);
    }
    // if(book.author == bookAuthor) {
    //   //console.log(index, book);
    //   filteredBooks.push(book);
    // }
  });
  return res.send(JSON.stringify(filteredBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const bookTitle = req.params.title;
  const regex = new RegExp(bookTitle, 'gi');
  let filteredBooks = [];
  Object.values(books).forEach((book) => {
    if(book.title.search(regex) != -1) {
      filteredBooks.push(book);
    }
  });
  return res.send(JSON.stringify(filteredBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const bookNum = req.params.isbn;
  return res.send(JSON.stringify(books[bookNum].reviews, null, 4));
});

module.exports.general = public_users;
