define(["require", "exports", "../webpart"], function (require, exports, webpart_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    class EmptyPage extends webpart_1.Webpart {
        make() {
            throw new Error("Method not implemented.");
        }
    }
    exports.EmptyPage = EmptyPage;
    exports.default = EmptyPage;
});
