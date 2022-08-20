const router = require("express").Router();
const notificationCtrl = require("../controller/notificationCtrl");
const auth = require("../middlewares/auth");

router.route("/create").get(auth, notificationCtrl.createNotification);


module.exports = router;
