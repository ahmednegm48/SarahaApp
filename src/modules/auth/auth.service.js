import {findOne , createOne} from "../../DB/database.repository.js"
import userModel from "../../DB/models/user.model.js"
import {notFoundException , conflictException} from "../../common/utils/response/error.response.js"
import {successResponse} from "../../common/utils/response/success.response.js"

export const signup = async (req , res) =>{
    const {username,email,password} = req.body;

    if(await findOne({
        model:userModel,
        filter:{email}
    })){
        throw conflictException({message:"User already exists"});
    }

    const user = await createOne({
        model : userModel,
        data:{username,email,password},
    });

    successResponse({res,statusCode:201,message:"User creared successfully",data:{user}})
}

export const login = async (req , res) =>{
    const {email,password} = req.body;
    const user = await findOne({
        model:userModel,
        filter:{email},
        select:"username email firstName lastName"
    })

    if(!user){
        throw conflictException({message:"User not found"});
    }

    successResponse({res,statusCode:200,message:"User logged in successfully",data:{user}})
}