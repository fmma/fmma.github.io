

let speed = 3;
const n = 1000;
const expanse = 100000;


export const version = "0.0.1";

export const camera = {
    x: 0,
    y: 0,
    scale: 0.01
}

export const world = {
};

function getRndColor() {
    var r = 255 * Math.random() | 0,
        g = 255 * Math.random() | 0,
        b = 255 * Math.random() | 0;
    return 'rgb(' + r + ',' + g + ',' + b + ')';
}

generateBodies();

function generateBodies() {
    world.bodies = [];
    for (let i = 0; i < n; ++i) {
        const x = Math.random() * expanse - expanse / 2;
        const y = Math.random() * expanse - expanse / 2;
        const weight = Math.random() * Math.random() * Math.random() *  15000;
        world.bodies.push({
            x,
            y,
            dx: Math.sign(x) * Math.random() * 0.1,
            dy: Math.sign(y) * Math.random() * 0.1,
            weight,
            ddx: 0,
            ddy: 0,
            grow: weight,
            color: getRndColor()
        })
    }
}

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext("2d");
const start = document.getElementById('start');
const stop = document.getElementById('stop');

stop.disabled = true;

let running = undefined;
start.addEventListener('click', () => {
    if (!running) {
        t0 = 0;
        running = true;
        window.requestAnimationFrame(main);
        start.disabled = true;
        stop.disabled = false;
    }
});

stop.addEventListener('click', () => {
    if (running) {
        running = false;
        start.disabled = false;
        stop.disabled = true;
    }
});

let t0;
let dt;
let t = 0;
let i = 0;


export function main(now) {
    if (t0 == 0) {
        t0 = now;
        dt = 0;
        t = 0;
    }
    else {
        now -= t0;
        dt = now - t;
        t = now;
    }
    if (!running) {
        return;
    }
    ++i;
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = '#FFFFFF';

    const collisions = [];
    const n = world.bodies.length;
    for (let i = 0; i < n; ++i) {
        const b2 = world.bodies[i];
        b2.ddx = 0;
        b2.ddy = 0;
        for (let j = 0; j < n; ++j) {
            const b1 = world.bodies[j];
            if (b1 == b2)
                continue;
            const a = b1.x - b2.x;
            const b = b1.y - b2.y;
            const dist = Math.sqrt(a * a + b * b);
            if (dist < Math.sqrt(b1.weight + b2.weight)) {
                if (i < j)
                    collisions.push([i, j]);
            }
            else {
                const acc = b1.weight / (dist * dist);
                b2.ddx += a / dist * acc * 0.1;
                b2.ddy += b / dist * acc * 0.1;
            }
        }
    }
    const toDelete = [];
    for (let [i, j] of collisions) {
        let b1 = world.bodies[i];
        let b2 = world.bodies[j];
        if (b1.weight > b2.weight) {
            const tmp = b1;
            b1 = b2;
            b2 = tmp;
            i = j;
        }
        toDelete.push(i);
        b2.dx = (b2.weight * b2.dx + b1.dx * b1.weight) / (b1.weight + b2.weight);
        b2.dy = (b2.weight * b2.dy + b1.dy * b1.weight) / (b1.weight + b2.weight);

        b2.weight += b1.weight;
        b2.grow += b1.weight;
    }
    world.bodies = world.bodies.filter((_, i) => !toDelete.includes(i));
    ctx.save();
    ctx.scale(camera.scale, camera.scale)
    ctx.translate(400 / camera.scale - camera.x, 400 / camera.scale - camera.y)

    for (const b of world.bodies) {
        drawBody(b);
    }
    ctx.restore();

    // speed = 3 + Math.sqrt(mostMassive.ddx * mostMassive.ddx + mostMassive.ddy * mostMassive.ddy) * mostMassive.weight;
    // scale = 0.1 / speed;

    const format = (x, dontPad) => dontPad ? x.toExponential(1) : x.toExponential(1).padStart(7, ' ');
    ctx.font = "12px monospace";
    ctx.fillStyle = "rgba(255,0,0)";
    const strings = [
        ` N = ${world.bodies.length}`,
        ` i = ${i}`,
        ` t = ${format(t, true)}`,
        `dt = ${dt.toFixed(1)}`,
        ` s = ${speed.toFixed(1)}`,
    ];
    ctx.fillRect(0, 0, 220, strings.length * 10 + 5);
    ctx.fillStyle = "rgba(0,0,0)";
    strings.map((x, i) => ctx.fillText(x, 10, 10 * (i + 1)))
    window.requestAnimationFrame(main);
}

function drawBody(b) {
    b.dx += b.ddx;
    b.dy += b.ddy;
    b.x += b.dx * dt * speed;
    b.y += b.dy * dt * speed;

    ctx.beginPath();
    if (b.grow > 0)
        b.grow*=0.9;
    ctx.arc(b.x, b.y, Math.sqrt(b.weight - b.grow), 0, Math.PI * 2, false);
    ctx.fillStyle = b.color;
    ctx.fill();
    ctx.stroke();

    drawLineTo(b.ddx, b.ddy, b, "rgba(255,0,0)");
    drawLineTo(b.dx, b.dy, b, "rgba(0,255,0)");

}

start.click();

function drawLineTo(x, y, b, color) {
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = 7;
    ctx.moveTo(b.x, b.y);
    const d = 1000 / Math.sqrt(x * x + y * y);
    ctx.lineTo(b.x + x * d, b.y + y * d);
    
    ctx.stroke();
}
