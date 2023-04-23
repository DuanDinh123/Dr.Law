import { paginateOptions } from "~/config/paginate";
import { error_500 } from "~/constant/error-handle";

import Supplie from "../supplie/supplie.model";
import Category from "./category.model";

class CategoryService {
    async createCategory(userId, input) {
        try {
            const { name, status, slug, description } = input;
            if (!name || !slug) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [
                        ... !name ? [{
                          fieldError: "name",
                          message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : [],
                        ... !slug ? [{
                          fieldError: "slug",
                          message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : []
                      ]
                };
            }
            const isExistSlugCategory = await Category.findOne({ slug });
            if (isExistSlugCategory) {
                return {
                    code: 400,
                    isValidate: false,
                    errors: [{
                        fieldError: "slug",
                        message: "Mã Slug đã tồn tại trong hệ thống!"
                      }]
                };
            }
            const category = new Category({
                created_at: Date.now(),
                created_by: userId,
                updated_by: userId,
                name,
                ...status && { status },
                slug,
                ...description && { description },
            });
            const result = await category.save().then(category => category.populate([
                {
                    path: "created_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "updated_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "supplies"
                }
            ]));
            return {
                code: 200,
                result
            };
        } catch (error) {
            return error_500();
        }
    }

    async deleteCategory(id) {
        try {
            const result = await Category.findByIdAndDelete({ _id: id });
            if (result) {
                return {
                    code: 200,
                    result,
                };
            }
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy danh mục!"
            };
        } catch (error) {
            return error_500();
        }
    }

    async getCategory(id) {
        try {
            const result = await Category.findById(id).populate([
                {
                    path: "created_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "updated_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "supplies"
                }
            ]);
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
            return {
                code: 404,
                message: "Không tìm thấy danh mục!"
            };
        } catch (error) {
            return error_500();
        }
    }

    async getCategories(input) {
        try {
            const result = await Category.paginate({
                // write more filter with condition here.
                $or: [
                    { name: { $regex: new RegExp(input.search), $options: "i" } },
                    { slug: { $regex: new RegExp(input.search), $options: "i" } },
                  ]
            }, {
                ...paginateOptions(input),
                populate: [
                    {
                        path: "created_by",
                        select: ["_id", "name", "email"],
                    },
                    {
                        path: "updated_by",
                        select: ["_id", "name", "email"],
                    },
                    {
                        path: "supplies"
                    }
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

    async updateCategory(userId, id, input) {
        try {
            const { name, status, slug, description } = input;
            const isExistSlugCategory = await Category.findOne({ slug });
            if (isExistSlugCategory) {
                return {
                    code: 400,
                    isValidate: false,
                    errors: [{
                        fieldError: "slug",
                        message: "Mã Slug đã tồn tại trong hệ thống!"
                      }]
                };
            }
            const result = await Category.findByIdAndUpdate(id, {
                updated_by: userId,
                ...name && { name },
                ...status && { status },
                ...slug && { slug },
                ...description && { description }
            }, {
                useFindAndModify: false,
                new: true
            }).then(category => category.populate([
                {
                    path: "created_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "updated_by",
                    select: ["_id", "name", "email"],
                },
                {
                    path: "supplies"
                }
            ]));
            if (result) {
                return {
                    code: 200,
                    result
                };
            }
            return {
                code: 404,
                type: "cate",
                message: "Không tìm thấy danh mục!"
            };
        } catch (error) {
            return error_500();
        }
    }

    async assignSuppliesToCategory(userId, id, input) {
        try {
            const { supplieIds } = input;
            if (!supplieIds) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [
                        ... !supplieIds ? [{
                          fieldError: "supplieIds",
                          message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : []
                    ]
                };
            }
            const category = await Category.findById(id);
            if (category) {
                const supplies = await Supplie.find().where("_id").in(supplieIds).select({ "_id": 1 });
                if (Array.isArray(supplies) && supplies.length && supplies.length === supplieIds.length) {
                    const isSupplieIdsInCategory = await Category.find({ supplies: { $elemMatch: { "$in": supplieIds, "$exists": true } } });
                    if (Array.isArray(isSupplieIdsInCategory) && !isSupplieIdsInCategory.length) {
                        const result = await Category.findByIdAndUpdate(id, { "$push": { "supplies": supplieIds }, updated_by: userId }, { "new": true, "upsert": true }).populate([
                            {
                                path: "created_by",
                                select: ["_id", "name", "email"],
                            },
                            {
                                path: "updated_by",
                                select: ["_id", "name", "email"],
                            },
                            {
                                path: "supplies",
                                populate: {
                                    path: "assets",
                                }
                            }
                        ]);
                        return {
                            code: 200,
                            result
                        };
                    }
                    return {
                        code: 400,
                        isValidate: false,
                        message: "Có vật tư đã tồn tại trong danh mục!"
                    };
                }
                return {
                    code: 400,
                    isValidate: false,
                    message: "Có vật tư không tồn tại!"
                };
            }
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy danh mục!"
            };
        } catch (error) {
            return error_500();
        }
    }

    async removeSuppliesToCategory(userId, id, input) {
        try {
            const { supplieIds } = input;
            if (!supplieIds) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [
                        ... !supplieIds ? [{
                          fieldError: "supplieIds",
                          message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : []
                      ]
                };
            }
            const category = await Category.findById(id);
            if (category) {
                const supplies = await Supplie.find().where("_id").in(supplieIds).select({ "_id": 1 });
                if (Array.isArray(supplies) && supplies.length && supplies.length === supplieIds.length) {
                    const isSupplieIdsInCategory = await Category.find({ supplies: { $elemMatch: { "$in": supplieIds, "$exists": true } } });
                    if (Array.isArray(isSupplieIdsInCategory) && isSupplieIdsInCategory.length) {
                        const result = await Category.findByIdAndUpdate(id, { "$pullAll": { "supplies": supplieIds }, updated_by: userId }, { "new": true, "upsert": true }).populate([
                            {
                                path: "created_by",
                                select: ["_id", "name", "email"],
                            },
                            {
                                path: "updated_by",
                                select: ["_id", "name", "email"],
                            },
                            {
                                path: "supplies",
                                populate: {
                                    path: "assets",
                                }
                            }
                        ]);
                        return {
                            code: 200,
                            result
                        };
                    }
                    return {
                        code: 400,
                        isValidate: false,
                        message: "Có vật tư không tồn tại trong danh mục!"
                    };
                }
                return {
                    code: 400,
                    isValidate: false,
                    message: "Có vật tư không tồn tại!"
                };
            }
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy danh mục!"
            };
        } catch (error) {
            return error_500();
        }
    }

    async assignSupplieToCategory(userId, id, input) {
        try {
            const { supplieId } = input;
            if (!supplieId) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [
                        ... !supplieId ? [{
                          fieldError: "supplieId",
                          message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : []
                      ]
                };
            }
            const category = await Category.findById(id);
            if (category) {
                const supplie = await Supplie.findById(supplieId);
                if (supplie) {
                    const isSupplieIdInCategory = await Category.find({ supplies: { $elemMatch: { "$in": [supplieId], "$exists": true } } });
                    if (Array.isArray(isSupplieIdInCategory) && !isSupplieIdInCategory.length) {
                        const result = await Category.findByIdAndUpdate(id, { "$push": { "supplies": supplieId }, updated_by: userId }, { "new": true, "upsert": true }).populate([
                            {
                                path: "created_by",
                                select: ["_id", "name", "email"],
                            },
                            {
                                path: "updated_by",
                                select: ["_id", "name", "email"],
                            },
                            {
                                path: "supplies",
                                populate: {
                                    path: "assets",
                                }
                            }
                        ]);
                        return {
                            code: 200,
                            result
                        };
                    }
                    return {
                        code: 400,
                        isValidate: false,
                        message: "Vật tư đã tồn tại trong danh mục!"
                    };
                }
                return {
                    code: 400,
                    isValidate: false,
                    message: "Vật tư không tồn tại!"
                };
            }
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy danh mục!"
            };
        } catch (error) {
            return error_500();
        }
    }

    async removeSupplieToCategory(userId, id, input) {
        try {
            const { supplieId } = input;
            if (!supplieId) {
                return {
                    code: 400,
                    isValidate: true,
                    errors: [
                        ... !supplieId ? [{
                          fieldError: "supplieId",
                          message: "Vui lòng nhập đầy đủ dữ liệu!"
                        }] : []
                      ]
                };
            }
            const category = await Category.findById(id);
            if (category) {
                const supplie = await Supplie.findById(supplieId);
                if (supplie) {
                    const isSupplieIdInCategory = await Category.find({ supplies: { $elemMatch: { "$in": [supplieId], "$exists": true } } });
                    if (Array.isArray(isSupplieIdInCategory) && isSupplieIdInCategory.length) {
                        const result = await Category.findByIdAndUpdate(id, { "$pull": { "supplies": supplieId }, updated_by: userId }, { "new": true, "upsert": true }).populate([
                            {
                                path: "created_by",
                                select: ["_id", "name", "email"],
                            },
                            {
                                path: "updated_by",
                                select: ["_id", "name", "email"],
                            },
                            {
                                path: "supplies",
                                populate: {
                                    path: "assets",
                                }
                            }
                        ]);
                        return {
                            code: 200,
                            result
                        };
                    }
                    return {
                        code: 400,
                        isValidate: false,
                        message: "Vật tư không tồn tại trong danh mục!"
                    };
                }
                return {
                    code: 400,
                    isValidate: false,
                    message: "Vật tư không tồn tại!"
                };
            }
            return {
                code: 400,
                isValidate: false,
                message: "Không tìm thấy danh mục!"
            };
        } catch (error) {
            return error_500();
        }
    }
}
export default new CategoryService();