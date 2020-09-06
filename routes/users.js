const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET users li ssting. */
router.get('/', async function(req, res, next) {
  const { data } = await axios.get('http://localhost:3000/users');
  res.json(data);
  // res.json([]);
  // return axios
  //   .get('http://localhost:3000/users')
  //   .then(response => res.json(response))
});

module.exports = router;
