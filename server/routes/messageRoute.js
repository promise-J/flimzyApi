const messageCtrl = require('../controller/messageCtrl')
const auth = require('../middlewares/auth')

const router = require('express').Router()

router.route('/').post(auth, messageCtrl.createMessage)
router.route('/:chatId').get(auth, messageCtrl.fetchChats)
router.route('/:id').put(auth, messageCtrl.editMessage)
router.route('/delete').post(auth, messageCtrl.deleteMessage)

module.exports = router