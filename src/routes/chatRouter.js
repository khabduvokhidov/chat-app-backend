const router = require("express").Router()

const chatCtrl = require("../controller/chatCtrl")

const auth = require("../middleware/authMiddleware")

router.post("/", chatCtrl.createChat)
router.get("/", auth, chatCtrl.userChats)
router.get("/:fristId/:secoundId", chatCtrl.findChat)
router.delete("/:id", auth, chatCtrl.chatDelete)

module.exports = router
