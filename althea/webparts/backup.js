var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
define(["require", "exports", "../webpart"], function (require, exports, webpart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class Backup extends webpart_1.Webpart {
        make() {
            return __awaiter(this, void 0, void 0, function* () {
                this.div._pre(JSON.stringify(this.model, null, " "));
            });
        }
    }
    exports.default = Backup;
});
