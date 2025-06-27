// user.route.js
import { Router } from "express";
import { 
  loginUser, 
  registerUser, 
  check,
  getAllUsers
} from "../controllers/user.controller.js";

const router = Router();
router.route("/").get(getAllUsers);
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/check").get(check);

export default router;