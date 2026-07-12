import { findOne, createOne } from "../../DB/database.repository.js";
import userModel from "../../DB/models/user.model.js";
import {
  notFoundException,
  conflictException,
  badRequestException,
} from "../../common/utils/response/error.response.js";
import { successResponse } from "../../common/utils/response/success.response.js";
import {
  generateHash,
  compareHash,
} from "../../common/utils/security/hash.security.js";
import { hashEnum } from "../../common/utils/enums/security.enum.js";
import { encrypt } from "../../common/utils/security/encryption.security.js";
import jwt from "jsonwebtoken";
import {
  ACCESS_TOKEN_USER_SECRET,
  ACCESS_TOKEN_USER_EXPIRATION,
  GOOGLE_CLIENT_ID,
} from "../../config/config.service.js";
import {
  generateToken,
  getNewCredentials,
  newAccessToken,
} from "../../common/utils/tokens/token.js";
import { OAuth2Client } from "google-auth-library";
import { providerEnum } from "../../common/utils/enums/user.enum.js";

export const signup = async (req, res) => {
  const { username, email, password, phone } = req.body;

  if (
    await findOne({
      model: userModel,
      filter: { email },
    })
  ) {
    throw conflictException({ message: "User already exists" });
  }

  const hashedPassword = await generateHash({
    plaintext: password,
    algorithm: hashEnum.Argon2,
  });

  const encrypedPhone = encrypt(phone);

  const user = await createOne({
    model: userModel,
    data: { username, email, password: hashedPassword, phone: encrypedPhone },
  });

  successResponse({
    res,
    statusCode: 201,
    message: "User creared successfully",
    data: { user },
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await findOne({
    model: userModel,
    filter: { email },
  });

  if (!user) {
    throw conflictException({ message: "User not found" });
  }

  const isMatch = await compareHash({
    plaintext: password,
    ciphertext: user.password,
    algorithm: hashEnum.Argon2,
  });
  if (!isMatch) throw badRequestException({ message: "invalid credentials" });

  // const accessToken = generateToken({payload:{id:user._id}, secretKey:ACCESS_TOKEN_USER_SECRET});
  // const refreshToken = generateToken({payload:{id:user._id}, secretKey:REFRESH_TOKEN_USER_SECRET});

  const tokens = await getNewCredentials(user);

  successResponse({
    res,
    statusCode: 200,
    message: "User logged in successfully",
    data: { tokens },
  });
};

export const refreshToken = async (req, res) => {
  const tokens = await newAccessToken(req.user);
  successResponse({
    res,
    statusCode: 200,
    message: "Tokens refreshed successfully",
    data: { tokens },
  });
};

async function verifyGoogleToken(idToken) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: GOOGLE_CLIENT_ID, // Specify the GOOGLE_CLIENT_ID of the app that accesses the backend
    // Or, if multiple clients access the backend:
    //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
  });
  const payload = ticket.getPayload();

  return payload;
}

export const loginWithGoogle = async (req, res) => {
  const { idToken } = req.body;
  const { email, email_verified, given_name, family_name , picture } =
    await verifyGoogleToken(idToken);
  if(!email_verified) throw badRequestException({message:"Email not verified"});
  const user = await findOne({
    model: userModel,
    filter: { email },
  });
  if(user){
    if(user.provider !== providerEnum.Google){
      throw badRequestException({message:"Email already registered with a different provider"});
    }
    const tokens = await getNewCredentials(user);
    return successResponse({
      res,
      statusCode: 200,
      message: "User logged in successfully",
      data: { tokens },
    });
  }

  const newUser = await createOne({
    model: userModel,
    data: {
      firstName: given_name,
      lastName: family_name,
      email,
      provider: providerEnum.Google,
      profilePic: picture
    }
  });
  const tokens = await getNewCredentials(newUser);
  successResponse({
    res,
    statusCode: 201,
    message: "User logged in successfully",
    data: { tokens },
  });
};
