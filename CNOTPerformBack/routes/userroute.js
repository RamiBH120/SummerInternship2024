const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const {uploadCert,uploadImgUser} = require("../utils/ImageUpload");

router.get("/",userController.getAllUsers );

router.get("/getUserById/:id",userController.getUserbyId );

router.get("/getWaitList",userController.getWaitList);

router.post("/signup", userController.signup);
router.post("/add", userController.addAdmin);

router.post("/signin", userController.signin);

router.put("/update/:id",userController.updateUser);

router.delete("/delete/:id",userController.deleteUser);

router.put("/confirm/:userId", userController.confirmUser);

router.put("/refuse/:userId",userController.refuseUser);
router.get('/getuser-by-email/:email', userController.getUserByEmail);
router.get("/getUserWaiting/:id",userController.getUserWaiting);
router.get('/profile', userController.getUserProfile);
router.put("/user/profile-image/:userId", uploadImgUser, userController.updateUserImage);
router.put('/update-password/:userId', userController.updatePassword);
router.get("/getRoleF",userController.getUsersWithRoleF );
router.get("/getRoleMC",userController.getUsersWithRoleMC );
router.get("/getNameF",userController.getUsersNameF);
router.put("/block/:id", userController.blockUser);
router.put("/unblock/:id",userController.unBlockUser);
router.get("/search/:name", userController.getUsersByName); 
router.post('/unblock', userController.unBlockUserAccount);
module.exports = router;