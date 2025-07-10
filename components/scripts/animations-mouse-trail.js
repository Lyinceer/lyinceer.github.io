function n(e) {
    this.init(e || {});
}

n.prototype = {
    init: function (e) {
        this.phase = e.phase || 0;
        this.offset = e.offset || 0;
        this.frequency = e.frequency || 0.001;
        this.amplitude = e.amplitude || 1;
    },
    update: function () {
        this.phase += this.frequency;
        return this.offset + Math.sin(this.phase) * this.amplitude;
    },
};

function Node() {
    this.x = 0;
    this.y = 0;
    this.vx = 0;
    this.vy = 0;
}

function Line(e) {
    this.init(e || {});
}

Line.prototype = {
    init: function (e) {
        this.spring = e.spring + 0.1 * Math.random() - 0.02;
        this.friction = E.friction + 0.01 * Math.random() - 0.002;
        this.nodes = [];
        for (let i = 0; i < E.size; i++) {
            const t = new Node();
            t.x = pos.x;
            t.y = pos.y;
            this.nodes.push(t);
        }
    },
    update: function () {
        let spring = this.spring;
        const first = this.nodes[0];
        first.vx += (pos.x - first.x) * spring;
        first.vy += (pos.y - first.y) * spring;

        for (let i = 0; i < this.nodes.length; i++) {
            const node = this.nodes[i];
            if (i > 0) {
                const prev = this.nodes[i - 1];
                node.vx += (prev.x - node.x) * spring;
                node.vy += (prev.y - node.y) * spring;
                node.vx += prev.vx * E.dampening;
                node.vy += prev.vy * E.dampening;
            }
            node.vx *= this.friction;
            node.vy *= this.friction;
            node.x += node.vx;
            node.y += node.vy;
            spring *= E.tension;
        }
    },
    draw: function () {
        ctx.beginPath();
        ctx.moveTo(this.nodes[0].x, this.nodes[0].y);
        for (let i = 1; i < this.nodes.length - 2; i++) {
            const current = this.nodes[i];
            const next = this.nodes[i + 1];
            const cx = 0.5 * (current.x + next.x);
            const cy = 0.5 * (current.y + next.y);
            ctx.quadraticCurveTo(current.x, current.y, cx, cy);
        }
        const penultimate = this.nodes[this.nodes.length - 2];
        const last = this.nodes[this.nodes.length - 1];
        ctx.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y);
        ctx.stroke();
        ctx.closePath();
    },
};

function handleInputEvent(e) {
    if (e.touches && e.touches.length > 0) {
        pos.x = e.touches[0].clientX;
        pos.y = e.touches[0].clientY;
    } else {
        pos.x = e.clientX + 10;
        pos.y = e.clientY + 7;
    }

  // Only prevent default behavior on canvas to allow button clicks
  if (e.target.tagName.toLowerCase() === "canvas") {
    e.preventDefault();
  }
}

function startAnimation(e) {
    document.removeEventListener("mousemove", startAnimation);
    document.removeEventListener("touchstart", startAnimation);

    // Always listen to input events on the document
    document.addEventListener("mousemove", handleInputEvent);
    document.addEventListener("touchmove", handleInputEvent, { passive: false });
    document.addEventListener("touchstart", handleInputEvent, { passive: false });

    handleInputEvent(e); // Initialize pos
    initLines();
    render();
}

function initLines() {
    lines = [];
    for (let i = 0; i < E.trails; i++) {
        lines.push(new Line({ spring: 0.4 + (i / E.trails) * 0.025 }));
    }
}

function render() {
    if (!ctx.running) return;

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `hsla(${Math.round(f.update())}, 50%, 20%, 0.8)`;
    ctx.lineWidth = 3;

    lines.forEach((line) => {
        line.update();
        line.draw();
    });

    ctx.frame++;
    requestAnimationFrame(render);
}

function resizeCanvas() {
    ctx.canvas.width = window.innerWidth;
    ctx.canvas.height = window.innerHeight;
}

const pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
let ctx, f, lines = [];

const E = {
    debug: true,
    friction: 0.5,
    trails: 20,
    size: 50,
    dampening: 0.25,
    tension: 0.98,
};

function renderCanvas() {
    const canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    ctx.running = true;
    ctx.frame = 0;

    f = new n({
        phase: Math.random() * 2 * Math.PI,
        amplitude: 85,
        frequency: 0.0015,
        offset: 285,
    });

    document.addEventListener("mousemove", startAnimation);
    document.addEventListener("touchstart", startAnimation, { passive: false });

    window.addEventListener("resize", resizeCanvas);
    document.body.addEventListener("orientationchange", resizeCanvas);

    window.addEventListener("focus", () => {
        if (!ctx.running) {
            ctx.running = true;
            render();
        }
    });

    window.addEventListener("blur", () => {
        ctx.running = false;
    });

    resizeCanvas();
}

window.onload = renderCanvas;
