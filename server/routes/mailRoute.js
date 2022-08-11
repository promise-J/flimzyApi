const mailCtrl = require('../controller/mailCtrl')
const auth = require('../middlewares/auth')

const router = require('express').Router()

router.route('/').post(auth, mailCtrl.messageMail)
router.route('/enquiry').post(mailCtrl.messageMail)

module.exports = router