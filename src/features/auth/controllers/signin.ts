import HTTP_STATUS  from 'http-status-codes';
import { Request,Response,NextFunction } from "express";
import { config } from "src/config";
import JWT from 'jsonwebtoken';
import { joiValidation } from "src/shared/globals/decorators/joi-validation.decorators";
import { authService } from 'src/shared/services/db/auth.services';
import { BadRequestError } from 'src/shared/globals/helpers/errorHandler';
import { signinSchema } from '../schemes/signin';
import { IAuthDocument } from '../interfaces/auth.interface';
import { IUserDocument } from 'src/features/user/interfaces/user.interface';
import { userService } from 'src/shared/services/db/user.service';



export class SignIn{
    @joiValidation(signinSchema)
    public async read(req: Request, res: Response):Promise<void> {
        const { username, password } = req.body;
        const checkIfUserExists: IAuthDocument = await authService.getAuthUserByUsername(username);
        console.log(checkIfUserExists)
        if (!checkIfUserExists) {
            throw new BadRequestError("Invalid Credentials")
        }
        const passwordMatch: boolean = await checkIfUserExists.comparePassword(password);
        console.log(passwordMatch)
        if (!passwordMatch) {
            throw new BadRequestError("Invalid Credentials!");
        }

        const user: IUserDocument = await userService.getUserByAuthId(`${checkIfUserExists._id}`);
        console.log(user)
        const userJwt: string = JWT.sign({
            userId: user._id,
            uId: checkIfUserExists.uId,
            email: checkIfUserExists.email,
            username: checkIfUserExists.username,
            avatarColor: checkIfUserExists.avatarColor
        }, config.JWT_TOKEN!);
        req.session = {
            jwt:userJwt
        };
        res.status(HTTP_STATUS.OK).json({
            message: "User logged sucessfully",
            user: checkIfUserExists,
            token:userJwt
        })
    }
}