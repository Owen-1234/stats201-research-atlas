# Sources and figure credits

Prepared and expanded 16 November 2026 for an English-language STATS 201 classroom talk. Academic-research-suite was used inline for source checking. Site structure, summaries, and teaching illustrations were prepared with AI assistance. Paper figures are reproduced from the presenter's supplied local research materials; individual source rights remain with their creators.

## Research stops

The presenter supplied these city/project associations: Singapore — Capital Cost; Rio de Janeiro — ViRel-Budget; Shanghai — SolarChain; Jeju Island — SolarChain-Eval. The map connects research topics, rather than asserting a dated itinerary. Geographic coordinates are approximate city centers.

## SolarChain

**Title:** SolarChain: A Physics-Grounded Embodied IoT System for Verifiable Urban Solar Market Design.

**Authors:** Shilin Ou, Yifan Xu, Zhenshan Zhang, Luyao Zhang, Ming-Chun Huang.

- [Duke Scholars paper record](https://scholars.duke.edu/publication/1828101)
- [EIoT 2026 conference program](https://eiot-workshop.github.io/#section-program)
- [Public repository](https://github.com/Global-Nomad-Nexus/SolarSave)
- Local source directory: `SolarChain Camera Ready/` in the supplied SolarChain workspace.
- Read: `Main.tex`, `Introduction.tex`, `Evaluation.tex`, plus the existing local talk script.
- Venue metadata in the camera-ready: UbiComp Companion 2026, Shanghai, October 11–15, 2026.

| Site asset | Original file |
| --- | --- |
| solarchain-architecture.png | architecture_camera_ready.png |
| solarchain-physics.png | canonical_02_physics_bounded_anomaly_scatter.png |
| solarchain-cities.png | canonical_04_china_urban_fdia_combined_map_camera_ready.png |
| solarchain-console.png | planner-decision-console.png |
| solarchain-market.png | market-impact-liquidity.png |

The 50 nodes, five cities, 36,000 records, monthly F1 scores, and allocation entries are from `Evaluation.tex`. Allocation display: fulfillment ratio × 100, reward in kWh, and slippage percentage. Five reported rows are shown out of the 41 tested allocations. No unreported allocation is interpolated.

The physical-bound slider is an independent teaching model: `P_max(h) = 8 sin(π(h−6)/12)` kW for 06:00 < h < 18:00, and zero otherwise. It is not the paper's weather-conditioned PV model or detector implementation.

## SolarChain-Eval

**Title:** SolarChain-Eval: A Physics-Constrained Benchmark for Trustworthy Economic Agents in Decentralized Energy Markets.

**Authors:** Shilin Ou, Yifan Xu, Luyao Zhang.

- [Public repository, manuscript, and poster](https://github.com/Global-Nomad-Nexus/SolarChain-Eval)
- [OpenReview paper](https://openreview.net/forum?id=XcWTS5iVvY)
- [KDD evaluation workshop and accepted papers](https://kdd-eval-workshop.github.io/agenticai-evaluation-kdd2026/)
- [KDD 2026 official location](https://kdd2026.kdd.org/): Jeju, South Korea.
- Local canonical source for this site: `Solar_RL/SolarChain_Eval_KDD_AgenticAI_Camera_Ready_arXiv_latest/`.
- Read: `Main.tex`, `architecture.tex`, and `evaluation.tex`. Other NeurIPS variants exist locally; their numerical tables were not mixed into this explorer.

| Site asset | Original file in figures/ |
| --- | --- |
| eval-workflow.png | SolarChain_Eval_KDD_agentic_benchmark_logic.drawio-4.pdf, rendered first page |
| eval-governance.png | solarchain_ai_agent_rl_interaction.drawio-2.pdf, rendered first page |
| eval-frontier.png | fig_1b_rq1_utility_safety_frontier.png |
| eval-ablation.png | fig_3b_rq2_artificial_liquidity_bars.png |
| eval-stability.png | fig_4a_rq3_action_stability.png |
| eval-audit.png | fig_5b_rq4_action_revision_bars.png |

The current interactive results use the original episode records, with 90 rollouts per policy/condition across three seeds (see Revision 6 below). Means, sample standard deviations, distributions, and paired changes are computed from these records. The following entries provide the manuscript-rounded results for reference.

| Policy | Constrained RL reward | Constrained RL artificial liquidity (MWh) | No-physics reward delta | No-physics artificial-liquidity delta |
| --- | ---: | ---: | ---: | ---: |
| PPO | −22.35 | 0.1453 | +22.61 | +0.0785 |
| SAC | −22.26 | 0.0686 | +22.52 | +0.1238 |
| DQN | −23.23 | 0.1298 | +23.55 | +0.0576 |

| Policy | LLM reward delta | LLM artificial-liquidity delta | LLM no-physics reward delta | LLM no-physics artificial-liquidity delta |
| --- | ---: | ---: | ---: | ---: |
| PPO | −0.094 | −0.0074 | +22.67 | +0.0598 |
| SAC | −0.062 | +0.0073 | +22.62 | +0.1149 |
| DQN | −0.277 | +0.0109 | +23.78 | +0.0413 |

The paired experiments compare shared physical and market outcomes across the reward settings. LLM oversight evaluates frozen trained policies.

## Capital Cost

**Title in local manuscript:** Fossil Fuel Prices and Capital Cost: A Machine Learning Driven Study on Energy Transition.

- [OpenReview paper record](https://openreview.net/forum?id=ary7hTgqkx), identified from the official [OpenReview attachment](https://openreview.net/attachment?id=ary7hTgqkx&name=pdf).

- User-supplied repository: [ImpactOfFossilFuelPrice-WACC](https://github.com/Global-Nomad-Nexus/ImpactOfFossilFuelPrice-WACC). Unavailable through both public retrieval and the connected repository tool during preparation.
- Local material: `Desktop/fuel/IEEE_FossilFuel_WACC_Rewrite/`.
- Read: `sections/introduction.tex` and `sections/results.tex`.
- `capital-workflow.png`: rendered from `figures/fossilfuel_wacc_methodology_model_relations.drawio.pdf`.
- `capital-results.png`: copied from `figures/figure.png`.

The local rewrite includes ACAIT 2026 framing, while the presenter associates the project with a Singapore research stop. This draft uses the presenter’s city and does not infer an exact conference name or date. The local results describe a constructed 2026–2035 panel, fixed holdout, and rolling-origin checks. Interpret model fit as scenario sensitivity rather than an identified causal effect.

## ViRel-Budget

- [User-supplied repository](https://github.com/Global-Nomad-Nexus/ViRel-Budget)
- [Maintained source repository](https://github.com/SeanWan514/ViRel-Budget)
- [ACM proceedings paper](https://dl.acm.org/doi/10.1145/3840750.3841450), supplied by the presenter; the title and DOI also match the publisher-deposited Crossref record.
- Verified public README: frozen controller, workload splits, replication population, measured GPU energy, and the workshop oral-presentation statement.
- [ACM Multimedia 2026 venue](https://2026.acmmm.org/site/venue.html): Rio de Janeiro, November 10–14, 2026.
- Local figures: `Desktop/高端版减脂SRS/ViRel_Budget_GreenMM_Slides_LaTeX/figures/`.

`virel-workflow.png` is rendered from `virel_framework.pdf`; `virel-energy.png` from `energy_results.pdf`. The 11.87% and 10.62% reductions are README-reported SCOPE results for 7B and 13B in the 630-query replication population. They are not presented as prospective reliability rates or universal energy savings. The local talk figures and public release are credited separately.

## Who Bears the Cost? — ongoing work

- User-supplied repository: [who-bears-the-cost](https://github.com/Owen-1234/who-bears-the-cost), unavailable through public and connected retrieval during preparation.
- Local source: `Desktop/www/who-bears-the-cost/README.md`.
- `cost-placement.png` is copied unchanged from `docs/assets/placement.png`.
- The repository describes proposed/executed placements, deterministic runtime repair, party-level GPU energy and reference-charge accounts, Decision Accountability Receipts, and independent verification.

This site introduces the ongoing question and architecture, without reproducing submitted manuscript text, benchmark results, or model weights. Its cost slider is a separate equal-cost teaching illustration: 100 identical requests, capacity-limited user placement, remaining requests assigned to the institution, and one reference unit per request.

## Map and technical assets

- Land geometry: [Natural Earth 1:110m land](https://github.com/nvkelso/natural-earth-vector/blob/master/geojson/ne_110m_land.geojson), public-domain cartographic data.
- `world-land.svg` is an equirectangular rendering of those polygons, with a latitude window from 85° N to 60° S.
- City markers and labels are presentation annotations. Land geometry does not represent conference sites at street level.
- Type uses local system fonts; no external font service, map tile service, API key, tracker, or model call is required to view the page.
- PDF preflight sidecars in this folder record read-integrity results for the five rendered diagrams. Full-resolution paper figures remain available through the image viewer.


## Reinforcement learning background added in revision 2

The classroom primer explains policy, state, action, reward, episode, return, discounting, exploration, and the Markov modeling assumption. It keeps the rule-based verifier distinct from the learned market policies.

Primary teaching references:

- [Hugging Face Deep RL Course: the reinforcement learning framework](https://huggingface.co/learn/deep-rl-course/unit1/rl-framework).
- [Hugging Face: exploration and exploitation](https://huggingface.co/learn/deep-rl-course/unit1/exp-exp-tradeoff).
- [Sutton and Barto, Reinforcement Learning: An Introduction, second edition (MIT Press, 2018)](https://mitpress.mit.edu/9780262039246/reinforcement-learning/). Publisher metadata verified; the author-hosted book endpoint was unavailable during this session.
- [Schulman et al. (2017), Proximal Policy Optimization Algorithms](https://arxiv.org/abs/1707.06347).
- [Haarnoja et al. (2018), Soft Actor-Critic](https://arxiv.org/abs/1801.01290).
- [Mnih et al. (2013), Playing Atari with Deep Reinforcement Learning](https://arxiv.org/abs/1312.5602).

The battery exercise is newly authored teaching material. It has two time steps, two energy units, a lossless battery of capacity two, noon price one, evening price three, sufficient demand at both steps, and no storage fee. If the reader stores k units, the rewards are 2-k now and 3k later. Discounted return is (2-k) + gamma(3k). At gamma=0.9 the three action returns are 2.00, 3.70, and 5.40. It does not train an RL model or implement the SolarChain market.

The newly displayed detector table is transcribed from SolarChain's `evaluation_floats.tex`; the main policy table is from SolarChain-Eval's `evaluation.tex`. Violation rates and their standard deviations were multiplied by 100 to display percentages. Algorithm action-space descriptions, episode length, reward terms, and the 0.98 allocation limit are from `architecture.tex`. The selected audit action values are from the paper's case-study table.

## Classroom video (updated in revision 4)

**Udacity, Reinforcement Learning Basics.**

- [Original video, official Udacity channel](https://www.youtube.com/watch?v=2xATEwcRpy8).
- The complete video is approximately 2½ minutes. The watch player displayed 2:27; YouTube’s search result rounded its duration to 2:28. The page therefore uses “2½ min” consistently.
- Direct browser review confirmed hand-drawn agent/environment diagrams and English captions. The lesson introduces the action, state, and reward exchange. Embedded playback was verified on the local HTTP preview.
- At review, the official verified channel’s listing showed approximately 250,000 views and 1,372 likes. These are observed counts, not a quality score, and are not displayed on the classroom page.
- The credited `youtube-nocookie.com` iframe loads after a click. It plays the complete video without start or end parameters. No video or audio is downloaded or redistributed.
- [YouTube embedded-player parameter reference](https://developers.google.com/youtube/player_parameters).

## Editorial revision

The expanded page uses specific descriptions of the data, reward, baselines, and interventions. General slogans and repeated rhetorical questions were replaced with study details. The original manuscript titles, citations, reported numbers, and study scope are retained. Humanizer was used as an editorial guide, with the local speech script as the reference for a direct spoken register.


## Revision 3: an atlas of four studies

The body now follows Singapore (Capital Cost), Shanghai (SolarChain), Jeju (SolarChain-Eval, including the RL primer), and Rio (ViRel-Budget). Map markers and the full paper titles beneath them are native links to those sections. The conclusion discusses representation, operational definitions, distributional consequences, and evidence for using a model.

- Capital Cost method details were checked against `Desktop/fuel/IEEE_FossilFuel_WACC_Rewrite/sections/methodology.tex`. The added `capital-forecast.png` is an unchanged copy of that manuscript's `figures/Accuracy.png`. The manuscript identifies the comparison as oil-price forecasts on 2021–2024 using training data through 2020.
- The financing slider is newly authored teaching material, not a result of the WACC regression. It calculates annual capital recovery for a $1,000 asset over 20 years: `1000*r/(1-(1+r)**(-20))`. WACC is used as a discount-rate input. Other financial adjustments and operating expenses are omitted from this example.
- The annuity relation is documented by the [2024 Annual Technology Baseline equations and variables](https://atb.nlr.gov/electricity/2024/equations_%26_variables), in the capital recovery factor definition.
- The ViRel paper title is taken from the newer local `Desktop/高端版减脂SRS/ViRel_Budget_GreenMM-2/main.tex`: **ViRel-Budget: Reliability-Constrained Visual-Token Budgeting for Green Vision-Language Inference**. That source lists Sean Wan, Shilin Ou, and Luyao Zhang as authors. The older `ViRel_Budget_GreenMM_Latex` draft has an earlier title and was not used to name the atlas entry.
- The new ViRel charts transcribe the 7B/13B replication rows in the [public README](https://github.com/Global-Nomad-Nexus/ViRel-Budget). Energy change uses the opposite sign from energy reduction: SCOPE is −11.87%/−10.62%; FastV is +3.11%/+1.35%; Random is +5.96%/+3.92%. Dense avoidance and unsafe-acceptance values remain exactly as reported. These charts use the 630-query replication population.
- The original and grid-overlay visual examples are unchanged copies of `original.png` and `retained.png` from the local GreenMM slide figure directory. They introduce the visual-token idea and are not labeled as a particular pruner's evaluated output.

The social-science conclusion is an interpretation of the studies' design choices, rather than an additional empirical result. It does not add a causal or deployment claim to the papers.

## Revision 4: visual and interaction refinements

The page uses blue ink, cool backgrounds, and blue chart encodings. Amber marks a report above its physical bound or an increase in measured energy. All original paper figures remain unchanged.

The financing curve and solar-bound plot now accept direct pointer input, with the existing sliders providing keyboard controls. These use the same teaching equations as before. Solar presets select (12:00, 6.4 kW), (12:00, 11.2 kW), and (21:00, 3.0 kW). The battery comparison shows the exact returns of the three available actions under the selected discount factor; it does not add a trained policy. The cost bars display the existing proposed share and min(proposed share, capacity) executed share. ViRel highlighting links already reported values across charts and the reliability summary.


## Revision 5: Shanghai geographic simulation and financing studio

The SolarSave interaction reference was inspected from the current public [MapSection.jsx](https://github.com/Global-Nomad-Nexus/SolarSave/blob/main/client/src/components/MapSection.jsx) and the local device-registration/detail components. The classroom implementation follows geographic registration, device readings, and report checking, with local synthetic data and delays.

### Shanghai geography

- Actual map data downloaded 2026-11-17 from the [OpenStreetMap map API extract](https://api.openstreetmap.org/api/0.6/map?bbox=121.481,31.226,121.516,31.248): west/east 121.481–121.516°, south/north 31.226–31.248°.
- Extract: 41,115 nodes, 5,309 ways; rendered features include 2,366 road ways, 1,750 building ways, and water/park geometry. River polygons include the Huangpu River multipolygon. Roads and buildings retain their geographic coordinates under an aspect-preserving Web Mercator projection.
- `assets/shanghai-basemap.svg` is the local cartographic rendering. `shanghai-map.js` supplies projection and water geometry for placement checks. The source way extract, compressed original OSM XML, and license notice are included. No tiles or geography requests run in the page.
- © OpenStreetMap contributors. Data is under [ODbL 1.0](https://opendatacommons.org/licenses/odbl/1-0/); [attribution](https://www.openstreetmap.org/copyright) is visible on the map. The classroom assets and energy links are illustrative and do not identify actual facilities.

### Local energy model

- All powers are in kW. Irradiance = 1000 × daylight × (1 − 0.65 × cloud_fraction), with a sinusoidal daylight factor between 06:00 and 18:00. The teaching bound is rated capacity × irradiance / 1000.
- Generated AC power is bound × (0.88 + a small deterministic sinusoidal variation). DC power is AC/0.96; module temperature is 18 + 0.025 × irradiance. These are illustrative equations, not the full paper’s PV model.
- The report equals generated power times a selected multiplier. Reports more than 0.01 kW above the bound are flagged and excluded from verified supply. Physical generation does not change when a report is inflated.
- Factory demand has a daytime profile. Verified solar supply is shared across factories in proportion to their demand. Grid import supplies the unmet demand; surplus verified supply is available for export.
- The clock advances 15 simulated minutes every 2 seconds at 1×, while the module is visible. Construction takes 1.1 seconds and report checking uses a 0.65-second delay. Pause, speed, cloud cover, time selection, removal, and reset operate locally. No weather API, wallet, contract, or settlement service is called.

### Financing assumptions

- Fixed 1 MW project, default $1 million investment, 20-year life, 20% capacity factor (1,752 MWh/year), and $20,000 annual operating expense. Investment and life can be adjusted.
- Four cases compare rates 4%, 8%, 12%, and a custom 2–16%. Annual capital recovery is the standard annuity factor times investment; illustrative levelized cost is (annual capital recovery + annual operating expense) / 1,752 MWh.
- The stacked bars decompose the teaching cost into straight-line capital recovery, the excess annuity amount labelled financing premium, and operation. The premium is not presented as an empirical estimate or a nominal interest-payment schedule.
- The sensitivity matrix covers rates 2–16% and lives 10, 15, 20, 25, and 30 years. It changes the same inputs as the sliders. All values are classroom calculations, separate from the manuscript’s WACC estimates.


## Revision 6: SolarChain-Eval recorded results

The interactive results are derived from the local camera-ready manuscript and its original experiment records:

- Manuscript: `Solar_RL/SolarChain_Eval_KDD_AgenticAI_Camera_Ready_arXiv_latest/evaluation.tex`; the action space, reward definition, and allocation bound also use `architecture.tex` in that project.
- Training runs: `Solar_RL/paper_final_seed_20260511`, `paper_final_seed_20260512`, and `paper_final_seed_20260513`.
- Each run contributes `runs/main/metrics.csv`, `runs/no_physics_penalty/metrics.csv`, `runs/agentic_llm_llm/metrics.csv`, and `runs/agentic_llm_llm_no_physics_penalty/metrics.csv`.
- `scripts/build_eval_evidence.py` exports 1,620 episode records: 540 main, 540 without the physics penalty, 270 with LLM governance, and 270 with governance and no physics penalty. Every policy/condition combination shown contains 30 evaluated episodes per training seed, 90 in total. The baseline policies are available in the first two settings.
- `evidence/solarchain-eval-provenance.json` records the SHA-256 hashes of the 12 source metric files. `evidence/solarchain-eval-rollouts.csv` and `assets/eval-evidence.js` retain numerical values to nine decimal places. The exporter verifies all five main-table means and the two artificial-liquidity ablation comparisons against the manuscript's displayed precision.

### Statistical encodings and units

The main landscape uses the same 540 real records throughout. Large marks are policy means; small marks are recorded rollouts. Optional horizontal and vertical whiskers show one sample standard deviation (denominator n−1) across the episodes. The selected policy's profile reports mean and sample standard deviation from those records. The original manuscript table remains available below the figures.

Box plots use linearly interpolated quartiles, the median, and whiskers to the last observed values within 1.5 times the interquartile range. All observed episodes remain available as dots. Their horizontal displacement in the box view separates overlapping observations; it carries no additional measured variable.

Paired differences match training run, policy, and evaluation episode. The environment seeds also match within these pairs. Physics comparisons subtract the with-penalty setting from the without-penalty setting. Governance comparisons subtract RL from RL + LLM within the selected physics regime. The diverging bars show mean paired changes and one sample standard deviation of those changes. The histogram counts the 90 actual paired changes in 16 bins, and its dashed line marks their mean. The four-condition matrix uses the same outcome scale within the selected policy.

Violation rates and slippage are fractions in the source records and are displayed as percentages. Their differences are expressed in percentage points. Artificial liquidity and episode trading volume are in MWh; the latter was also checked against the sum of the 24 hourly `matched_energy_MWh` entries for a source episode. Reward and action jitter retain their source scales. The paired experiment selector offers outcomes whose definitions remain shared across conditions.

### The 24-hour audit record

The replay uses PPO, episode 6, from `paper_final_seed_20260512/runs/agentic_llm_llm_no_physics_penalty`. The exporter joins `agentic_logs.jsonl` to `actions.csv` by policy, episode, and step. The downloadable `evidence/solarchain-eval-trace.json` contains its 24 steps, proposed/executed actions, Planner bounds, audit-call indicators, recorded rationale, and risk context.

Hour 15 matches the manuscript's highlighted case: reward 0.049 → 0.050, liquidity 0.931 → 0.200, and burn 0.200 → 0.000 at displayed precision. Recorded L1 action change is 0.932; raw input violation is 14% against a 12% Planner trigger. The allocation plane displays reward and liquidity shares under their 0.98 sum limit, plus the hour's actual Planner bounds. Burn has its own independent track. Playback follows the original step order and performs no model or LLM calls.

The original research figures retain their original pixels. The new SVG views are authored from the records described above.


## Revision 7: publication links and the pruning introduction

17 November 2026. Academic-research-suite was used inline for publication-source checks and prose revision.

| Study | Direct paper entry on the page | Verification source |
| --- | --- | --- |
| Capital Cost | [OpenReview](https://openreview.net/forum?id=ary7hTgqkx) | Official OpenReview attachment identifies the title, authors, and note ID. |
| SolarChain | [Duke Scholars](https://scholars.duke.edu/publication/1828101) | University-maintained record with the matching title and five authors; EIoT program confirms the conference presentation. |
| SolarChain-Eval | [OpenReview](https://openreview.net/forum?id=XcWTS5iVvY) | Author-maintained SolarChain-Eval README, Official publication links; the workshop lists the same title as accepted paper 25. |
| ViRel-Budget | [ACM proceedings](https://dl.acm.org/doi/10.1145/3840750.3841450) | Presenter-supplied ACM URL and publisher-deposited Crossref title/DOI metadata. |

The four links appear directly below the corresponding article titles and in the paper-detail dialogs. Their primary destinations are OpenReview, ACM, or Duke Scholars. OpenReview's forum pages presented a browser-verification screen during retrieval; record identity was checked using the official attachment or author-maintained publication links. The Capital Cost public attachment and the later local rewrite are versions of the same titled study; the page's figures and analytical descriptions continue to follow the supplied local rewrite.

### Two-minute pruning video

- [Mısra Turp, Pruning a neural Network for faster training times](https://www.youtube.com/watch?v=tUWnOz0c4pU), from the creator's 50 Days of Deep Learning series.
- The watch and embedded players displayed 2:00; the search listing rounded to 2:01. The page uses “2 min” and plays the complete video.
- Direct browser review showed dense/pruned network diagrams with spoken English. The English transcript covers removing connections, zeroing weights, and regularization. English captions were available, and the new embedded player played in the local HTTP preview.
- The introduction connects weight pruning in the video to selection of visual inputs in ViRel-Budget. The text keeps those two units of selection clear.
- The credited YouTube player loads after a click and has no start/end clipping parameters. Opening either lesson restores the other lesson's cover. The video is embedded from its source; no video or audio file is bundled.

### Shanghai and editorial changes

The map now contains only solar arrays and factories, matching the two asset types requested for this paper demonstration. The Consumer tool, initial nodes, icon, counter, build path, demand profile, and related display text were removed. Reset restores three arrays and two factories. The factory demand and verified-supply accounts continue to use the same local teaching equations.

The page and speaking draft use direct descriptions of the methods and results. Repeated qualifications were shortened, while source populations, units, experimental conditions, and the definitions needed to read the figures remain visible. The thirty-minute plan now includes a two-minute pruning lesson at 22–24 minutes, followed by ViRel-Budget at 24–27 minutes, ongoing work at 27–28, and discussion at 28–30.


## Revision 8: compact links

The presenter's supplied [LinkedIn profile](https://www.linkedin.com/in/shilin-ou-069284352/) replaces the opening guest-talk label. The closing directory links directly to the four paper records. Figure and data provenance remain in this file; the speaking draft remains in `notes/speaker-notes.md`.


## SolarChain link correction · 17 November 2026

The ACM DOI `10.1145/3798063.3839423` listed by the SolarSave repository returns HTTP 404 from both doi.org and the Crossref works endpoint. It has been removed from the page's active links. SolarChain now points to [Scholars@Duke](https://scholars.duke.edu/publication/1828101), whose title and five authors match the paper. That institutional record classifies the item as a preprint. The [official EIoT program](https://eiot-workshop.github.io/#section-program) separately lists the conference presentation. The paper-details dialog includes both entries.

The audit replay's highlighted-step shortcut was removed. Readers can select hour 15 in the existing hourly timeline.


## 18 November 2026: model-based finance and benchmark transitions

The financing panel is a transparent discounted cash-flow sensitivity model. It solves a zero-NPV constant real tariff: investment at time zero plus discounted fixed annual O&M, divided by discounted generation. Generation declines 0.7% annually from its first-year level. All operating flows occur at year end.

- Theory: [NREL/NLR simple LCOE documentation](https://www.nlr.gov/analysis/tech-lcoe-documentation), including the zero-NPV definition and capital-recovery relation; [ATB 2024 equations](https://atb.nlr.gov/electricity/2024/equations_%26_variables). The display uses explicit yearly cash flows rather than the full ATB tax/financing model.
- Published inputs: [ATB 2024 Utility-Scale PV](https://atb.nlr.gov/electricity/2024/utility-scale_pv). The 2023 technology benchmark supplies $1.56/W AC overnight cost including grid connection and $22/kW AC-year fixed O&M. The resource-class table supplies first-year CF values 21.4%, 26.9%, and 34.0%; these are resource scenarios, not three observed projects. Baseline degradation is 0.7%/year. Costs are normalized per MW AC from a utility-scale benchmark; they are not an estimate for a standalone 1 MW installation.
- Editable assumptions: real discount rate (8% initially), recovery life (30 years initially), overnight investment, and resource class. Taxes, incentives, salvage and construction-period financing are excluded; constant real annual O&M is retained as investment changes. This is not the paper’s fitted WACC model or a causal estimate.
- Default numerical audit: discounted costs $1,807,671.2335 / discounted energy 24,905.2892 MWh = $72.5818/MWh. With no degradation, the DCF matches the annuity/CRF expression ($68.1413/MWh at 8% over 30 years). At zero rate and no degradation it equals undiscounted lifecycle costs divided by lifecycle energy ($31.4033/MWh).

The market-step panel implements only the liquidity, demand and unsafe-backing transitions from [the released SolarChain-Eval environment](https://github.com/Global-Nomad-Nexus/SolarChain-Eval/blob/main/src/solarchain_eval/env.py). Its two hourly states are chosen teaching inputs, clearly labeled; no new experiment or trained policy is claimed. At alpha=.20, liquidity=.40, burn=0, opening=.10, verified=1, unsafe=.15, and demand=.70, unsafe backing is .0918367, liquidity addition .4367347, matching .5367347, artificial liquidity .0367347, and carryover zero. At liquidity=.78, carryover is .297 at the first hour and .059 at the second (verified=.35, unsafe=.05, demand=.55). Token price, full reward and city fairness are not modeled here.

The 3D cloud shows the original recorded episodes by default. The redesigned audit review reads the unchanged 24-hour released log and presents its proposal, bounds and final execution; a post-Planner intermediate action is not available and is not fabricated.
