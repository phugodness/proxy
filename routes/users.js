const express = require('express');
const axios = require('axios');
const router = express.Router();

/* GET users lissting. */
router.get('/', async function (req, res, next) {
  try {
    console.log('aaa');
    const { data } = await axios.get('http://backend:3000/users');
    return res.json(data);
  } catch (error) {
    console.log(error);
    res.json([{ error: 'not found' }]);
  }
});

module.exports = router;
