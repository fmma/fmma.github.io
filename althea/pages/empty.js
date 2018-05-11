define(["require", "exports", "../page"], function (require, exports, page_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EmptyPage extends page_1.Page {
        makeSite() {
            throw new Error("Method not implemented.");
        }
    }
    exports.EmptyPage = EmptyPage;
    exports.default = EmptyPage;
});
