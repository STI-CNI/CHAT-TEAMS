"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = __importDefault(require("./config"));
const oboAuthConfig = {
    authorityHost: config_1.default.authorityHost,
    clientId: config_1.default.clientId,
    tenantId: config_1.default.tenantId,
    clientSecret: config_1.default.clientSecret,
};
exports.default = oboAuthConfig;
//# sourceMappingURL=authConfig.js.map