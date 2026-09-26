# Presentations

A lightweight Reveal.js presentation viewer for mathematics and physics.

## Architecture

- `viewer/` contains the presentation application deployed to GitHub Pages.
- `decks/` contains presentation content.
- The browser loads the presentation list and slide content directly from the `main` branch through the GitHub Contents API.
- Changes made only inside `decks/` do not require a new viewer deployment.
- A new presentation is added as a new file in `decks/`.
- Slides inside a deck are separated with a line containing `---`.
- Mathematical notation is rendered with MathJax.

## Source material and course structure

When creating or revising presentations in this repository, use the following course repository as the primary reference for terminology, ordering of topics, examples, and the intended mathematical development:

**Basic Mathematics Lecture**  
https://github.com/dchorazkiewicz/Basic_Mathematics_Lecture

Lecture plan:  
https://github.com/dchorazkiewicz/Basic_Mathematics_Lecture/tree/main/lecture-plan

In particular, for the construction of Cartesian space, coordinate systems, points, vectors, bases, and the transition from geometry to linear algebra, use these lecture-plan sources as the main reference:

- Cartesian Geometry and Coordinates  
  https://github.com/dchorazkiewicz/Basic_Mathematics_Lecture/blob/main/lecture-plan/01-cartesian-geometry-and-coordinates.md
- Vectors, Bases and Coordinate Systems  
  https://github.com/dchorazkiewicz/Basic_Mathematics_Lecture/blob/main/lecture-plan/02-vectors-bases-and-coordinate-systems.md
- Lines and Planes  
  https://github.com/dchorazkiewicz/Basic_Mathematics_Lecture/blob/main/lecture-plan/03-lines-and-planes.md

The presentation sequence should remain broadly consistent with the course structure in that repository unless there is a specific reason to deviate.

## GitHub Pages

GitHub Pages is configured to deploy the viewer through GitHub Actions.

The viewer should only need a new deployment when files in `viewer/` or the Pages workflow change. Presentation-content edits in `decks/` are intended to become visible after commit and refresh, without rebuilding the viewer.
