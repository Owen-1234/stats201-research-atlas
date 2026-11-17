# Between Data and Decisions · The Research Atlas · STATS 201

[Open the Research Atlas](https://owen-1234.github.io/stats201-research-atlas/) · [Four research papers](https://owen-1234.github.io/stats201-research-atlas/#sources)

An English-language, 30-minute research atlas by Shilin Ou, following Singapore, Shanghai, Jeju, and Rio de Janeiro. The Jeju study includes an RL primer and Udacity’s complete, approximately 2½-minute lesson. Before ViRel-Budget, Mısra Turp’s complete two-minute pruning video introduces the idea of selecting what computation to keep. Built as a static GitHub Pages site, with no build tools or package installation.

## Preview

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. The map, figures, and classroom interactions are local. The YouTube videos need an internet connection; serve the page over HTTP for the embedded player to receive the browser referrer it expects.

## Classroom controls

- Click a city or its full paper title to jump directly to the corresponding study. Each study ends with **Return to the Research Atlas** and a link to the next stop. The four paper links at the end open the corresponding OpenReview, ACM, or Duke Scholars record directly.
- Each paper title has a direct link to its OpenReview, ACM, or Duke Scholars record. Click a research figure for a full-resolution view; Escape closes the dialog.
- The financing studio uses a real discounted cash-flow LCOE model, with upfront investment, annual fixed O&M, annual degradation, and discounted energy. ATB 2024 published utility-scale PV cost inputs are normalized to 1 MW AC; selectable resource classes and editable real discount rates are explicit. Curves compare resources; scenario cards and a rate/lifetime matrix retain exact model values. Sources and exclusions are visible in the panel.
- The Shanghai map uses local OpenStreetMap geography. Choose Solar array or Factory, set capacity in the side panel, then click a point on land. An asset appears after a short construction delay and keeps reporting at that coordinate.
- Inspect a marker or select its device name to see readings. The map supports dragging and zooming; Remove deletes a chosen asset, and Reset restores the demonstration.
- Pause or accelerate the simulated clock, change cloud cover, or submit a solar report with a larger multiplier. Device values, map labels, supply/demand, and the report stream update together.
- Each video loads after a click. Opening one restores the other’s cover; Return to video cover removes the player.
- Explore the SolarChain-Eval liquidity state transition at two consecutive hours. Change liquidity support, burn and suspicious supply; the waterfall accounts for opening liquidity, added liquidity, matched demand and the next state. The illustrative states are labeled separately from recorded benchmark results, and the equations link to env.py.
- SolarChain-Eval: switch between the policy landscape and rollout box plots; choose an outcome, toggle recorded episodes or ±1 SD, and select a policy or individual rollout. Policy selections also update the main results table.
- The matched experiment view compares removal of the physics penalty with addition of the Planner/Auditor. Choose an outcome and policy, then inspect the paired-change histogram and four-condition matrix.
- Replay a recorded 24-hour PPO episode, select an hour, or choose hour 15 in the timeline. The proposal snapshot, recorded Planner intervals, final action and three paired action bars update together. No intermediate post-Planner action is inferred from the logs.
- The cost illustration compares proposed and executed placement, using a proportional ribbon flow and a 100-request grid.
- Hover or focus a ViRel method to highlight it across both charts and its reliability summary. The allocation and policy explorers retain the reported paper values.

## Vercel and the 3D experience

Production: **https://stats201-research-atlas.vercel.app/**.

The site is linked locally to the `stats201-research-atlas` project in the `owen1234` Vercel scope. `vercel.json` builds a static `dist/` with Node 24. No backend, API key, database, or external asset CDN is needed.

```sh
npm run dev       # http://127.0.0.1:4173
npm run check     # anchors, local files, script syntax, original evidence
npm run build     # produce the static dist/ directory
vercel --prod --scope owen1234
```

The new experience includes:

- A Three.js globe using the bundled land geography, four geographic study markers, raised research-route arcs, selectable cities, orbit/zoom controls, and a flat-map alternative.
- A three-dimensional view of the original 1,620 benchmark records. Its axes are cumulative reward, physics violation rate (percent), and artificial liquidity (MWh). The default view is a scatter plot of all recorded episodes in the current setting (90 per policy). Optional policy means and shared axes remain available. Tick precision adapts to small ranges. Removing the physics penalty changes the reward definition, so reward should be compared within each setting. Policy summaries, single-episode inspection, and CSV downloads retain the original recorded values.
- A warm-paper and deep-green visual system, mobile layouts, keyboard-accessible selection controls, reduced-motion support, and animation that pauses outside the viewport or in a background tab.
- A benchmark-specific liquidity ledger using the published environment transition equations, with a two-hour state carryover and an explicit artificial-liquidity measure.
- Paired experimental results shown as zero-baseline 3D columns, focused paired-value plots, or signed changes with ±1 paired SD.
- A request-routing ribbon diagram and 100-request grid that make the capacity repair and resulting reference charges visible.
- A local copy of Three.js 0.180.0 and its MIT license under `assets/vendor/three/`.

`experience.css` and `experience.js` own the additional presentation and progressive loading; `interactives.css` and `teaching-scenes.js` implement the benchmark transition and request-routing illustrations; `revision.css` styles the DCF, responsive chart alignment and audit decision review; `spatial.js` owns the WebGL scenes. If WebGL is unavailable, the atlas falls back to the original flat map and the evaluation section retains its original two-dimensional visualizations.

Automatic deployment uses the Vercel GitHub App with access to `Owen-1234/stats201-research-atlas`, the existing `stats201-research-atlas` Vercel project, and production branch `main`. The repository is connected: pushes to `main` build and publish this version; other branches receive preview deployments. Manual releases can also use the deploy command above.

## GitHub Pages

The public site is hosted at **https://owen-1234.github.io/stats201-research-atlas/**.

Pages publishes directly from the `main` branch and repository root. In **Settings → Pages**, the source is **Deploy from a branch → main → / (root)**. Updates pushed to `main` are published by GitHub Pages. The `.nojekyll` file keeps this buildless HTML/JavaScript site as static files.

All page, script, image, and evidence links use relative paths, so the site works under its repository URL. See [GitHub's publishing-source documentation](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Editing

- `index.html`: story and section order.
- `style.css`: base layout, visual system, responsive behavior, and print styles.
- `lesson.css`: classroom material, RL primer and video.
- `atlas.css`: full-title atlas navigation, study layout, financing and resource comparisons, and conclusion.
- `refinements.css`: shared chart feedback, video cover, and interaction details.
- `studios.css`: editorial palette, financing comparison, and geographic simulation layout.
- `studios.js`: financing controls, geographic placement, device inspector, and simulated reporting.
- `studio-models.js`: real discounted cash-flow financial model and deterministic device models.
- `assets/shanghai-basemap.svg`, `shanghai-map.js`: offline Shanghai map and projection/water geometry.
- `assets/shanghai-osm.geojson`, `shanghai-osm-source.xml.gz`, `shanghai-map-LICENSE.txt`: OSM source extract and attribution.
- `app.js`: paper metadata, interaction logic, and reported result tables.
- `eval-lab.css`, `eval-lab.js`: linked benchmark views, matched experiments, and the hourly audit replay.
- `eval-model.js`: sample statistics, box plots, paired differences, and histogram calculations.
- `assets/eval-evidence.js`: 1,620 exported evaluation records and the selected 24-hour trace.
- `evidence/`: downloadable CSV/JSON records and source-file hashes.
- `scripts/build_eval_evidence.py`: regenerate the evidence bundle from the local research runs and verify it against the manuscript.
- `assets/`: original research images and local map geometry.
- `notes/speaker-notes.md`: 30-minute speaking plan.
- `notes/sources.md`: figure provenance and numerical definitions.

Retain the figure attribution when reusing the page. The figures and project materials retain their original rights; this draft does not assign a new blanket license to them.

The Shanghai basemap and simulation make no live map, weather, wallet, or contract requests. All data needed for the map is bundled. OpenStreetMap-derived data remains under ODbL 1.0; its attribution stays visible in the map. The classroom energy assets are illustrative placements, not an inventory of actual installations.

The interactive evaluation results use the original experiment records. They make no training or LLM calls. `notes/sources.md` documents record populations, units, pairing, and uncertainty.
