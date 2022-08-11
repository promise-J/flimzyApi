const router = require('express').Router()
const uploadImage = require('../middlewares/imgAuth')
const uploadCtrl = require('../controller/imgCtrl')

router.post('/', uploadImage,uploadCtrl.uploadAvatar )
router.post('/delete_avatar', uploadCtrl.deleteAvatar )

module.exports = router