define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Node.prototype._draw = function (block) {
        this.lastReuseId = this.reuseId == null ? 0 : this.reuseId;
        this.reuseId = 1;
        this.reuses = this.reuses ? this.reuses : {};
        block();
        for (let i = this.reuseId; i < this.lastReuseId; ++i) {
            this.removeChild(this.reuses[i]);
            delete this.reuses[i];
        }
    };
    Node.prototype.provideNode = function (create) {
        if (this.reuseId == null) {
            return this.appendChild(create());
        }
        let child = this.reuses[this.reuseId];
        if (child == null) {
            child = create();
            child.reuses = {};
            this.appendChild(child);
            this.reuses[this.reuseId] = child;
        }
        child.reuseId = 1;
        this.reuseId++;
        return child;
    };
    Element.prototype._class = function (className) {
        this.className = className;
        return this;
    };
    Node.prototype._if = function (cond) {
        const trueDiv = this.provideNode(() => document.createElement("div"));
        const falseDiv = this.provideNode(() => document.createElement("div"));
        trueDiv.hidden = !cond;
        falseDiv.hidden = cond;
        return cond ? trueDiv : falseDiv;
    };
    Node.prototype._link = function (name, href) {
        const result = this.provideNode(() => document.createElement("a"));
        result.innerHTML = name;
        result.href = href + window.location.search;
        return result;
    };
    Node.prototype._div = function () {
        return this.provideNode(() => document.createElement("div"));
    };
    Node.prototype._span = function () {
        return this.provideNode(() => document.createElement("span"));
    };
    Node.prototype._form = function () {
        const form = this.provideNode(() => document.createElement("form"));
        return form;
    };
    Node.prototype._svg = function () {
        const svg = this.provideNode(() => document.createElementNS("http://www.w3.org/2000/svg", "svg"));
        return svg;
    };
    Node.prototype._table = function (...columns) {
        const table = this.provideNode(() => document.createElement("table"));
        const head = table.provideNode(() => document.createElement("thead"));
        for (let i = 0; i < columns.length; ++i) {
            const col = columns[i];
            const td = head.provideNode(() => document.createElement("td"));
            td.innerHTML = col;
        }
        this.appendChild(table);
        return table;
    };
    Node.prototype._td = function () {
        return this.provideNode(() => document.createElement("td"));
    };
    Node.prototype._tr = function () {
        return this.provideNode(() => document.createElement("tr"));
    };
    Node.prototype._pagedTable = function (columns, pageSize, rows) {
        let once = true;
        function redraw() {
            const rows = pagedTable.rows();
            if (pagedTable.index + pagedTable.pageSize > rows.n) {
                pagedTable.pageSize = rows.n - pagedTable.index;
            }
            if (pagedTable.index < 0) {
                pagedTable.index = 0;
            }
            if (pagedTable.index >= rows.n) {
                pagedTable.index = rows.n - 1;
            }
            indexInput.value = String(pagedTable.index);
            indexToInput.value = String(pagedTable.index + pagedTable.pageSize);
            firstButton.disabled = pagedTable.index === 0;
            prevButton.disabled = pagedTable.index === 0;
            nextButton.disabled = pagedTable.index + pagedTable.pageSize >= rows.n;
            lastButton.disabled = pagedTable.index + pagedTable.pageSize >= rows.n;
            buttonsText.textContent = " / " + rows.n + " ";
            const n = Math.min(pagedTable.index + pagedTable.pageSize, rows.n);
            nrows = rows.n;
            indexInput.max = String(nrows - pagedTable.pageSize);
            indexToInput.max = String(nrows);
            tbody._draw(() => {
                for (let i = pagedTable.index; i < n; ++i) {
                    const row = tbody._tr();
                    rows.ith(i, row);
                }
            });
        }
        let nrows = 0;
        const div = this._div();
        const table = div._table(...columns);
        let tbody = table.provideNode(() => document.createElement("tbody"));
        const buttons = div._div()._class("table-buttons");
        buttons._text(" Rækker: ");
        const indexInput = buttons._input("Rækker", "number", "0", newIndex => {
            pagedTable.index = +newIndex;
            redraw();
        });
        buttons._text(" - ");
        const indexToInput = buttons._input("Rækker", "number", "0", newIndex => {
            pagedTable.pageSize = (+newIndex) - pagedTable.index;
            redraw();
        });
        indexToInput.style.width = "100px";
        indexInput.style.width = "100px";
        indexToInput.min = "0";
        indexInput.min = "0";
        const buttonsText = buttons._text(" / 0 ");
        const firstButton = buttons._button("<<", () => {
            pagedTable.index = 0;
            redraw();
        });
        firstButton.style.marginLeft = "88px";
        const prevButton = buttons._button("<", () => {
            pagedTable.index = Math.max(0, pagedTable.index - pagedTable.pageSize);
            redraw();
        });
        const nextButton = buttons._button(">", () => {
            pagedTable.index = Math.min(pagedTable.index + pagedTable.pageSize, nrows - pagedTable.pageSize);
            redraw();
        });
        const lastButton = buttons._button(">>", () => {
            pagedTable.index = Math.max(0, nrows - pagedTable.pageSize);
            redraw();
        });
        const pagedTable = {
            redraw: redraw,
            rows: rows,
            index: 0,
            pageSize: pageSize,
            node: div
        };
        return pagedTable;
    };
    Node.prototype._hr = function () {
        const result = this.provideNode(() => document.createElement("hr"));
        return result;
    };
    Node.prototype._h1 = function (txt) {
        const result = this.provideNode(() => document.createElement("h1"));
        result.innerText = txt;
        return result;
    };
    Node.prototype._img = function (src) {
        const result = this.provideNode(() => document.createElement("img"));
        result.src = src;
        return result;
    };
    Node.prototype._text = function (text) {
        const result = this.provideNode(() => document.createTextNode(""));
        result.textContent = text;
        return result;
    };
    Node.prototype._button = function (text, action = () => { }) {
        const button = this.provideNode(() => document.createElement("button"));
        button.innerHTML = text;
        button.onclick = action;
        return button;
    };
    Node.prototype._input = function (placeholder, type, value, onchange = () => { }) {
        const input = this.provideNode(() => document.createElement("input"));
        input.placeholder = placeholder;
        input.type = type;
        input.value = value;
        input.onchange = () => onchange(input.value);
        return input;
    };
    function formatDate(date) {
        const day = ("0" + date.getDate()).slice(-2);
        const month = ("0" + (date.getMonth() + 1)).slice(-2);
        return date.getFullYear() + "-" + month + "-" + day;
    }
    function formatTime(date, utc, seconds = true) {
        if (utc) {
            let secs = Math.floor(date.getTime() / 1000);
            let mins = Math.floor(secs / 60);
            let hours = Math.floor(mins / 60);
            const days = Math.floor(hours / 24);
            secs = secs % 60;
            mins = mins % 60;
            hours = hours % 24;
            let res = days > 0 ? days + "d" : "";
            res += res || hours > 0 ? hours + "h" : "";
            res += res || mins > 0 ? mins + "m" : "";
            res += seconds && (res || secs > 0) ? secs + "s" : "";
            return res;
        }
        const hour = ("0" + date.getHours()).slice(-2);
        const minute = ("0" + date.getMinutes()).slice(-2);
        const sec = ("0" + date.getSeconds()).slice(-2);
        return hour + ":" + minute + (seconds ? ":" + sec : "");
    }
    exports.formatTime = formatTime;
    Node.prototype._inputDate = function (value, onchange = () => { }) {
        const input = this.provideNode(() => document.createElement("input"));
        input.type = "date";
        input.value = value.getTime() === 0 ? "" : formatDate(value);
        input.onchange = () => {
            if (input.valueAsDate) {
                value.setMonth(input.valueAsDate.getMonth());
                value.setDate(input.valueAsDate.getDate());
                value.setFullYear(input.valueAsDate.getFullYear());
                onchange();
            }
        };
        return input;
    };
    Node.prototype._inputTime = function (value, onchange = () => { }, utc = false) {
        const input = this.provideNode(() => document.createElement("input"));
        input.type = "time";
        input.value = value.getTime() === 0 ? "" : formatTime(value, utc, false);
        input.onchange = () => {
            if (input.valueAsDate) {
                if (utc) {
                    value.setUTCMinutes(input.valueAsDate.getUTCMinutes());
                    value.setUTCHours(input.valueAsDate.getUTCHours());
                }
                else {
                    value.setMinutes(input.valueAsDate.getUTCMinutes());
                    value.setHours(input.valueAsDate.getUTCHours());
                }
                onchange();
            }
        };
        return input;
    };
    Node.prototype._inputDateTime = function (value, onchange = () => { }) {
        const span = this._span();
        const onchangeCommon = () => {
            if (dateInput.valueAsDate && timeInput.valueAsDate) {
                value.setMonth(dateInput.valueAsDate.getMonth());
                value.setDate(dateInput.valueAsDate.getDate());
                value.setFullYear(dateInput.valueAsDate.getFullYear());
                value.setMinutes(timeInput.valueAsDate.getUTCMinutes());
                value.setHours(timeInput.valueAsDate.getUTCHours());
                onchange();
            }
        };
        const dateInput = span._inputDate(value);
        const timeInput = span._inputTime(value);
        dateInput.onchange = onchangeCommon;
        timeInput.onchange = onchangeCommon;
        return span;
    };
    Node.prototype._inputNumber = function (placeholder, value, onchange = () => { }) {
        const input = this.provideNode(() => document.createElement("input"));
        input.type = "number";
        input.pattern = "\\d*";
        input.placeholder = placeholder;
        input.value = String(value);
        input.onchange = () => {
            if (!isNaN(input.valueAsNumber)) {
                onchange(input.valueAsNumber);
            }
        };
        return input;
    };
    Node.prototype._inputWeight = function (placeholder, value, onchange = () => { }, oninput = () => { }) {
        const input = this.provideNode(() => document.createElement("input"));
        input.type = "number";
        input.step = "0.1";
        input.min = "50";
        input.max = "200";
        input.pattern = "\\d*";
        input.placeholder = placeholder;
        input.value = String(value);
        input.onchange = () => {
            if (!isNaN(input.valueAsNumber)) {
                onchange(input.valueAsNumber);
            }
        };
        input.oninput = () => {
            if (input.value[0] !== "1" && input.value.length === 3 && input.value.match(/\d*/)) {
                input.value = input.value.substr(0, 2) + "." + input.value.substr(2, 1);
            }
            if (input.value[0] === "1" && input.value.length === 4) {
                input.value = input.value.substr(0, 3) + "." + input.value.substr(3, 1);
            }
            if (!isNaN(input.valueAsNumber)) {
                oninput(input.valueAsNumber);
            }
        };
        return input;
    };
    Node.prototype._checkbox = function (value, onchange = () => { }) {
        const input = this.provideNode(() => document.createElement("input"));
        input.type = "checkbox";
        input.checked = value;
        input.onchange = () => onchange(input.checked);
        return input;
    };
    Node.prototype._paragraph = function (text) {
        const p = this.provideNode(() => document.createElement("p"));
        p.innerHTML = text;
        return p;
    };
    Node.prototype._select = function (options, j, onchange = () => { }) {
        const sel = this.provideNode(() => document.createElement("select"));
        sel.selectedIndex = j;
        sel.onchange = (x) => {
            if (sel.selectedIndex >= 0 && sel.selectedIndex < options.length)
                onchange(sel.selectedIndex);
        };
        for (let i = 0; i < options.length; ++i) {
            const opt = sel.provideNode(() => document.createElement("option"));
            opt.textContent = options[i];
            opt.value = options[i];
        }
        return sel;
    };
    function error(err) {
        const msg = "Øv der er sket en fejl: ";
        if (document.body)
            document.body.innerHTML = msg + err;
        else
            window.onload = () => {
                document.body.innerHTML = msg + err;
            };
    }
});
