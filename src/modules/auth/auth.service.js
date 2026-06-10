import {findOne , createOne} from "../../DB/database.repository.js"
import userModel from "../../DB/models/user.model.js"
import {notFoundException , conflictException, badRequestException} from "../../common/utils/response/error.response.js"
import {successResponse} from "../../common/utils/response/success.response.js"
import { generateHash,compareHash } from "../../common/utils/security/hash.security.js"
import { hashEnum } from "../../common/utils/enums/security.enum.js"

export const signup = async (req , res) =>{
    const {username,email,password} = req.body;

    if(await findOne({
        model:userModel,
        filter:{email}
    })){
        throw conflictException({message:"User already exists"});
    }

    const hashedPassword = await generateHash({plaintext : password,algorithm:hashEnum.Argon2})

    const user = await createOne({
        model : userModel,
        data:{username,email,password:hashedPassword},
    });

    successResponse({res,statusCode:201,message:"User creared successfully",data:{user}})
}

export const login = async (req , res) =>{
    const {email,password} = req.body;
    const user = await findOne({
        model:userModel,
        filter:{email},
    })

    if(!user){
        throw conflictException({message:"User not found"});
    }

    const isMatch = await compareHash({
        plaintext: password,
        ciphertext:user.password,
        algorithm:hashEnum.Argon2
    });
    if(!isMatch) throw badRequestException({message:"invalid credentials"})

    successResponse({res,statusCode:200,message:"User logged in successfully",data:{user}})
}