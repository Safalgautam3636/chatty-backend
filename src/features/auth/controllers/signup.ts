
import { UserCache } from './../../../shared/services/redis/user.cache';
import HTTP_STATUS from 'http-status-codes';
import { IAuthDocument, ISignupData } from 'src/features/auth/interfaces/auth.interface';
import { ObjectId } from 'mongodb';
import { Request, Response } from "express";
import { joiValidation } from "src/shared/globals/decorators/joi-validation.decorators";
import { signinSchema } from "../schemes/signin";
import { authService } from "src/shared/services/db/auth.services";
import { BadRequestError } from "src/shared/globals/helpers/errorHandler";
import { Helpers } from 'src/shared/globals/helpers/helpers';
import { UploadApiResponse } from 'cloudinary';
import { upload } from 'src/shared/globals/helpers/cloudinary-upload';
import { signupSchema } from '../schemes/signup';
import { IUserDocument } from 'src/features/user/interfaces/user.interface';
import { omit } from 'lodash';
import { authQueue } from 'auth.queues';
import { userQueue } from 'src/shared/services/queues/user.queue';
import JWT from 'jsonwebtoken';
import { config } from 'src/config';

const userCache: UserCache = new UserCache();

export class SignUp {
    @joiValidation(signupSchema)
    public async create(req: Request, res: Response): Promise<void> {
        // res.send({ "message": 12 });
        // res.end();
        console.log(req.body)
        const { username, email, password, avatarColor, avatarImage } = req.body;
        const checkIfUserExists: IAuthDocument = await authService.getUserByUsernameOrEmail(username, email);
        if (checkIfUserExists) {
            throw new BadRequestError("Invalid Credentials");
        }
        const authObjectId: ObjectId = new ObjectId();
        const userObjectId: ObjectId = new ObjectId();
        const uId = `${Helpers.generateRandomIntegers(12)}`;
        const authData: IAuthDocument = SignUp.prototype.signupData({
            _id: authObjectId,
            uId,
            username,
            email,
            password,
            avatarColor
        });
        // console.log(authData)
        const result: UploadApiResponse = await upload(avatarImage, `${userObjectId}`, true, true) as UploadApiResponse;
        // console.log(result)
        if (!result?.public_id) {
            throw new BadRequestError("File upload: Error Occured try again");
        }
        //Add to redis cache
        const userDataForCache: IUserDocument = SignUp.prototype.userData(authData, userObjectId);
        userDataForCache.profilePicture = `https://res.cloudinary.com/dcuto5nt6/image/upload/v${result.version}/${userObjectId}`;
        await userCache.saveUserToCache(`${userObjectId}`, uId, userDataForCache)

        //add to mongodb db
        const userResult=omit(userDataForCache, ["uId", "username", "email", "avatarColor", "password"]);
        authQueue.addAuthUserJob('addAuthUserToDB', { value: authData });
        userQueue.addUserJob('addUserToDB', { value: userResult })

        const userJwt: string = SignUp.prototype.signToken(authData, userObjectId);
        req.session = { jwt: userJwt };
        res.status(HTTP_STATUS.CREATED).json({ "message": "User Created sucessfully!", user: userDataForCache, token: userJwt });
    }
    private signToken(data: IAuthDocument, userObjectId: ObjectId): string {
        return JWT.sign({
            userId: userObjectId,
            uId: data.uId,
            email: data.email,
            username: data.username,
            avatarColor: data.avatarColor
        },
            config.JWT_TOKEN!);
    }
    private signupData(data: ISignupData): IAuthDocument {
        const { username, _id, uId, email, password, avatarColor } = data;
        const signupData: IAuthDocument = {
            _id,
            uId,
            username,
            email,
            password,
            avatarColor,
            createdAt: new Date()
        } as IAuthDocument;
        return signupData;
    }
    private userData(data: IAuthDocument, userObjectId: ObjectId): IUserDocument {
        const { _id, username, email, uId, password, avatarColor } = data;
        return {
            _id: userObjectId,
            authId: _id,
            uId,
            username: Helpers.firstLetterUpperCase(username),
            email,
            password,
            avatarColor,
            profilePicture: '',
            blocked: [],
            blockedBy: [],
            work: '',
            location: '',
            school: '',
            quote: '',
            bgImageId: '',
            followersCount: 0,
            followingCount: 0,
            postsCount: 0,
            notifications: {
                messages: true,
                reactions: true,
                comments: true,
                follows: true
            },
            social: {
                facebook: '',
                instagram: '',
                twitter: '',
                youtube: ''
            }
        } as unknown as IUserDocument
    }
}