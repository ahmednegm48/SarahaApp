import {SALT_ROUNDS} from "../../../config/config.service.js"
import { hashEnum } from "../enums/security.enum.js"
import {compare, hash} from 'bcrypt';
import * as argon2 from 'argon2'
import {badRequestException} from "../response/error.response.js"

export const generateHash = async ({
    plaintext,
    SaltRounds = Number(SALT_ROUNDS),
    algorithm = hashEnum.Bcrypt
})=>{
    let hashResult = "";

    switch(algorithm){
        case hashEnum.Bcrypt:
            hashResult = await hash(plaintext,SaltRounds);
            break;
        case hashEnum.Argon2:
            hashResult = await argon2.hash(plaintext);
            break;
        default:
            throw badRequestException("Unsupported hashing algorithm");
    }
    return hashResult;
};

export const compareHash = async ({
    plaintext,
    ciphertext,
    algorithm = hashEnum.Bcrypt
})=>{
    let match = false;

    switch(algorithm){
        case hashEnum.Bcrypt:
            match = await compare(plaintext,ciphertext);
            break;
        case hashEnum.Argon2:
            match = await argon2.verify(ciphertext,plaintext);
            break;
        default:
            throw badRequestException("Unsupported hashing algorithm");
    }
    return match;
};