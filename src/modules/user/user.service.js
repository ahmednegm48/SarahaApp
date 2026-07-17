import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_USER_SECRET } from "../../config/config.service.js";
import { notFoundException } from "../../common/utils/response/error.response.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import { findById, findByIdAndUpdate } from "../../DB/database.repository.js";
import { decrypt } from "../../common/utils/security/encryption.security.js";
import userModel from "../../DB/models/user.model.js";

export const getProfile = async (req, res) => {
  const { user } = req;
  if (user.phone) user.phone = decrypt(user.phone);
  successResponse({
    res,
    statusCode: 200,
    message: "User profile fetched successfully",
    data: { user },
  });
};

export const updateProfilePic = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: userModel,
    id: req.user.id,
    update: { profilePic: req.file.finalPath },
  });

  if (!req.file) {
    throw notFoundException("File not found");
  }
  successResponse({
    res,
    statusCode: 200,
    message: "Done, profile picture updated successfully",
    data: { user },
  });
};

export const uploadCoverPics = async (req, res) => {
  const user = await findByIdAndUpdate({
    model: userModel,
    id: req.user.id,
    update: { coverPictures: req.files?.map((file)=> file.finalPath) },
  });
  successResponse({
    res,
    statusCode: 200,
    message: "Done, profile picture updated successfully",
    data: { user },
  });
};
