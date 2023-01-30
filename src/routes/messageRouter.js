const router = require("express").Router()

const messageCtrl = require("../controller/messageCtrl")

const auth = require("../middleware/authMiddleware")

router.post("/", messageCtrl.addMessage)
router.get("/:chatId", messageCtrl.getMessages)
router.delete("/:messageId", auth, messageCtrl.deleteMessage)

module.exports = router