const express = require('express');
const path = require('path');
const app = express();

const port = 8080;

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, '../public')))
  .listen(port, () => {
    console.log(`Server is listening on port: ${ port }`);
  })