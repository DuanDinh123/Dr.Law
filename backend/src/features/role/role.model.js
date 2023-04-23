
import _ from "lodash";
import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

import { BaseSchema } from "~/common/model/base.model";
import {roles} from "~/constant/roles";

 // eslint-disable-next-line no-unused-vars
const { deleted_at, ...Base } = BaseSchema;

const RoleSchema = new mongoose.Schema({
    ...Base,
    name: {
        type: String,
        required: true,
        index: { unique: true, sparse: true }
    },
    description: {
        type: String,
    },
    permissions: [{
        type: String,
        enum: ["super-admin",..._.union(roles.map((role) => role.permissions).flat(1))],
    }]
});

RoleSchema.plugin(paginate);
const Role = mongoose.model("Role", RoleSchema);
export default Role;

