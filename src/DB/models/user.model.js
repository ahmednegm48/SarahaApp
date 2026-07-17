import mongoose from 'mongoose';
import {genderEnum,roleEnum,providerEnum} from '../../common/utils/enums/user.enum.js'

const userSchema = new mongoose.Schema({
    firstName : {
        type : String,
        required:[true,"first name is required"],
        minLength:2,
        maxLength:25
    },
    lastName : {
        type : String,
        required:[true,"last name is required"],
        minLength:2,
        maxLength:25
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required: function(){
            return this.provider == providerEnum.System;
        }
    },
    DOB:Date,
    phone:String,
    gender:{
        type:Number,
        emun:Object.values(genderEnum),
        default:genderEnum.Male
    },
    role:{
        type:Number,
        emun:Object.values(roleEnum),
        default:roleEnum.User
    },
    provider:{
        type:Number,
        emun:Object.values(providerEnum),
        default:providerEnum.System
    },
    confirmEmail:Date,
    profilePic : String,
    coverPictures:[String],
},{timestamps:true,toObject : {virtuals:true},toJSON:{virtuals:true}});

userSchema.virtual("username").set(function(value){
    const [firstName , lastName] = value?.split(" ") || [];
    this.set({firstName,lastName});
}).get(function(){
    return this.firstName+ " " + this.lastName;
});

const userModel = mongoose.model("User",userSchema)
export default userModel;