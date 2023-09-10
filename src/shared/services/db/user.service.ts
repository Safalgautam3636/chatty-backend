import mongoose from "mongoose";
import { IAuthDocument } from "src/features/auth/interfaces/auth.interface";
import { AuthModel } from "src/features/auth/models/auth.schema";
import { IUser, IUserDocument } from "src/features/user/interfaces/user.interface";
import { UserModel } from "src/features/user/models/user.schema";
import { Helpers } from "src/shared/globals/helpers/helpers";

class UserService {
    public async addUserData(data: IAuthDocument): Promise<void> {
        await UserModel.create(data);

    }
    public async getUserById(userId:string): Promise<IUserDocument>{
        
        const users: IUserDocument[] = await UserModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(userId) } },
            { $lookup: { from: "Auth", localField: "authId", foreignField: "_id", as: "authId" } },
            { $unwind: "$authId" },
            {$project:this.aggregateProject()}
        ]);
        return users[0];
    }
    private aggregateProject() {
        return {
            _id: 1,
            username: "$authId.username",
            uId: "$authId.uId",
            email: "$authId.email",
            avatarColor: "$authId.avatarColor",
            createdAt: "$authId.createdAt",
            postsCount: 1,
            work: 1,
            school: 1,
            quote: 1,
            location: 1,
            blocked: 1,
            blockedBy: 1,
            followersCount: 1,
            followingCount: 1,
            notifications: 1,
            social: 1,
            bgImageVersion: 1,
            bgImageId: 1,
            profilePicture:1,
        }
    }
    public async getUserByAuthId(authId: string): Promise<IUserDocument>{
        const users: IUserDocument[] = await UserModel.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(authId) } },
            { $lookup: { from: 'Auth', localField: 'authId', foreignField: "_id", as: 'authId' } },
            { $unwind: '$authId' },
            { $project: this.aggregateProject() }
        ]);
        return users[0];
    }
}

export const userService: UserService = new UserService();