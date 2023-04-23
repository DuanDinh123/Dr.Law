
import fs from "fs";

import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Asset from "./asset.model";

class AssetService {
    async createAssets(userId, host, files) {
        try {
            if (!files) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [
                        ... !files ? [{
                          fieldError: "file",
                          message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : [],
                
                      ]
                };
            }
            const result = await Promise.all(
                files.map(async (file) => {
                    const asset = new Asset({
                        created_at: Date.now(),
                        name: file.filename,
                        mimetype: file.mimetype,
                        size: file.size,
                        src: host + "/" + file.path,
                        filename: file.filename,
                        created_by: userId
                    });
                    return await asset.save().then(asset => asset.populate({
                        path: "created_by",
                        select: ["_id", "name", "email"],
                    }));
                })
            );
            if (Array.isArray(result) && result.length) {
                return {
                    code: 200,
                    result
                };
            }
        } catch (error) {
            return error_500();
        }
    }

    async deleteAsset(id) {
        try {
            const result = await Asset.findById(id);
            if (result) {
                fs.unlinkSync(`assets/${result.name}`);
                await Asset.deleteOne({ _id: id });
                return {
                    code: 200,
                    result,
                };
            }
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy ảnh để xóa!"
            };
        } catch (error) {
            return error_500();
        }
    }

    async getAsset(id) {
        try {
            const result = await Asset.findById(id).populate([
                {
                    path: "created_by",
                    select: ["_id", "name", "email"],
                },
            ]);
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
            return {
                code: 401,
                isValidate: false,
                message: "Không tìm thấy ảnh để xóa!"
            };

        } catch (error) {
            return error_500();
        }
    }

    async getAssets(input) {
        try {
            const result = await Asset.paginate({
                // write more filter with condition here.
                name: { $regex: new RegExp(input.search) },
            }, {
                ...paginateOptions(input),
                populate: [
                    {
                        path: "created_by",
                        select: ["_id", "name", "email"],
                    },
                ]
            });
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
        } catch (error) {
            return error_500();
        }
    }

}

export default new AssetService();