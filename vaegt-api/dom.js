define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    Node.prototype._draw = function (block) {
        this.lastReuseId = this.reuseId == null ? 0 : this.reuseId;
        this.reuseId = 1;
        block();
        for (let i = this.reuseId; i < this.lastReuseId; ++i) {
            this.removeChild(this[i]);
            delete this[i];
        }
    };
    Node.prototype.provideNode = function (create) {
        if (this.reuseId == null) {
            console.log("APPEND CHILD CALLED");
            return this.appendChild(create());
        }
        let old = this[this.reuseId];
        if (old == null) {
            old = create();
            console.log("APPEND CHILD CALLED", old);
            this.appendChild(old);
            this[this.reuseId] = old;
        }
        old.reuseId = 1;
        this.reuseId++;
        return old;
    };
    Element.prototype._class = function (className) {
        this.className = className;
        return this;
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
        columns.forEach(col => {
            const td = head.provideNode(() => document.createElement("td"));
            td.innerHTML = col;
        });
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
            if (pagedTable.pageSize > rows.n) {
                pagedTable.pageSize = rows.n;
            }
            if (pagedTable.index < 0) {
                pagedTable.index = 0;
            }
            if (pagedTable.index >= rows.n) {
                pagedTable.index = rows.n - 1;
            }
            // indexInput.value = String(pagedTable.index);
            // pageSizeInput.value = String(pagedTable.pageSize);
            // prevButton.disabled = pagedTable.index === 0;
            // nextButton.disabled = pagedTable.index + pagedTable.pageSize >= rows.n;
            // buttonsText.textContent = "/(" + rows.n + ") rækker pr side:";
            const n = Math.min(pagedTable.index + pagedTable.pageSize, rows.n);
            tbody._draw(() => {
                for (let i = pagedTable.index; i < n; ++i) {
                    const row = tbody._tr();
                    rows.ith(i, row);
                }
            });
        }
        const div = this._div();
        const table = div._table(...columns);
        let tbody = table.provideNode(() => document.createElement("tbody"));
        const buttons = div._div()._class("table-buttons");
        const prevButton = buttons._button("Forrige", () => {
            pagedTable.index = Math.max(0, pagedTable.index - pagedTable.pageSize);
            redraw();
        });
        const nextButton = buttons._button("Næste", () => {
            pagedTable.index += pagedTable.pageSize;
            redraw();
        });
        buttons._text(" Række:");
        const indexInput = buttons._input("Række", "number", "0", newIndex => {
            pagedTable.index = +newIndex;
            redraw();
        });
        indexInput.style.width = "100px";
        const buttonsText = buttons._text("/(0) rækker pr side:");
        const pageSizeInput = buttons._input("Antal rækker per side", "number", String(pageSize), newPageSize => {
            pagedTable.pageSize = +newPageSize;
            redraw();
        });
        pageSizeInput.style.width = "100px";
        buttons._paragraph("");
        const pagedTable = {
            redraw: redraw,
            rows: rows,
            index: 0,
            pageSize: pageSize,
            node: div
        };
        return pagedTable;
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
    function formatTime(date) {
        const hour = ("0" + date.getHours()).slice(-2);
        const minute = ("0" + date.getMinutes()).slice(-2);
        return hour + ":" + minute;
    }
    Node.prototype._inputDate = function (value, onchange = () => { }) {
        const input = this.provideNode(() => document.createElement("input"));
        input.type = "date";
        input.value = formatDate(value);
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
    Node.prototype._inputTime = function (value, onchange = () => { }) {
        const input = this.provideNode(() => document.createElement("input"));
        input.type = "time";
        input.value = formatTime(value);
        input.onchange = () => {
            if (input.valueAsDate) {
                value.setMinutes(input.valueAsDate.getUTCMinutes());
                value.setHours(input.valueAsDate.getUTCHours());
                onchange();
            }
        };
        return input;
    };
    Node.prototype._inputWeight = function (placeholder, value, onchange = () => { }) {
        const input = this.provideNode(() => document.createElement("input"));
        input.type = "number";
        input.step = "0.1";
        input.min = "50";
        input.max = "200";
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
        };
        return input;
    };
    Node.prototype._checkbox = function (id, value, onchange = () => { }) {
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
});
