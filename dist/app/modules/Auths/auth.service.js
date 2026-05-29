"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = __importDefault(require("../../../errors/AppError"));
const passwordHelpers_1 = require("../../../helpers/passwordHelpers");
const jwtHelpers_1 = require("../../../helpers/jwtHelpers");
const config_1 = __importDefault(require("../../../config"));
const prisma_1 = require("../../../shared/prisma");
const prisma_2 = require("../../../../generated/prisma");
// LOGIN USER
const loginUser = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    //  extract login information
    // VERIFY USER EXISTENCE
    const user = yield prisma_1.prisma.user.findUnique({
        where: { email: payload.email },
        include: {
            profile: true,
            userPermissions: {
                include: {
                    permission: true,
                },
            },
        },
    });
    // IF NOT EXIST
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, 'User not Found');
    }
    // CHECK USER ALREADY DELETE OR NOT
    // if (user?.is_deleted) {
    //   throw new AppError(httpStatus.FORBIDDEN, 'User Already Delete');
    // }
    // CHECKING IF USER IS BLOCK
    if ((user === null || user === void 0 ? void 0 : user.status) === prisma_2.UserAccountStatus.BLOCKED) {
        throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'User is block');
    }
    // VERIFY PASSWORD MATCH
    if (!(yield passwordHelpers_1.PasswordHelpers.passwordMatch(payload.password, user.password))) {
        throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'Password do not match');
    }
    // GET PERMISSION NAMES
    const permissions = ((_a = user === null || user === void 0 ? void 0 : user.userPermissions) === null || _a === void 0 ? void 0 : _a.map((up) => up.permission.name)) || [];
    // CREATE JWT access_token
    // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
    const { id: user_id, role, password } = user, rest = __rest(user, ["id", "role", "password"]);
    // CREATE access_token
    const accessToken = jwtHelpers_1.JwtHelpers.createToken({ user_id, role, permissions }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    // CREATE refresh_token
    const refreshToken = jwtHelpers_1.JwtHelpers.createToken({ user_id, role, permissions }, config_1.default.jwt.refresh_secret, config_1.default.jwt.refresh_expires_in);
    // DELETE PASSWORD
    if ('password' in user) {
        delete user.password;
    }
    // Attach clean permissions array
    const userWithPermissions = Object.assign(Object.assign({}, user), { permissions });
    return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: userWithPermissions,
    };
});
const refreshToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Invalid token synchronous
    let verifiedToken = null;
    try {
        verifiedToken = jwtHelpers_1.JwtHelpers.verifyToken(token, config_1.default.jwt.refresh_secret);
    }
    catch (error) {
        if (error.name === 'TokenExpiredError') {
            throw new AppError_1.default(http_status_1.default.UNAUTHORIZED, 'JWT token has expired');
        }
        else if (error.name === 'JsonwebTokenError') {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Invalid JWT token');
        }
        else {
            throw new AppError_1.default(http_status_1.default.FORBIDDEN, 'Could not verify JWT token');
        }
    }
    const { user_id } = verifiedToken;
    //
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id: user_id },
        include: {
            userPermissions: {
                include: {
                    permission: true,
                },
            },
        },
    });
    //
    if (!user) {
        throw new AppError_1.default(http_status_1.default.NOT_FOUND, ' User not found');
    }
    const permissions = ((_a = user === null || user === void 0 ? void 0 : user.userPermissions) === null || _a === void 0 ? void 0 : _a.map((up) => up.permission.name)) || [];
    // GENERATE NEW ACCESS TOKEN
    const newAccessToken = jwtHelpers_1.JwtHelpers.createToken({
        user_id,
        role: user === null || user === void 0 ? void 0 : user.role,
        permissions,
    }, config_1.default.jwt.secret, config_1.default.jwt.expires_in);
    //
    return {
        access_token: newAccessToken,
    };
});
exports.AuthServices = {
    loginUser,
    refreshToken,
};
