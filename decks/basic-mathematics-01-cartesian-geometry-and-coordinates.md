# Lecture 01
## Cartesian Geometry and Coordinates

**Basic Mathematics**

> A mathematical object and its representation are not the same thing.

<span class="muted">From Euclidean geometry to ordered pairs, distance formulas, and equations that generate points.</span>

---

# 1. Geometry exists before coordinates

Points, lines, circles, intersections, perpendicularity and length have geometric meaning **before** we choose numbers.

<div class="interactive-panel" data-geometry-toggle>
  <div class="interactive-toolbar">
    <strong>Same geometry, optional coordinates</strong>
    <button class="interactive-button" type="button" data-geometry-toggle-button>Show coordinate system</button>
  </div>
  <svg class="geometry-svg" viewBox="0 0 800 420" role="img" aria-label="A Euclidean geometric scene with optional coordinate axes">
    <g data-geometry-axes class="geometry-axes">
      <line x1="80" y1="230" x2="740" y2="230" class="cg-axis"/>
      <line x1="360" y1="370" x2="360" y2="50" class="cg-axis"/>
      <g class="geometry-grid">
        <line x1="160" y1="50" x2="160" y2="370"/><line x1="240" y1="50" x2="240" y2="370"/>
        <line x1="440" y1="50" x2="440" y2="370"/><line x1="520" y1="50" x2="520" y2="370"/>
        <line x1="600" y1="50" x2="600" y2="370"/><line x1="680" y1="50" x2="680" y2="370"/>
        <line x1="80" y1="150" x2="740" y2="150"/><line x1="80" y1="310" x2="740" y2="310"/>
      </g>
    </g>
    <circle cx="250" cy="160" r="88" class="geo-circle"/>
    <line x1="110" y1="330" x2="690" y2="90" class="geo-line"/>
    <line x1="495" y1="45" x2="495" y2="355" class="geo-perp"/>
    <circle cx="250" cy="160" r="8" class="geo-point"/><text x="266" y="150" class="cg-label">A</text>
    <circle cx="520" cy="160" r="8" class="geo-point"/><text x="536" y="150" class="cg-label">B</text>
    <circle cx="495" cy="171" r="8" class="geo-point"/><text x="510" y="193" class="cg-label">C</text>
  </svg>
</div>

**Removing the coordinate system does not remove the geometry.**

---

# 2. Why introduce coordinates?

Coordinates solve a representation problem.

We need to choose:

1. an **origin** — a reference point;
2. two **axes** — directions of measurement;
3. an **orientation** — positive and negative directions;
4. a **unit** — a numerical scale.

Only after these choices does a point receive an ordered pair.

$$
P \longleftrightarrow (x,y)
$$

---

# 3. Constructing the Cartesian plane

The coordinate system is not drawn “all at once”. It is **constructed** from Euclidean operations.

<div class="interactive-panel cartesian-panel" data-cartesian-construction>
  <div class="interactive-toolbar">
    <div>
      <strong data-cartesian-title>Begin with the Euclidean plane</strong>
      <span class="interactive-status" data-cartesian-status></span>
    </div>
  </div>
  <div class="jxgbox presentation-board" data-cartesian-board></div>
  <div class="interactive-controls">
    <button class="interactive-button" type="button" data-cartesian-previous>Previous</button>
    <button class="interactive-button" type="button" data-cartesian-next>Next</button>
    <button class="interactive-button" type="button" data-cartesian-play>Play</button>
    <button class="interactive-button" type="button" data-cartesian-reset>Reset</button>
  </div>
</div>

<span class="small">Axes → origin → orientation → unit → repeated transfer → subdivision → projection.</span>

---

# 4. From a unit segment to a numerical scale

A unit is a **geometric length** that we decide to call \(1\).

Repeated transfer produces integers:

$$
0,\;1,\;2,\;3,\ldots
$$

Repeated bisection produces finer marks:

$$
\frac12,\qquad
\frac14,\qquad
\frac34,\qquad
\frac18,\ldots
$$

> The numerical line is built by attaching numbers to geometric positions.

---

# 5. The same point can have different coordinates

The point is a geometric object. Its coordinates depend on the chosen frame.

<div class="interactive-panel" data-coordinate-shift>
  <div class="coordinate-readout" data-coordinate-readout>P = (2.00, 1.00)</div>
  <svg class="geometry-svg coordinate-shift-svg" viewBox="0 0 800 420" data-coordinate-svg></svg>
  <div class="slider-grid">
    <label>Move origin horizontally
      <input type="range" min="-2" max="2" step="0.25" value="0" data-origin-x>
    </label>
    <label>Move origin vertically
      <input type="range" min="-1.5" max="1.5" step="0.25" value="0" data-origin-y>
    </label>
    <label>Change scale
      <input type="range" min="0.6" max="1.6" step="0.1" value="1" data-scale>
    </label>
  </div>
</div>

**What changed?** The description.  
**What stayed fixed?** The geometric point.

---

# 6. Coordinate correspondence

Once the axes, positive directions and unit are fixed, orthogonal projection assigns a unique pair of real numbers to every point.

$$
P \longleftrightarrow (x,y)\in\mathbb{R}^2
$$

Conversely, every ordered pair determines exactly one point.

<div class="formula-box">

$$
\begin{aligned}
\text{Euclidean plane with a chosen Cartesian frame}
&\longleftrightarrow \mathbb{R}^2.
\end{aligned}
$$

</div>

The plane and \(\mathbb{R}^2\) are linked by a **representation**.

---

# 7. Geometry becomes computation

Take

$$
P=(x_1,y_1),\qquad Q=(x_2,y_2).
$$

Build the auxiliary point

$$
R=(x_2,y_1).
$$

Then \(PR\) is horizontal and \(RQ\) is vertical.

<div class="interactive-panel" data-distance-geometry>
  <div class="jxgbox presentation-board distance-board" data-distance-board></div>
  <div class="distance-readout">
    <span>Δx = <strong data-distance-dx>3.0</strong></span>
    <span>Δy = <strong data-distance-dy>4.0</strong></span>
    <span>d(P,Q) = <strong data-distance-value>5.00</strong></span>
  </div>
</div>

<span class="small">Drag \(P\) or \(Q\). The triangle changes, and the numbers follow the geometry.</span>

---

# 8. The distance formula is translated geometry

From the visible right triangle,

$$
PR=|x_2-x_1|,
\qquad
RQ=|y_2-y_1|.
$$

Pythagoras gives

$$
d(P,Q)^2=(x_2-x_1)^2+(y_2-y_1)^2,
$$

so

<div class="formula-box">

$$
d(P,Q)=\sqrt{(x_2-x_1)^2+(y_2-y_1)^2}.
$$

</div>

The formula does **not invent distance**. It encodes an existing geometric length.

---

# 9. Minimal example

Let

$$
P=(1,1),\qquad Q=(4,5).
$$

Then

$$
\Delta x=3,\qquad \Delta y=4,
$$

hence

$$
d(P,Q)=\sqrt{3^2+4^2}=5.
$$

This is the basic pattern of analytic geometry:

$$
\text{geometry}
\longrightarrow
\text{construction}
\longrightarrow
\text{equation}
\longrightarrow
\text{number}.
$$

---

# 10. An equation can generate points

Now reverse the direction of thought.

Instead of assigning numbers to an existing point, let an algebraic rule produce points.

For

$$
y=2x+1,
$$

each input \(x\) generates the point

$$
(x,2x+1).
$$

<div class="interactive-panel" data-function-generator>
  <div class="coordinate-readout" data-function-readout></div>
  <svg class="geometry-svg function-svg" viewBox="0 0 800 420" data-function-svg></svg>
  <label class="single-slider">Choose \(x\)
    <input type="range" min="-4" max="4" step="0.5" value="1" data-function-x>
  </label>
</div>

---

# 11. A graph is a set of generated points

For \(y=2x+1\):

| \(x\) | \(y\) | point |
|---:|---:|---|
| \(-1\) | \(-1\) | \((-1,-1)\) |
| \(0\) | \(1\) | \((0,1)\) |
| \(1\) | \(3\) | \((1,3)\) |

The graph is the set

$$
\left\{(x,y)\in\mathbb{R}^2:\;y=2x+1\right\}.
$$

Again:

> object \(\neq\) representation.

---

# 12. Not every equation is a function \(y=f(x)\)

Consider the circle

$$
x^2+y^2=4.
$$

For a fixed \(x\),

$$
y=\pm\sqrt{4-x^2}.
$$

One input may correspond to two points.

So an equation can describe a geometric set even when it is **not** the graph of a single-valued function.

---

# 13. Intersections mean simultaneous conditions

A point belongs to the intersection of two objects exactly when it satisfies both conditions.

For example,

$$
y=2x+1
$$

and

$$
x^2+y^2=4.
$$

An intersection point must satisfy both equations at once.

This idea will later become a systematic method for solving systems of equations.

---

# 14. Regions come from inequalities

Equations describe boundaries or lower-dimensional sets. Inequalities describe whole regions.

For example,

$$
y\ge x^2-2
$$

and

$$
y\le x+2
$$

select all points lying **above** the parabola and **below** the line.

---

# 15. Parametric description

A curve can also be generated by one parameter:

$$
t\longmapsto (x(t),y(t)).
$$

For a circle of radius \(3\),

$$
x(t)=3\cos t,
\qquad
y(t)=3\sin t.
$$

One number \(t\) moves one point through the plane. The trace of that motion is the curve.

---

# 16. What Lecture 01 establishes

Three central ideas:

1. **Coordinates are a choice of representation.**
2. **Geometry can be translated into calculation.**
3. **Equations can generate sets of points.**

<div class="formula-box">

$$
\text{geometry}
\longleftrightarrow
\text{coordinates}
\longleftrightarrow
\text{algebra}
$$

</div>

---

# Bridge to Lecture 02

Coordinates describe **where a point is**.

They do not yet describe, by themselves, **how one state changes into another**.

> How do we encode both magnitude and direction of change?

That question leads to **vectors, bases and coordinate systems**.
