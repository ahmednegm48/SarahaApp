import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_USER_SECRET } from "../../config/config.service.js";
import { notFoundException } from "../../common/utils/response/error.response.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import { findById } from "../../DB/database.repository.js";
import { decrypt } from "../../common/utils/security/encryption.security.js";
import userModel from "../../DB/models/user.model.js";

export const getProfile = async (req, res) => {
    if(req.user.phone) req.user.phone = decrypt(req.user.phone);
  successResponse({
    res,
    statusCode: 200,
    message: "User profile fetched successfully",
    data: { ...req.user },
  });
}