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
    class AltheaAnim extends webpart_1.Webpart {
        constructor(model) {
            super(model);
            this.twerp = 0.0;
            this.anim = () => { };
            const f = () => {
                this.anim();
                animFix();
            };
            const animFix = () => {
                window.requestAnimationFrame(f);
            };
            animFix();
        }
        make() {
            return __awaiter(this, void 0, void 0, function* () {
                const img = this.div._div()._img("resources/apple-icon-180x180.png");
                this.anim = () => {
                    this.twerp += 0.01;
                    img.style.marginLeft = ((window.innerWidth - 200) * (0.5 + Math.cos(this.twerp) / 2)) + "px";
                };
            });
        }
    }
    exports.default = AltheaAnim;
});
