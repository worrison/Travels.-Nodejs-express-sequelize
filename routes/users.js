var express = require('express');
var router = express.Router();
let usersController=require('../controllers/usersController');

/* GET users listing. */
router.get('/', async (req, res) => {
    let users=await usersController.listUsers();
    res.render('../views/users/list',{users});
});

module.exports = router;
