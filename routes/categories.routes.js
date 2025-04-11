const { addNewCategory, findAllCategories, findCategoryById, deleteCategoryById, updateCategoryById } = require("../controllers/categories.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const roleGuard = require("../middleware/guards/role.guard");

const router = require("express").Router();

router.post("/",adminGuard, addNewCategory);
router.get("/", adminGuard, findAllCategories);
router.get("/:id",adminGuard, findCategoryById); 
router.delete("/:id",adminGuard, deleteCategoryById);
router.put("/:id",adminGuard, updateCategoryById);

module.exports = router;
