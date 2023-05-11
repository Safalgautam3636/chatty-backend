import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

export function upload(file: string, public_id?: string, overwrite?: boolean,
    invalidate?: boolean): Promise<UploadApiErrorResponse | UploadApiResponse | undefined> {
    return new Promise((resolve) => {
        cloudinary.v2.uploader.upload(file, { public_id, overwrite, invalidate },
            (error: UploadApiErrorResponse | undefined, result: UploadApiResponse|undefined)=>{
                if(error){
                    resolve(error);
                }
                if (result) {
                    resolve(result);
                }
        })
    })
}

//another way
// import cloudinary, { UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

// export async function upload(file: string, public_id?: string, overwrite?: boolean, invalidate?: boolean): Promise<UploadApiErrorResponse | UploadApiResponse | undefined> {
//     try {
//         const result = await cloudinary.v2.uploader.upload(file, { public_id, overwrite, invalidate });
//         return result;
//     } catch (error) {
//         return error;
//     }
// }
