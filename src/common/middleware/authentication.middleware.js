import { findById } from "../../DB/database.repository.js";
import userModel from "../../DB/models/user.model.js";
import { signatureEnum, tokenTypeEnum } from "../utils/enums/user.enum.js";
import { forbiddenException } from "../utils/response/error.response.js";
import { getSignature, verifyToken } from "../utils/tokens/token.js";

export const decodeToken = async ({
  authorization,
  tokenType = tokenTypeEnum.Access,
}) => {
  const [Bearer, token] = authorization.split(" ") || [];
  const signatureLevel =
    Bearer === "ADMIN"
      ? signatureEnum.Admin
      : Bearer === "USER"
        ? signatureEnum.User
        : -1;
  if (signatureLevel === -1) throw new Error("Invalid Bearer token");

  let signature = await getSignature({
    signatureLevel: signatureLevel,
  });

  const decoded = verifyToken({
    token,
    secretKey:
      tokenType === tokenTypeEnum.Access
        ? signature.accessSignature
        : signature.refreshSignature,
  });

  const user = await findById({
    model: userModel,
    id: decoded.id,
  });
  if (!user) throw notFoundException("User not found");
  return { user, decoded };
};

//auth middleware

export const authentication = ({ tokenType = tokenTypeEnum.Access }) => {
  return async (req, res, next) => {
    const { user, decoded } = await decodeToken({
      authorization: req.headers.authorization,
      tokenType,
    });
    req.user = user;
    req.decoded = decoded;
    return next();
  };
};

export const authorization = ({ accessRoles = [] }) => {
  return async (req, res, next) => {
    if (!accessRoles.includes(req.user.role))
      throw forbiddenException({
        message: "You are not authorized to access this resource",
      });
    return next();
  };
};