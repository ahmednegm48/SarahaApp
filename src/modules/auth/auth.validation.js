import joi from "joi";
import { Types } from "mongoose";

export const signupSchema = joi.object({
  firstName: joi.string().min(2).max(25).required().messages({
    "any.required": "First Name is required",
    "string.min": "First Name must be at least 2 character long",
    "string.max": "First Name must be at most 25 character long",
  }),
  lastName: joi.string().min(2).max(25).required().messages({
    "any.required": "Last Name is required",
    "string.min": "Last Name must be at least 2 character long",
    "string.max": "Last Name must be at most 25 character long",
  }),
  username: joi.string().min(2).max(25).alphanum().required(),
  email: joi
    .string()
    .email({
      minDomainSegments: 2,
      maxDomainSegments: 5,
      tlds: { allow: ["com", "net", "org"] },
    })
    .required(),
  password: joi.string().required(),
  confirmPassword: joi.ref("password"),
  DOB: joi.string().isoDate(),
  confirmEmail:joi.string().isoDate(),
  phone: joi.string().pattern(/^(\+20|020|0)?1[0125][0-9]{8}$/), //egyption phone numbers format
  /*id: joi.string().custom((value,helper)=>{
    return (Types.ObjectId.isvalid(value) || helper.message("Invalid ObjecID Format"));
    }),*/
  gender: joi.string().valid(...Object.values(genderEnum)),
  role: joi.string().valid(...Object.values(roleEnum)),
  provider: joi.string().valid(...Object.values(providerEnum)),
  profilePic: joi.string(),
  coverPictures: joi.array().items(joi.string()),
});
