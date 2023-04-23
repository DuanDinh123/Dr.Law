export const paginateOptions = (input) => ({
        ...input.page && { page: input.page },
        ...input.limit && { limit: input.limit },
        ...input.offset && { offset: input.offset },
        ...input.pagination === "false" && { pagination: false },
        ...input.fieldSort && input.sortValue && { sort: { [input.fieldSort]: input.sortValue } },
    });