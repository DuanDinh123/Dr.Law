import fs from "fs";
import path from "path";

import { roles } from "~/constant/roles";
import { templateCheckPermission } from "~/constant/template-check-permission";

export const generateMiddleware = () => {
    for (const role of roles) {
        fs.rm(path.join(__dirname, "..", `middleware/${role.folderName}`), { recursive: true, force: true }, (err) => {
            if (err) { throw err; }
            fs.mkdir(path.join(__dirname, "..", `middleware/${role.folderName}`), (err) => {
                if (err) { throw err; }
                for (const permission of role.permissions) {
                    fs.appendFile(`${path.join(__dirname, "..", `middleware/${role.folderName}`)}/${permission}.middleware.js`, templateCheckPermission(permission), (err) => {
                        if (err) { throw err; }
                    });
                }
            });
        });
    }
};
