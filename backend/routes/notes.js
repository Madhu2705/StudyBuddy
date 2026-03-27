const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controller/notesController");

router.post("/", auth, controller.createNotes);
router.get("/", auth, controller.getNotes);
router.put("/:id", auth, controller.updateNotes);
router.delete("/:id", auth, controller.deleteNotes);

module.exports = router;
