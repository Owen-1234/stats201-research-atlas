# Between Data and Decisions · The Research Atlas · STATS 201

[Open the Research Atlas](https://stats201-research-atlas.vercel.app/) · [Four research papers](https://stats201-research-atlas.vercel.app/#sources)

An English-language, 30-minute research atlas by Shilin Ou, following Singapore, Shanghai, Jeju, and Rio de Janeiro. The Jeju study includes an RL primer and Udacity’s complete, approximately 2½-minute lesson. Before ViRel-Budget, Mısra Turp’s complete two-minute pruning video introduces the idea of selecting what computation to keep. The same static source serves Vercel and GitHub Pages.

## Preview

From this directory:

```sh
python3 -m http.server 4173 --bind 127.0.0.1
```

Open http://127.0.0.1:4173. The map, figures, and classroom interactions are local. The YouTube videos need an internet connection; serve the page over HTTP for the embedded player to receive the browser referrer it expects.

## Classroom controls

- Choose a research stop on the cover globe and follow its question. The reading route links the five research questions to their chapters. The chapter menu works throughout the page.
- Each paper title has a direct link to its OpenReview, ACM, or Duke Scholars record. All 19 original research and talk images have full-resolution views. Previous/Next and the arrow keys browse the current chapter. Escape returns to the page.
- The financing studio uses a real discounted cash-flow LCOE model, with upfront investment, annual fixed O&M, annual degradation, and discounted energy. ATB 2024 published utility-scale PV cost inputs are normalized to 1 MW AC; selectable resource classes and editable real discount rates are explicit. Curves compare resources. The 4%, 8% and 12% presets update the discount rate while preserving the other assumptions. The rate/lifetime matrix applies both inputs. Sources and exclusions are visible in the panel.
- The Shanghai map uses local OpenStreetMap geography. Choose Solar array or Factory, set capacity in the side panel, then click a point on land. An asset appears after a short construction delay and keeps reporting at that coordinate.
- Inspect a marker or select its device name to see readings. The map supports dragging and zooming; Remove deletes a chosen asset, and Reset restores the demonstration.
- Pause or accelerate the simulated clock, change cloud cover, or submit a solar report with a larger multiplier. Device values, map labels, supply/demand, and the report stream update together.
- Each video loads after a click. Opening one restores the other’s cover; Return to video cover removes the player.
- Explore the SolarChain-Eval liquidity state transition at two consecutive hours. Change liquidity support, burn and suspicious supply; the waterfall accounts for opening liquidity, added liquidity, matched demand and the next state. The illustrative states are labeled separately from recorded benchmark results, and the equations link to env.py.
- SolarChain-Eval: switch between the policy landscape and rollout box plots; choose an outcome, toggle recorded episodes or ±1 SD, and select a policy or individual rollout. Opening a main-setting episode from the 3D view carries its exact record into the 2D plot. Other settings carry the selected policy into the main comparison.
- The matched experiment view compares removal of the physics penalty with addition of the Planner/Auditor. Choose an outcome and policy, then inspect the paired-change histogram and four-condition matrix.
- Compare two recorded PPO decisions using a compact 3D action chart: an Auditor intervention at 15:00 and a Planner adjustment at 01:00. Paired columns show reward, liquidity and burn on a common 0–100% scale. The full 24-hour source record remains downloadable.
- The original Who Bears the Cost project flowchart is displayed above the simplified introduction and can be expanded to full resolution. The ongoing research illustration follows one Web AI request from its proposed host through a runtime check to its executed host. A single GPU-busy switch changes the executed device and its resource account.
- The Shanghai allocation dot plot shows the five published splits on a common fulfillment scale. Select a row to inspect the producer reward and slippage proxy.
- The ViRel comparison aligns measured GPU energy and its 95% confidence interval with dense avoidance and unsafe acceptance. Choose a model size and select a method for the numerical reading.

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

- A full-width Three.js globe using the bundled land geography, four geographic study markers, raised research-route arcs, selectable cities, and orbit and zoom controls.
- A three-dimensional view of the original 1,620 benchmark records. Its axes are cumulative reward, physics violation rate (percent), and artificial liquidity (MWh). The default view is a scatter plot of all recorded episodes in the current setting (90 per policy). Optional policy means and shared axes remain available. Tick precision adapts to small ranges. Removing the physics penalty changes the reward definition, so reward should be compared within each setting. Policy summaries, single-episode inspection, and CSV downloads retain the original recorded values.
- A warm-paper and deep-green visual system, mobile layouts, keyboard-accessible selection controls, reduced-motion support, and animation that pauses outside the viewport or in a background tab.
- A benchmark-specific liquidity ledger using the published environment transition equations, with a two-hour state carryover and an explicit artificial-liquidity measure.
- Paired experimental results shown as zero-baseline 3D columns, focused paired-value plots, or signed changes with ±1 paired SD.
- A single-request placement sketch connecting runtime repair with user-side or institutional resource accounts, using one availability switch.
- A local copy of Three.js 0.180.0 and its MIT license under `assets/vendor/three/`.

`experience.css` and `experience.js` own the additional presentation and progressive loading; `interactives.css` and `teaching-scenes.js` implement the benchmark transition and request-routing illustrations; `revision.css` styles the DCF and responsive chart alignment; `simple-scenes.css` styles the compact 3D action comparison and placement introduction; `spatial.js` owns the WebGL scenes. If WebGL is unavailable, the research stop selector and chapter links still work. The evaluation section retains its two-dimensional visualizations.

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
- `reading-room.css`: atlas cover, chapter menu, original-figure navigation and paper-result charts.
- `notes/sources.md`: figure provenance and numerical definitions.

Retain the figure attribution when reusing the page. The figures and project materials retain their original rights; this draft does not assign a new blanket license to them.

The Shanghai basemap and simulation make no live map, weather, wallet, or contract requests. All data needed for the map is bundled. OpenStreetMap-derived data remains under ODbL 1.0; its attribution stays visible in the map. The classroom energy assets are illustrative placements, not an inventory of actual installations.

The interactive evaluation results use the original experiment records. They make no training or LLM calls. `notes/sources.md` documents record populations, units, pairing, and uncertainty.
