(() => {
  const boardEntries = [];

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
    boardEntries.push({ board, panel, host });

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

  function initBisectionScale(panel) {
    if (!panel || panel.dataset.ready === "1") return;
    panel.dataset.ready = "1";

    const svg = panel.querySelector("[data-bisection-svg]");
    const status = panel.querySelector("[data-bisection-status]");
    const levelReadout = panel.querySelector("[data-bisection-level]");
    const intervalsReadout = panel.querySelector("[data-bisection-intervals]");
    const spacingReadout = panel.querySelector("[data-bisection-spacing]");
    const previous = panel.querySelector("[data-bisection-previous]");
    const next = panel.querySelector("[data-bisection-next]");
    const play = panel.querySelector("[data-bisection-play]");
    const reset = panel.querySelector("[data-bisection-reset]");

    if (!svg || !status || !previous || !next || !play || !reset) return;

    const MAX_LEVEL = 4;
    const X0 = 105;
    const X1 = 930;
    const ROW0 = 58;
    const ROW_GAP = 68;

    let current = 0;
    let timer = null;

    function gcd(a, b) {
      let x = Math.abs(a);
      let y = Math.abs(b);
      while (y) {
        const t = y;
        y = x % y;
        x = t;
      }
      return x || 1;
    }

    function fractionLabel(k, denominator) {
      if (k === 0) return "0";
      if (k === denominator) return "1";

      const divisor = gcd(k, denominator);
      const numerator = k / divisor;
      const reducedDenominator = denominator / divisor;

      if (reducedDenominator === 1) return String(numerator);
      return numerator + "/" + reducedDenominator;
    }

    function newFractionsForLevel(level) {
      if (level === 0) return [];
      const denominator = 2 ** level;
      const values = [];
      for (let k = 1; k < denominator; k += 2) {
        values.push(fractionLabel(k, denominator));
      }
      return values;
    }

    function describe(level) {
      if (level === 0) return "Start with the unit interval [0,1].";
      if (level === 1) return "Bisect the interval once: the midpoint 1/2 appears.";
      if (level === 2) return "Bisect both halves: 1/4 and 3/4 appear.";
      if (level === 3) return "Bisect all four intervals: the eighth marks appear.";
      return "Bisect again: sixteen equal intervals now fill the same unit segment.";
    }

    function renderRow(level, active) {
      const denominator = 2 ** level;
      const y = ROW0 + level * ROW_GAP;
      const opacity = active ? 1 : 0.42;
      let markup = "";

      markup += '<g class="bisection-row' + (active ? ' is-active' : '') + '" opacity="' + opacity + '">';
      markup += '<text x="28" y="' + (y + 5) + '" class="bs-level-label">L' + level + '</text>';
      markup += '<line x1="' + X0 + '" y1="' + y + '" x2="' + X1 + '" y2="' + y + '" class="bs-baseline"/>';

      for (let k = 0; k <= denominator; k++) {
        const x = X0 + (X1 - X0) * (k / denominator);
        const isEndpoint = k === 0 || k === denominator;
        const isNew = level > 0 && k % 2 === 1;
        const tickHeight = isEndpoint ? 22 : (isNew ? 27 : 15);
        const tickClass = isNew ? "bs-tick bs-new" : "bs-tick";

        markup += '<line x1="' + x + '" y1="' + (y - tickHeight) + '" x2="' + x + '" y2="' + (y + tickHeight) + '" class="' + tickClass + '"/>';

        const shouldLabel = level === 0 ? isEndpoint : (isNew || isEndpoint);
        if (shouldLabel) {
          const label = fractionLabel(k, denominator);
          markup += '<text x="' + x + '" y="' + (y + 48) + '" text-anchor="middle" class="' + (isNew ? 'bs-fraction bs-new-label' : 'bs-fraction') + '">' + label + '</text>';
        }

        if (isNew) {
          markup += '<circle cx="' + x + '" cy="' + y + '" r="6" class="bs-midpoint bs-new"/>';
        }
      }

      markup += '</g>';
      return markup;
    }

    function render() {
      let markup = "";

      for (let level = 0; level <= current; level++) {
        markup += renderRow(level, level === current);
      }

      svg.innerHTML = markup;

      const intervals = 2 ** current;
      const spacing = current === 0 ? "1" : "1/" + intervals;

      status.textContent = describe(current);
      if (levelReadout) levelReadout.textContent = String(current);
      if (intervalsReadout) intervalsReadout.textContent = String(intervals);
      if (spacingReadout) spacingReadout.textContent = spacing;

      previous.disabled = current === 0;
      next.disabled = current === MAX_LEVEL;

      const newest = newFractionsForLevel(current);
      panel.dataset.newFractions = newest.join(", ");
    }

    function stop() {
      if (timer) clearInterval(timer);
      timer = null;
      play.textContent = "Play";
    }

    function advance() {
      if (current < MAX_LEVEL) {
        current += 1;
        render();
      } else {
        stop();
      }
    }

    previous.addEventListener("click", () => {
      stop();
      current = Math.max(0, current - 1);
      render();
    });

    next.addEventListener("click", () => {
      stop();
      advance();
    });

    reset.addEventListener("click", () => {
      stop();
      current = 0;
      render();
    });

    play.addEventListener("click", () => {
      if (timer) {
        stop();
        return;
      }

      if (current === MAX_LEVEL) current = 0;
      render();
      play.textContent = "Pause";
      timer = setInterval(advance, 1500);
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
    boardEntries.push({ board, panel, host });

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
    if (!panel || panel.dataset.ready === "1" || !window.JXG) return;
    panel.dataset.ready = "1";

    const host = panel.querySelector("[data-euclidean-board]");
    const button = panel.querySelector("[data-geometry-toggle-button]");
    if (!host || !button) return;

    if (!host.id) host.id = "euclidean-board-" + Math.random().toString(36).slice(2);

    const board = JXG.JSXGraph.initBoard(host.id, {
      boundingbox: [-5.2, 3.4, 5.2, -3.4],
      axis: false,
      grid: false,
      showNavigation: false,
      showCopyright: false,
      keepAspectRatio: true,
      pan: { enabled: false },
      zoom: { enabled: false }
    });
    boardEntries.push({ board, panel, host });

    const colors = {
      ink: "#e8eef7",
      blue: "#7dd3fc",
      gold: "#fbbf24",
      green: "#4ade80",
      helper: "#94a3b8",
      axis: "#64748b",
      grid: "#263247"
    };

    const pointStyle = {
      size: 5,
      strokeWidth: 2,
      label: { fontSize: 18, offset: [10, 10], color: colors.ink }
    };

    const A = board.create("point", [-3.4, -1.3], {
      name: "A",
      fillColor: colors.gold,
      strokeColor: colors.gold,
      ...pointStyle
    });

    const B = board.create("point", [1.9, 1.1], {
      name: "B",
      fillColor: colors.gold,
      strokeColor: colors.gold,
      ...pointStyle
    });

    const C = board.create("point", [2.4, -1.1], {
      name: "C",
      fillColor: colors.green,
      strokeColor: colors.green,
      ...pointStyle
    });

    const baseLine = board.create("line", [A, B], {
      strokeColor: colors.blue,
      strokeWidth: 3,
      highlight: false
    });

    board.create("circle", [A, B], {
      strokeColor: colors.gold,
      strokeWidth: 3,
      fillOpacity: 0,
      highlight: false
    });

    const perpendicular = board.create("perpendicular", [baseLine, C], {
      strokeColor: colors.green,
      strokeWidth: 3,
      highlight: false
    });

    board.create("intersection", [perpendicular, baseLine, 0], {
      name: "D",
      size: 4,
      fillColor: colors.ink,
      strokeColor: colors.ink,
      label: { fontSize: 17, offset: [10, -20], color: colors.ink },
      fixed: true,
      highlight: false
    });

    board.create("text", [-4.9, 2.9, "Drag A, B and C"], {
      color: colors.helper,
      fontSize: 16,
      fixed: true,
      highlight: false
    });

    const coordinateObjects = [];

    for (let x = -5; x <= 5; x += 1) {
      coordinateObjects.push(board.create("segment", [[x, -3.2], [x, 3.2]], {
        strokeColor: colors.grid,
        strokeWidth: 1,
        fixed: true,
        highlight: false,
        visible: false
      }));
    }

    for (let y = -3; y <= 3; y += 1) {
      coordinateObjects.push(board.create("segment", [[-5, y], [5, y]], {
        strokeColor: colors.grid,
        strokeWidth: 1,
        fixed: true,
        highlight: false,
        visible: false
      }));
    }

    coordinateObjects.push(board.create("line", [[-5, 0], [5, 0]], {
      strokeColor: colors.axis,
      strokeWidth: 2,
      fixed: true,
      highlight: false,
      visible: false
    }));

    coordinateObjects.push(board.create("line", [[0, -3], [0, 3]], {
      strokeColor: colors.axis,
      strokeWidth: 2,
      fixed: true,
      highlight: false,
      visible: false
    }));

    let coordinatesVisible = false;

    function renderCoordinateSystem() {
      coordinateObjects.forEach(object => object.setAttribute({ visible: coordinatesVisible }));
      button.textContent = coordinatesVisible ? "Hide coordinate system" : "Show coordinate system";
      board.fullUpdate();
    }

    button.addEventListener("click", () => {
      coordinatesVisible = !coordinatesVisible;
      renderCoordinateSystem();
    });

    renderCoordinateSystem();
  }

  const panelHomes = new Map();
  let activePanel = null;
  let revealInputState = null;
  let nativeStageFullscreen = false;
  let closingStage = false;

  function getInteractiveStage() {
    return {
      stage: document.getElementById("interactive-stage"),
      content: document.getElementById("interactive-stage-content")
    };
  }

  function resizePanel(panel) {
    boardEntries
      .filter(entry => entry.panel === panel)
      .forEach(entry => {
        try {
          entry.board.updateContainerDims();
          entry.board.fullUpdate();
        } catch (_) {}
      });
  }

  function schedulePanelResize(panel) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => resizePanel(panel));
    });
  }

  function setPanelFullscreenButton(panel, expanded) {
    const button = panel?.querySelector("[data-panel-fullscreen]");
    if (!button) return;

    button.textContent = expanded ? "Exit full screen" : "Full screen";
    button.setAttribute("aria-label", expanded ? "Return animation to the slide" : "Open animation full screen");
    button.setAttribute("aria-pressed", expanded ? "true" : "false");
  }

  function suspendRevealInput() {
    if (!window.Reveal || !Reveal.isReady() || revealInputState) return;

    const config = Reveal.getConfig();
    revealInputState = {
      keyboard: config.keyboard,
      touch: config.touch
    };

    Reveal.configure({
      keyboard: false,
      touch: false
    });
  }

  function restoreRevealInput() {
    if (!window.Reveal || !Reveal.isReady() || !revealInputState) return;

    Reveal.configure({
      keyboard: revealInputState.keyboard,
      touch: revealInputState.touch
    });

    revealInputState = null;
  }

  function finalizeInteractiveStageClose() {
    if (!activePanel) return;

    const panel = activePanel;
    const marker = panelHomes.get(panel);
    const { stage, content } = getInteractiveStage();

    if (marker?.parentNode) {
      marker.parentNode.insertBefore(panel, marker);
      marker.remove();
    }

    panelHomes.delete(panel);
    panel.classList.remove("interactive-stage-panel");
    setPanelFullscreenButton(panel, false);

    activePanel = null;
    nativeStageFullscreen = false;

    if (content) content.replaceChildren();
    if (stage) {
      stage.hidden = true;
      stage.setAttribute("aria-hidden", "true");
    }

    document.body.classList.remove("interactive-stage-open");
    restoreRevealInput();

    schedulePanelResize(panel);
    setTimeout(() => {
      try {
        Reveal.layout();
      } catch (_) {}
    }, 0);
  }

  async function closeInteractiveStage() {
    if (!activePanel) return;

    const { stage } = getInteractiveStage();

    if (document.fullscreenElement === stage) {
      closingStage = true;
      try {
        await document.exitFullscreen();
      } catch (_) {}
      closingStage = false;
    }

    finalizeInteractiveStageClose();
  }

  async function openInteractiveStage(panel) {
    if (!panel) return;

    if (activePanel === panel) {
      await closeInteractiveStage();
      return;
    }

    if (activePanel) {
      await closeInteractiveStage();
    }

    const { stage, content } = getInteractiveStage();
    if (!stage || !content) return;

    const marker = document.createComment("interactive-panel-home");
    panel.parentNode.insertBefore(marker, panel);
    panelHomes.set(panel, marker);

    activePanel = panel;
    panel.classList.add("interactive-stage-panel");
    content.appendChild(panel);

    stage.hidden = false;
    stage.setAttribute("aria-hidden", "false");
    document.body.classList.add("interactive-stage-open");
    setPanelFullscreenButton(panel, true);
    suspendRevealInput();
    schedulePanelResize(panel);

    if (stage.requestFullscreen) {
      try {
        await stage.requestFullscreen();
        nativeStageFullscreen = true;
      } catch (_) {
        nativeStageFullscreen = false;
      }
    }

    schedulePanelResize(panel);
  }

  function initPanelFullscreen(panel) {
    if (!panel || panel.dataset.fullscreenReady === "1") return;
    panel.dataset.fullscreenReady = "1";

    let toolbar = panel.querySelector(":scope > .interactive-toolbar");
    if (!toolbar) {
      toolbar = document.createElement("div");
      toolbar.className = "interactive-toolbar interactive-toolbar-generated";
      panel.prepend(toolbar);
    }

    const button = document.createElement("button");
    button.type = "button";
    button.className = "interactive-button panel-fullscreen-button";
    button.dataset.panelFullscreen = "1";
    button.textContent = "Full screen";
    button.setAttribute("aria-label", "Open animation full screen");
    button.setAttribute("aria-pressed", "false");
    toolbar.appendChild(button);

    button.addEventListener("click", event => {
      event.stopPropagation();
      if (activePanel === panel) {
        closeInteractiveStage();
      } else {
        openInteractiveStage(panel);
      }
    });
  }

  if (!window.__presentationInteractiveStageBound) {
    window.__presentationInteractiveStageBound = true;

    document.addEventListener("fullscreenchange", () => {
      if (
        activePanel &&
        nativeStageFullscreen &&
        !document.fullscreenElement &&
        !closingStage
      ) {
        finalizeInteractiveStageClose();
      } else if (activePanel) {
        schedulePanelResize(activePanel);
      }
    });

    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && activePanel && !document.fullscreenElement) {
        closeInteractiveStage();
      }
    });

    window.addEventListener("resize", () => {
      if (activePanel) schedulePanelResize(activePanel);
    });
  }

  function init(root) {
    root.querySelectorAll(".interactive-panel").forEach(initPanelFullscreen);
    root.querySelectorAll("[data-cartesian-construction]").forEach(initCartesianConstruction);
    root.querySelectorAll("[data-bisection-scale]").forEach(initBisectionScale);
    root.querySelectorAll("[data-coordinate-shift]").forEach(initCoordinateShift);
    root.querySelectorAll("[data-distance-geometry]").forEach(initDistanceGeometry);
    root.querySelectorAll("[data-function-generator]").forEach(initFunctionGenerator);
    root.querySelectorAll("[data-geometry-toggle]").forEach(initGeometryToggle);
  }

  function refresh() {
    boardEntries.forEach(entry => {
      try {
        entry.board.updateContainerDims();
        entry.board.fullUpdate();
      } catch (_) {}
    });
  }

  window.PresentationInteractives = { init, refresh, resizePanel };

})();
