const router = require('express').Router()
const statusCtrl = require('../controller/statusCtrl')
const auth = require('../middlewares/auth')

router.route('/').post(auth, statusCtrl.createStatus)
router.route('/:statusId').delete(auth, statusCtrl.deleteStatus)
router.route('/').get(auth, statusCtrl.getUserStatus)


module.exports = router