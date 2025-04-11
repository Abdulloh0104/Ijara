const {
  addNewProduct,
  findAllProducts,
  findProductById,
  deleteProductById,
  updateProductById,
} = require("../controllers/products.controller");
const ownerGuard = require("../middleware/guards/owner.guard");
const roleGuard = require("../middleware/guards/role.guard");

const router = require("express").Router();

router.post("/",ownerGuard, roleGuard(["owner"]), addNewProduct); //ownerGuard,
router.get("/", findAllProducts); //userGuard,userAdminGuard,
router.get("/:id",ownerGuard, findProductById); //ownerGuard, roleGuard(["owner"]),
router.delete("/:id",ownerGuard, deleteProductById); //ownerGuard,
router.put("/:id",ownerGuard, updateProductById); //ownerGuard,

module.exports = router;
