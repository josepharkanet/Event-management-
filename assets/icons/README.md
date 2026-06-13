# Icons

Icons are **inline SVG** directly in `index.html` (no icon-font dependency, per
the PRD). This keeps the site dependency-free and offline-capable, and lets
icons inherit `currentColor`.

If you prefer to extract them into standalone files, drop the `.svg` here and
reference them with `<img>` or `<use>` — but inline remains the recommended
approach for this project.
