(() => {
  const boards = [];

  function initCartesianConstruction(panel) {
    if (!panel || panel.dataset.ready === "1" || !window.JXG) return;
    panel.dataset.ready = "1";

    const host = panel.querySelector("[data-cartesian-board]");
    if (!host) return;
    if (!host.id) host.id = "cartesian-board-" + Math.random().toString(36).slice(2);

    const FULL_VIEW = [-4.8, 3.2, 4.8, -3.2];
    const FOCUS_VIEW = [-0.3, 1.2, 1.3, -1.2];

    const board = JXG.JSXGraph.initBoard(host.id, {
      boundingbox: FULL_VIEW,
      axis: false,
      grid: false,
      showNavigation: false,
      showCopyright: false,
      keepAspectRatio: true,
      pan: { enabled: false },
      zoom: { enabled: false }
    });
    boards.push(board);

    const colors = {
      ink: "#e8eef7",
      blue: "#7dd3fc",
      muted: "#94a3b8",
      gold: "#fbbf24",
      green: "#4ade80",
      helper: "#64748b",
      grid: "#263247"
    };
    const fixed = { fixed: true, highlight: false };
    const objects = [];

    const add = (object, key) => {
      object._sceneKey = key;
      objects.push(object);
      object.setAttribute({ visible: false });
      return object;
    };
    const hideAll = () => objects.forEach(o => o.setAttribute({ visible: false }));
    const showKeys = keys => objects.forEach(o => o.setAttribute({ visible: keys.includes(o._sceneKey) }));

    const point = (coords, name, key, options = {}) => add(board.create("point", coords, {
      name,
      size: 4,
      fillColor: colors.gold,
      strokeColor: colors.gold,
      label: { offset: [8, -24], fontSize: 18, color: colors.ink },
      ...fixed,
      ...options
    }), key);

    const segment = (a, b, key, options = {}) => add(board.create("segment", [a, b], {
      strokeColor: colors.muted,
      strokeWidth: 2,
      ...fixed,
      ...options
    }), key);

    const text = (coords, value, key, options = {}) => add(board.create("text", [coords[0], coords[1], value], {
      color: colors.muted,
      fontSize: 16,
      ...fixed,
      ...options
    }), key);

    const tickX = (value, key) => {
      segment([value, -.13], [value, .13], key);
      text([value - .08, -.42], String(value), key);
    };
    const tickY = (value, key) => {
      segment([-.13, value], [.13, value], key);
      text([-.45, value - .08], String(value), key);
    };
    const focusTick = (value, key, height = .055) => {
      segment([value, -height], [value, height], key, { strokeColor: colors.gold, strokeWidth: 3 });
    };

    point([-2.8, 0], "A", "points");
    point([2.8, 0], "B", "points");

    add(board.create("line", [[-4, 0], [4, 0]], {
      strokeColor: colors.blue, strokeWidth: 4, ...fixed
    }), "xaxis");

    point([0, 0], "O", "origin", {
      size: 5,
      fillColor: "#bae6fd",
      strokeColor: "#bae6fd",
      label: { offset: [10, -26], fontSize: 20, color: colors.ink }
    });

    add(board.create("line", [[0, -2.6], [0, 2.6]], {
      strokeColor: colors.blue, strokeWidth: 4, ...fixed
    }), "yaxis");

    add(board.create("polygon", [[0, 0], [.34, 0], [.34, .34], [0, .34]], {
      borders: { strokeColor: colors.muted, strokeWidth: 2 },
      fillColor: "transparent",
      vertices: { visible: false },
      ...fixed
    }), "rightangle");

    add(board.create("arrow", [[3.2, 0], [4.15, 0]], {
      strokeColor: colors.blue, strokeWidth: 4, ...fixed
    }), "directions");
    add(board.create("arrow", [[0, 1.9], [0, 2.85]], {
      strokeColor: colors.blue, strokeWidth: 4, ...fixed
    }), "directions");
    text([3.05, .35], "positive x", "directions", { fontSize: 17 });
    text([.28, 2.55], "positive y", "directions", { fontSize: 17 });

    segment([0, 0], [1, 0], "unit", { strokeColor: colors.gold, strokeWidth: 5 });
    point([1, 0], "U", "unit", { label: { offset: [8, -26], fontSize: 18, color: colors.ink } });
    text([.34, .28], "unit length", "unit", { color: colors.gold });

    add(board.create("circle", [[0, 0], 1], {
      strokeColor: colors.gold, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "circle-origin");
    tickX(-1, "marks-one");
    tickX(1, "marks-one");
    tickY(-1, "marks-one");
    tickY(1, "marks-one");

    add(board.create("circle", [[1, 0], 1], {
      strokeColor: colors.gold, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "circle-x-plus-2");
    tickX(2, "mark-x-plus-2");

    add(board.create("circle", [[2, 0], 1], {
      strokeColor: colors.gold, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "circle-x-plus-3");
    tickX(3, "mark-x-plus-3");

    add(board.create("circle", [[-1, 0], 1], {
      strokeColor: colors.gold, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "circle-x-minus-2");
    tickX(-2, "mark-x-minus-2");

    add(board.create("circle", [[0, 1], 1], {
      strokeColor: colors.gold, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "circle-y-plus-2");
    tickY(2, "mark-y-plus-2");

    add(board.create("circle", [[0, -1], 1], {
      strokeColor: colors.gold, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "circle-y-minus-2");
    tickY(-2, "mark-y-minus-2");

    add(board.create("segment", [[0, 0], [1, 0]], {
      strokeColor: colors.blue, strokeWidth: 4, ...fixed
    }), "focus");
    point([0, 0], "0", "focus", { size: 3, fillColor: colors.ink, strokeColor: colors.ink });
    point([1, 0], "1", "focus", { size: 3, fillColor: colors.ink, strokeColor: colors.ink });

    add(board.create("circle", [[0, 0], .72], {
      strokeColor: colors.helper, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "bisect-half-helpers");
    add(board.create("circle", [[1, 0], .72], {
      strokeColor: colors.helper, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "bisect-half-helpers");
    add(board.create("line", [[.5, -1], [.5, 1]], {
      strokeColor: colors.helper, strokeWidth: 2, dash: 2, ...fixed
    }), "bisect-half-helpers");
    focusTick(.5, "half");
    text([.455, -.18], "1/2", "half", { color: colors.ink, fontSize: 15 });

    add(board.create("circle", [[0, 0], .36], {
      strokeColor: colors.helper, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "bisect-quarter-helpers");
    add(board.create("circle", [[.5, 0], .36], {
      strokeColor: colors.helper, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "bisect-quarter-helpers");
    add(board.create("line", [[.25, -.65], [.25, .65]], {
      strokeColor: colors.helper, strokeWidth: 2, dash: 2, ...fixed
    }), "bisect-quarter-helpers");
    add(board.create("circle", [[1, 0], .36], {
      strokeColor: colors.helper, strokeWidth: 2, dash: 2, fillOpacity: 0, ...fixed
    }), "bisect-quarter-helpers");
    add(board.create("line", [[.75, -.65], [.75, .65]], {
      strokeColor: colors.helper, strokeWidth: 2, dash: 2, ...fixed
    }), "bisect-quarter-helpers");
    focusTick(.25, "quarters");
    focusTick(.75, "quarters");
    [.125, .375, .625, .875].forEach(v => focusTick(v, "eighths", .04));

    for (let x = -4; x <= 4; x += .5) {
      add(board.create("segment", [[x, -2.5], [x, 2.5]], {
        strokeColor: colors.grid, strokeWidth: 1, ...fixed
      }), "grid");
    }
    for (let y = -2.5; y <= 2.5; y += .5) {
      add(board.create("segment", [[-4, y], [4, y]], {
        strokeColor: colors.grid, strokeWidth: 1, ...fixed
      }), "grid");
    }

    point([3, 2], "P", "point-p", {
      size: 5,
      fillColor: colors.green,
      strokeColor: colors.green,
      label: { offset: [14, 8], fontSize: 22, color: colors.ink }
    });
    point([3, 0], "", "projection", { size: 4, fillColor: colors.green, strokeColor: colors.green });
    point([0, 2], "", "projection", { size: 4, fillColor: colors.green, strokeColor: colors.green });
    segment([3, 2], [3, 0], "projection", { strokeColor: colors.green, dash: 2 });
    segment([3, 2], [0, 2], "projection", { strokeColor: colors.green, dash: 2 });
    text([3.25, 1.55], "P = (3, 2)", "coordinates", { color: colors.green, fontSize: 18 });

    const baseAxes = ["xaxis", "origin", "yaxis", "rightangle", "directions"];
    const firstMarks = [...baseAxes, "marks-one"];
    const xPlus2 = [...firstMarks, "mark-x-plus-2"];
    const xPlus3 = [...xPlus2, "mark-x-plus-3"];
    const xMinus2 = [...xPlus3, "mark-x-minus-2"];
    const yPlus2 = [...xMinus2, "mark-y-plus-2"];
    const allIntegerMarks = [...yPlus2, "mark-y-minus-2"];

    const steps = [
      { title: "Begin with the Euclidean plane", keys: [] },
      { title: "Choose two points", keys: ["points"] },
      { title: "Construct the first straight line through them", keys: ["points", "xaxis"] },
      { title: "Choose the origin O on the line", keys: ["xaxis", "origin"] },
      { title: "Construct the perpendicular axis through O", keys: ["xaxis", "origin", "yaxis", "rightangle"] },
      { title: "Choose the positive directions", keys: baseAxes },
      { title: "Choose the unit segment OU", keys: [...baseAxes, "unit"] },
      { title: "Transfer the unit with a compass circle", keys: [...baseAxes, "unit", "circle-origin"] },
      { title: "Keep only the four marks ±1", keys: firstMarks },
      { title: "Transfer one more unit from +1", keys: [...firstMarks, "circle-x-plus-2"] },
      { title: "Keep the mark +2", keys: xPlus2 },
      { title: "Repeat from +2", keys: [...xPlus2, "circle-x-plus-3"] },
      { title: "Keep the mark +3", keys: xPlus3 },
      { title: "Repeat from −1", keys: [...xPlus3, "circle-x-minus-2"] },
      { title: "Keep the mark −2", keys: xMinus2 },
      { title: "Transfer the unit vertically", keys: [...xMinus2, "circle-y-plus-2"] },
      { title: "Keep the vertical mark +2", keys: yPlus2 },
      { title: "Repeat below the origin", keys: [...yPlus2, "circle-y-minus-2"] },
      { title: "Keep the vertical mark −2", keys: allIntegerMarks },
      { title: "Focus on the unit interval [0,1]", keys: ["focus"], bbox: FOCUS_VIEW },
      { title: "Construct its midpoint", keys: ["focus", "bisect-half-helpers"], bbox: FOCUS_VIEW },
      { title: "Remove helpers and keep 1/2", keys: ["focus", "half"], bbox: FOCUS_VIEW },
      { title: "Bisect both halves", keys: ["focus", "half", "bisect-quarter-helpers"], bbox: FOCUS_VIEW },
      { title: "Keep the quarter marks", keys: ["focus", "half", "quarters"], bbox: FOCUS_VIEW },
      { title: "Bisect once more to obtain eighths", keys: ["focus", "half", "quarters", "eighths"], bbox: FOCUS_VIEW },
      { title: "The same process gives arbitrarily fine dyadic marks", keys: ["focus", "half", "quarters", "eighths"], bbox: FOCUS_VIEW },
      { title: "Return to the completed coordinate axes", keys: allIntegerMarks },
      { title: "Choose an arbitrary point P", keys: [...allIntegerMarks, "point-p"] },
      { title: "Project P orthogonally onto both axes", keys: [...allIntegerMarks, "point-p", "projection"] },
      { title: "Reveal an auxiliary grid", keys: ["grid", ...allIntegerMarks, "point-p", "projection"] },
      { title: "Read the ordered pair (3,2)", keys: ["grid", ...allIntegerMarks, "point-p", "projection", "coordinates"] }
    ];

    const title = panel.querySelector("[data-cartesian-title]");
    const status = panel.querySelector("[data-cartesian-status]");
    const previous = panel.querySelector("[data-cartesian-previous]");
    const next = panel.querySelector("[data-cartesian-next]");
    const play = panel.querySelector("[data-cartesian-play]");
    const reset = panel.querySelector("[data-cartesian-reset]");
    let current = 0;
    let timer = null;

    function render() {
      const step = steps[current];
      hideAll();
      showKeys(step.keys);
      board.setBoundingBox(step.bbox || FULL_VIEW, true);
      board.fullUpdate();
      if (title) title.textContent = step.title;
      if (status) status.textContent = "Step " + (current + 1) + " / " + steps.length;
      if (previous) previous.disabled = current === 0;
      if (next) next.disabled = current === steps.length - 1;
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      if (play) play.textContent = "Play";
    }

    function advance() {
      if (current < steps.length - 1) {
        current += 1;
        render();
      } else {
        stop();
      }
    }

    previous?.addEventListener("click", () => { stop(); current = Math.max(0, current - 1); render(); });
    next?.addEventListener("click", () => { stop(); advance(); });
    reset?.addEventListener("click", () => { stop(); current = 0; render(); });
    play?.addEventListener("click", () => {
      if (timer) return stop();
      if (current === steps.length - 1) current = 0;
      render();
      play.textContent = "Pause";
      timer = setInterval(advance, 1450);
    });

    render();
  }

  function initCoordinateShift(panel) {
    if (!panel || panel.dataset.ready === "1") return;
    panel.dataset.ready = "1";

    const svg = panel.querySelector("[data-coordinate-svg]");
    const oxInput = panel.querySelector("[data-origin-x]");
    const oyInput = panel.querySelector("[data-origin-y]");
    const scaleInput = panel.querySelector("[data-scale]");
    const readout = panel.querySelector("[data-coordinate-readout]");
    if (!svg || !oxInput || !oyInput || !scaleInput) return;

    const point = { x: 560, y: 130 };
    const baseOrigin = { x: 400, y: 210 };
    const baseUnit = 80;

    function draw() {
      const ox = Number(oxInput.value);
      const oy = Number(oyInput.value);
      const scaleFactor = Number(scaleInput.value);
      const originX = baseOrigin.x + ox * baseUnit;
      const originY = baseOrigin.y - oy * baseUnit;
      const unit = baseUnit * scaleFactor;
      const xCoord = (point.x - originX) / unit;
      const yCoord = (originY - point.y) / unit;

      let grid = "";
      for (let k = -8; k <= 8; k++) {
        const gx = originX + k * unit;
        const gy = originY + k * unit;
        if (gx >= 0 && gx <= 800) grid += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="420" class="cg-grid"/>';
        if (gy >= 0 && gy <= 420) grid += '<line x1="0" y1="' + gy + '" x2="800" y2="' + gy + '" class="cg-grid"/>';
      }

      svg.innerHTML = grid +
        '<line x1="0" y1="' + originY + '" x2="800" y2="' + originY + '" class="cg-axis"/>' +
        '<line x1="' + originX + '" y1="420" x2="' + originX + '" y2="0" class="cg-axis"/>' +
        '<circle cx="' + originX + '" cy="' + originY + '" r="6" class="cg-origin"/>' +
        '<text x="' + (originX + 10) + '" y="' + (originY + 22) + '" class="cg-label">O</text>' +
        '<line x1="' + point.x + '" y1="' + point.y + '" x2="' + point.x + '" y2="' + originY + '" class="cg-projection"/>' +
        '<line x1="' + point.x + '" y1="' + point.y + '" x2="' + originX + '" y2="' + point.y + '" class="cg-projection"/>' +
        '<circle cx="' + point.x + '" cy="' + point.y + '" r="8" class="cg-point"/>' +
        '<text x="' + (point.x + 14) + '" y="' + (point.y - 12) + '" class="cg-point-label">P</text>';

      if (readout) {
        readout.textContent = "P = (" + xCoord.toFixed(2) + ", " + yCoord.toFixed(2) + ")";
      }
    }

    [oxInput, oyInput, scaleInput].forEach(input => input.addEventListener("input", draw));
    draw();
  }

  function initDistanceGeometry(panel) {
    if (!panel || panel.dataset.ready === "1" || !window.JXG) return;
    panel.dataset.ready = "1";
    const host = panel.querySelector("[data-distance-board]");
    if (!host) return;
    if (!host.id) host.id = "distance-board-" + Math.random().toString(36).slice(2);

    const board = JXG.JSXGraph.initBoard(host.id, {
      boundingbox: [-1, 5.6, 7.4, -1.2],
      axis: true,
      grid: false,
      showNavigation: false,
      showCopyright: false,
      keepAspectRatio: true,
      pan: { enabled: false },
      zoom: { enabled: false },
      defaultAxes: {
        x: { strokeColor: "#64748b", ticks: { label: { color: "#94a3b8" } } },
        y: { strokeColor: "#64748b", ticks: { label: { color: "#94a3b8" } } }
      }
    });
    boards.push(board);

    const fixed = { fixed: true, highlight: false };
    const P = board.create("point", [1, 1], {
      name: "P", size: 5, fillColor: "#4ade80", strokeColor: "#4ade80",
      snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5,
      label: { color: "#e8eef7", fontSize: 18, offset: [-20, -24] }
    });
    const Q = board.create("point", [4, 5], {
      name: "Q", size: 5, fillColor: "#4ade80", strokeColor: "#4ade80",
      snapToGrid: true, snapSizeX: 0.5, snapSizeY: 0.5,
      label: { color: "#e8eef7", fontSize: 18, offset: [10, 8] }
    });
    const R = board.create("point", [() => Q.X(), () => P.Y()], {
      name: "R", size: 4, fillColor: "#fbbf24", strokeColor: "#fbbf24",
      label: { color: "#e8eef7", fontSize: 17, offset: [10, -22] }, ...fixed
    });

    board.create("segment", [P, Q], { strokeColor: "#e8eef7", strokeWidth: 4, ...fixed });
    board.create("segment", [P, R], { strokeColor: "#7dd3fc", strokeWidth: 4, ...fixed });
    board.create("segment", [R, Q], { strokeColor: "#fbbf24", strokeWidth: 4, ...fixed });

    const dx = panel.querySelector("[data-distance-dx]");
    const dy = panel.querySelector("[data-distance-dy]");
    const dist = panel.querySelector("[data-distance-value]");

    function updateReadout() {
      const vx = Q.X() - P.X();
      const vy = Q.Y() - P.Y();
      if (dx) dx.textContent = vx.toFixed(1);
      if (dy) dy.textContent = vy.toFixed(1);
      if (dist) dist.textContent = Math.hypot(vx, vy).toFixed(2);
    }
    P.on("drag", updateReadout);
    Q.on("drag", updateReadout);
    updateReadout();
  }

  function initFunctionGenerator(panel) {
    if (!panel || panel.dataset.ready === "1") return;
    panel.dataset.ready = "1";
    const input = panel.querySelector("[data-function-x]");
    const svg = panel.querySelector("[data-function-svg]");
    const formula = panel.querySelector("[data-function-readout]");
    if (!input || !svg) return;

    function draw() {
      const x = Number(input.value);
      const y = 2 * x + 1;
      const sx = 400 + x * 60;
      const sy = 210 - y * 40;

      let grid = "";
      for (let gx = 40; gx <= 760; gx += 60) grid += '<line x1="' + gx + '" y1="0" x2="' + gx + '" y2="420" class="cg-grid"/>';
      for (let gy = 10; gy <= 410; gy += 40) grid += '<line x1="0" y1="' + gy + '" x2="800" y2="' + gy + '" class="cg-grid"/>';
      let linePath = "";
      for (let px = -5; px <= 5; px += .25) {
        const py = 2 * px + 1;
        const ux = 400 + px * 60;
        const uy = 210 - py * 40;
        linePath += (linePath ? " L " : "M ") + ux + " " + uy;
      }

      svg.innerHTML = grid +
        '<line x1="0" y1="210" x2="800" y2="210" class="cg-axis"/>' +
        '<line x1="400" y1="420" x2="400" y2="0" class="cg-axis"/>' +
        '<path d="' + linePath + '" class="fg-line"/>' +
        '<circle cx="' + sx + '" cy="' + sy + '" r="9" class="cg-point"/>' +
        '<line x1="' + sx + '" y1="' + sy + '" x2="' + sx + '" y2="210" class="cg-projection"/>' +
        '<line x1="' + sx + '" y1="' + sy + '" x2="400" y2="' + sy + '" class="cg-projection"/>';

      if (formula) formula.textContent = "x = " + x.toFixed(1) + "  →  y = 2x + 1 = " + y.toFixed(1) + "  →  (" + x.toFixed(1) + ", " + y.toFixed(1) + ")";
    }

    input.addEventListener("input", draw);
    draw();
  }

  function initGeometryToggle(panel) {
    if (!panel || panel.dataset.ready === "1") return;
    panel.dataset.ready = "1";
    const button = panel.querySelector("[data-geometry-toggle-button]");
    const axes = panel.querySelector("[data-geometry-axes]");
    if (!button || !axes) return;
    let visible = false;
    function render() {
      axes.style.opacity = visible ? "1" : "0";
      button.textContent = visible ? "Hide coordinate system" : "Show coordinate system";
    }
    button.addEventListener("click", () => { visible = !visible; render(); });
    render();
  }

  function init(root) {
    root.querySelectorAll("[data-cartesian-construction]").forEach(initCartesianConstruction);
    root.querySelectorAll("[data-coordinate-shift]").forEach(initCoordinateShift);
    root.querySelectorAll("[data-distance-geometry]").forEach(initDistanceGeometry);
    root.querySelectorAll("[data-function-generator]").forEach(initFunctionGenerator);
    root.querySelectorAll("[data-geometry-toggle]").forEach(initGeometryToggle);
  }

  function refresh() {
    boards.forEach(board => {
      try {
        board.resizeContainer();
        board.fullUpdate();
      } catch (_) {}
    });
  }

  window.PresentationInteractives = { init, refresh };
})();
