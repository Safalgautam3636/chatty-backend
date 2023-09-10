import { IAuthDocument } from "src/features/auth/interfaces/auth.interface";
import { AuthModel } from "src/features/auth/models/auth.schema";
import { Helpers } from "src/shared/globals/helpers/helpers";

class AuthService{
    public async createAuthUser(data: IAuthDocument): Promise<void>{
        await AuthModel.create(data);
        
    }
    public async getUserByUsernameOrEmail(username:string,email:string):Promise<IAuthDocument>{

        const query = {
            $or: [{ username: Helpers.firstLetterUpperCase(username) },
            { email: Helpers.lowerCase(email) }]
        };
        const user: IAuthDocument = await AuthModel.findOne(query).exec() as IAuthDocument;
        
        return user;

    }
    public async getAuthUserByUsername(username:string ): Promise<IAuthDocument> {

        const query = { username: Helpers.firstLetterUpperCase(username) }
        const user: IAuthDocument = await AuthModel.findOne(query).exec() as IAuthDocument;

        return user;

    }
}

export const authService: AuthService = new AuthService();