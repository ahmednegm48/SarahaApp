import { Router } from "express";
import * as userService from "./user.service.js";
import {
  authentication,
  authorization,
} from "../../common/middleware/authentication.middleware.js";
import { roleEnum, tokenTypeEnum } from "../../common/utils/enums/user.enum.js";
import {
  fileValidation,
  localFileUpload,
} from "../../common/utils/multer/local.multer.js";

const router = Router();

router.get(
  "/profile",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.User, roleEnum.Admin] }),
  userService.getProfile,
);
router.patch(
  "/upload-file",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.User, roleEnum.Admin] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.images],
  }).single("attachments"),
  userService.updateProfilePic,
);

router.patch(
  "/upload-cover-image",
  authentication({ tokenType: tokenTypeEnum.Access }),
  authorization({ accessRoles: [roleEnum.User, roleEnum.Admin] }),
  localFileUpload({
    customPath: "users",
    validation: [...fileValidation.images],
  }).array("attachments",5),
  userService.uploadCoverPics,
);

export default router;
