const router = require('express').Router()
const chatCtrl = require('../controller/chatCtrl')
const auth = require('../middlewares/auth')

router.route('/:userId').get(auth, chatCtrl.accessChat)
router.route('/chat/:chatId').get(auth, chatCtrl.getSingleChat)
router.route('/messages/:chatId').get(auth, chatCtrl.getChatMessages)
router.route('/').get(auth, chatCtrl.userChats)
router.route('/group').post(auth, chatCtrl.createGroup)
router.route('/renamegroup/:chatId').put(auth, chatCtrl.renameGroup)
router.route('/addtogroup/:chatId').put(auth, chatCtrl.addToGroup)
router.route('/removefromgroup/:chatId').put(auth, chatCtrl.removeFromGroup)
router.route('/removegroup/:chatId').delete(auth, chatCtrl.removeGroup)
router.route('/:chatId').delete(auth, chatCtrl.removeGroup)

module.exports = router