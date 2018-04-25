define(["require", "exports", "./post", "./plot", "./retarget", "./change_user", "./put", "./dom"], function (require, exports, post_1, plot_1, retarget_1, change_user_1, put_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function makeMenu(parent) {
        const div = parent._div();
        // div._link("Forside", "post.html");
        div._button("Forside", () => { document.body.innerHTML = ""; post_1.makeSite(document.body); });
        div._text(" - ");
        // div._link("Graf", "plot.html");
        div._button("Graf", () => { document.body.innerHTML = ""; plot_1.makeSite(document.body); });
        div._text(" - ");
        // div._link("Retarget", "retarget.html");
        div._button("Retarget", () => { document.body.innerHTML = ""; retarget_1.makeSite(document.body); });
        div._text(" - ");
        // div._link("Skift bruger", "change_user.html");
        div._button("Skift bruger", () => { document.body.innerHTML = ""; change_user_1.makeSite(document.body); });
        div._text(" - ");
        // div._link("Manu ret", "put.html");
        div._button("Manu ret", () => { document.body.innerHTML = ""; put_1.makeSite(document.body); });
        return div;
    }
    exports.makeMenu = makeMenu;
});
