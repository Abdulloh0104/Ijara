const {
  addNewProduct,
  findAllProducts,
  findProductById,
  deleteProductById,
  updateProductById,
} = require("../controllers/products.controller");
const adminGuard = require("../middleware/guards/admin.guard");
const roleGuard = require("../middleware/guards/role.guard");

const router = require("express").Router();

router.post("/", roleGuard(["owner"]), addNewProduct); //ownerGuard,
router.get("/", findAllProducts); //userGuard,userAdminGuard,
router.get("/:id", findProductById); //ownerGuard, roleGuard(["owner"]),
router.delete("/:id", roleGuard(["owner"]), deleteProductById); //ownerGuard,
router.put("/:id",adminGuard, updateProductById); //ownerGuard,

module.exports = router;
