const { addNewCategory, findAllCategories, findCategoryById, deleteCategoryById, updateCategoryById } = require("../controllers/categories.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const roleGuard = require("../middleware/guards/role.guard");

const router = require("express").Router();

router.post("/",adminGuard, addNewCategory);
router.get("/", adminGuard, findAllCategories);
router.get("/:id", findCategoryById); 
router.delete("/:id", deleteCategoryById);
router.put("/:id", updateCategoryById);

module.exports = router;
