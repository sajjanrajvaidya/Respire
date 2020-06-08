const express = require('express');
const path = require('path');
const app = express();

const port = 8080;

const router = express.Router();

app
  .use(express.json())
  .use(express.urlencoded({ extended: true }))
  .use(express.static(path.join(__dirname, '../public')))
  .use('/', router)
  .listen(port, () => {
    console.log(`Server is listening on port: ${ port }`);
  })

router.get('/getArtist', (req, res) => {
  const { name } = req.query;






  res.end();
})