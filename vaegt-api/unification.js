define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    function isVar(t) {
        return "var" in t;
    }
    exports.isVar = isVar;
    function isConstr(t) {
        return "constructor" in t;
    }
    exports.isConstr = isConstr;
    function unify(equalities) {
        const mgu = [];
        function substitute(i, t) {
            function subs(t0) {
                if (isVar(t0)) {
                    return i == t0.var ? t : t0;
                }
                for (let j = 0; j < t0.arguments.length; ++j) {
                    t0.arguments[i] = subs(t0.arguments[i]);
                }
                return t0;
            }
            for (let i = 0; i < equalities.length; ++i) {
                const [t1, t2] = equalities[i];
                equalities[i] = [subs(t1), subs(t2)];
            }
        }
        function occurs(i, t) {
            if (isConstr(t)) {
                return t.arguments.some(t0 => occurs(i, t0));
            }
            return i === t.var;
        }
        function go() {
            const eq = equalities.pop();
            if (eq === undefined)
                return true;
            const [t1, t2] = eq;
            if (t1 === t2)
                return go();
            else if (isConstr(t1)) {
                if (isConstr(t2)) {
                    if (t1.constructor === t2.constructor && t1.arguments.length === t2.arguments.length) {
                        for (let i = 0; i < t1.arguments.length; ++i) {
                            equalities.push([t1.arguments[i], t2.arguments[i]]);
                        }
                        return go();
                    }
                    return false;
                }
                equalities.push([t2, t1]);
                return go();
            }
            if (occurs(t1.var, t2))
                return false;
            substitute(t1.var, t2);
            mgu.push([t1.var, t2]);
            return go();
        }
        if (go())
            return mgu;
        throw new Error("Not unifiable");
    }
    exports.unify = unify;
});
