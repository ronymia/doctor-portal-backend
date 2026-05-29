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
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedPermissions = seedPermissions;
const prisma_1 = require("../../shared/prisma");
const permission_1 = require("../../enums/permission");
const user_1 = require("../../enums/user");
function seedPermissions() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log('Seeding permissions...');
        for (const permissionName of permission_1.ALL_PERMISSIONS) {
            yield prisma_1.prisma.permission.upsert({
                where: { name: permissionName },
                update: {},
                create: { name: permissionName },
            });
        }
        console.log('Permissions seeding complete.');
        // Find Super Admin and assign all permissions
        const superAdmin = yield prisma_1.prisma.user.findFirst({
            where: {
                role: user_1.ENUM_USER_ROLE.SUPER_ADMIN,
            },
        });
        if (superAdmin) {
            console.log('Assigning all permissions to Super Admin...');
            const allPermsFromDB = yield prisma_1.prisma.permission.findMany();
            // Perform sequential insert/upsert of permissions to prevent Supabase transaction timeouts
            for (const perm of allPermsFromDB) {
                yield prisma_1.prisma.userPermission.upsert({
                    where: {
                        permissionId_userId: {
                            permissionId: perm.id,
                            userId: superAdmin.id,
                        },
                    },
                    update: {},
                    create: {
                        permissionId: perm.id,
                        userId: superAdmin.id,
                    },
                });
            }
            console.log('All permissions assigned to Super Admin successfully.');
        }
    });
}
exports.default = seedPermissions;
