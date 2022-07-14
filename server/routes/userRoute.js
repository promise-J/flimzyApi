const router = require('express').Router()
const userCtrl = require('../controller/userCtrl')
const auth = require('../middlewares/auth')

router.route('/register').post(userCtrl.register)
router.route('/login').post(userCtrl.login)
router.route('/getUser').get(auth, userCtrl.getUser)
router.route('/getUsers').get(auth, userCtrl.getUsers)
router.route('/logout').get(userCtrl.logout)

module.exports = router