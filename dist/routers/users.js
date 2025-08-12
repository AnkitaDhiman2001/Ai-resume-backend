"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const users_1 = require("../controllers/users");
const userRouter = (0, express_1.Router)();
userRouter.post('/create-users', users_1.createUsers);
userRouter.post('/login', users_1.login);
exports.default = userRouter;
//# sourceMappingURL=users.js.map