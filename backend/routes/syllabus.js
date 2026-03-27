const router = require("express").Router();
const auth = require("../middleware/auth");
const controller = require("../controller/syllabusController");

router.post("/", auth, controller.addSyllabus);
router.get("/", auth, controller.getSyllabus);
router.put("/:id", auth, controller.updateSyllabus);
router.delete("/:id", auth, controller.deleteSyllabus);

module.exports = router;
