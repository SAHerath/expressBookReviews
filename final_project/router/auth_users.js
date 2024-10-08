const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  let userswithsamename = users.filter((user) => {
    return user.username === username;
  });

  if (userswithsamename.length > 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username,password) => {
  let validusers = users.filter((user) => {
    return (user.username === username && user.password === password);
  });

  if (validusers.length > 0) {
    return true;
  } else {
    return false;
  }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;
  if (!username || !password) {
    return res.status(404).json({ message: "Error logging in" });
  }
  if (authenticatedUser(username, password)) {
    // Generate JWT access token
    let accessToken = jwt.sign({
        data: password
    }, 'access', { expiresIn: 60 * 60 });

    // Store access token and username in session
    req.session.authorization = {
        accessToken, username
    }
    return res.status(200).json({ message: "User successfully logged in"});
  } else {
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }

});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const bookNum = req.params.isbn;

  let bookReview = books[bookNum].reviews;

  let username = req.body.username;
  let review = req.body.review;

  if(username && (username == req.session.authorization.username)) {
    bookReview[username] = review;
    // console.log(req.session.authorization.username);
    console.log(books[bookNum]);
    return res.status(200).json({ message: "User review updated"});
  } else {
    return res.status(208).json({ message: "Invalid username" });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const bookNum = req.params.isbn;
  let username = req.body.username;
  if(username && (username == req.session.authorization.username)) {
    delete books[bookNum].reviews[username];
    console.log(books[bookNum]);
    return res.status(200).json({ message: "User review deleted"});
  } else {
    return res.status(208).json({ message: "Invalid username" });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
