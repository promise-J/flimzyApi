const router = require('express').Router()
const userCtrl = require('../controller/userCtrl')
const auth = require('../middlewares/auth')

router.route('/register').post(userCtrl.register)
router.route('/login').post(userCtrl.login)
router.route('/getUser').get(auth, userCtrl.getUser)
router.route('/updateUser').put(auth, userCtrl.updateUser)
router.route('/sendRequest/:userId').put(auth, userCtrl.sendFriendRequest)
router.route('/rejectRequest/:userId').put(auth, userCtrl.removeFriendRequest)
router.route('/populate/friend/:userId').put(auth, userCtrl.populateFriendList)
router.route('/get/request').get(auth, userCtrl.getFriendRequest)
router.route('/getUsers').get(auth, userCtrl.getUsers)
router.route('/logout').get(userCtrl.logout)

module.exports = router