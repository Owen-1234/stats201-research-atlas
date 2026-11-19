'use strict';

const papers = {
  solar: {
    place: 'SHANGHAI, CHINA', label: '02', short: 'SolarChain',
    subtitle: 'Verifying solar reports before settlement.',
    title: 'SolarChain: A Physics-Grounded Embodied IoT System for Verifiable Urban Solar Market Design',
    description: 'Our system connects weather-based verification, planner review, reward allocation, and settlement records.',
    venue: 'UbiComp Companion 2026 · EIoT Workshop · Shanghai',
    authors: 'Shilin Ou · Yifan Xu · Zhenshan Zhang · Luyao Zhang · Ming-Chun Huang',
    tag: 'PHYSICAL EVIDENCE / MARKET DESIGN', image: 'solarchain-architecture.png',
    why: 'A ledger records what was submitted. A solar market also needs to ask whether the reported generation was physically plausible.',
    how: 'Weather-driven PV bounds, rule-based adaptive verification, planner review, configurable reward allocation, and hash-linked settlement traces.',
    lesson: 'The monthly results favor IQR/MAD on aggregate F1. The adaptive verifier supplies contextual evidence, while the attack-category tests identify remaining failures.',
    figures: [['solarchain-architecture.png', 'Original system architecture: physics engine, planner interface, and contracts.'], ['solarchain-cities.png', 'Original five-city companion trace: weather-driven simulation with synthetic PV nodes.'], ['solarchain-physics.png', 'Reported output against the theoretical physical maximum.']],
    links: [['Duke Scholars', 'https://scholars.duke.edu/publication/1828101'], ['Conference program', 'https://eiot-workshop.github.io/#section-program'], ['Code & artifacts', 'https://github.com/Global-Nomad-Nexus/SolarSave']],
    note: 'The benchmark uses historical city-level weather, physics-modeled bounds, and synthetic nodes, demand, trades, and scripted attacks. F1 results describe the fixed monthly benchmark. The settlement trace preserves the accepted reports and the decisions made from them.'
  },
  eval: {
    place: 'JEJU ISLAND, SOUTH KOREA', label: '03', short: 'SolarChain-Eval',
    subtitle: 'Evaluating learned policies in a solar market.',
    title: 'SolarChain-Eval: A Physics-Constrained Benchmark for Trustworthy Economic Agents in Decentralized Energy Markets',
    description: 'We compare hourly market policies, remove the physics penalty, and examine an LLM Planner/Auditor during evaluation.',
    venue: 'KDD Workshop on Evaluation and Trustworthiness of Agentic AI 2026 · Jeju',
    authors: 'Shilin Ou · Yifan Xu · Luyao Zhang',
    tag: 'REINFORCEMENT LEARNING / EVALUATION', image: 'eval-workflow.png',
    why: 'Market utility is only one part of the outcome. An agent may improve its score while backing generation that has no physical support.',
    how: 'A Gymnasium-compatible market environment compares static, random, myopic, PPO, SAC, and DQN policies, with physics-penalty ablations and an evaluation-time LLM Planner/Auditor.',
    lesson: 'Removing the physics penalty increases artificial liquidity across the learned policies. The LLM layer records interventions and has mixed effects on the measured outcomes.',
    figures: [['eval-workflow.png', 'Original benchmark logic: inputs, environment, policies, and trustworthiness evaluation.'], ['eval-frontier.png', 'Utility–safety frontier, with individual rollout observations.'], ['eval-ablation.png', 'Artificial liquidity under RL and RL+LLM, with and without physics penalties.'], ['eval-stability.png', 'Action stability effects differ across the base policies.']],
    links: [['OpenReview', 'https://openreview.net/forum?id=XcWTS5iVvY'], ['Code & poster', 'https://github.com/Global-Nomad-Nexus/SolarChain-Eval'], ['Workshop', 'https://kdd-eval-workshop.github.io/agenticai-evaluation-kdd2026/']],
    note: 'The interactive result explorer uses the local KDD camera-ready results: 90 matched rollouts per policy over 3 seeds. LLM governance runs during evaluation. The constrained and unconstrained rewards use different penalty terms.'
  },
  capital: {
    place: 'SINGAPORE', label: '01', short: 'Capital Cost',
    subtitle: 'The financial side of the energy transition.',
    title: 'Fossil Fuel Prices and Capital Cost: A Machine Learning Driven Study on Energy Transition',
    description: 'How do fossil-fuel price scenarios relate to the cost of financing energy projects?',
    venue: 'Singapore · research stop', authors: 'Shilin Ou · Luyao Zhang · Ming-Chun Huang',
    tag: 'PREDICTIVE MODELING / ENERGY FINANCE', image: 'capital-workflow.png',
    why: 'Energy projects need financing as well as technology. Capital costs connect fuel-price uncertainty to the conditions under which projects can be funded.',
    how: 'A staged modeling pipeline links price scenarios, tensor regression, and WACC estimation across regions and project technologies.',
    lesson: 'The paper interprets the estimates as predictive sensitivity on a constructed scenario panel. Holdout and rolling-origin checks examine how the models perform beyond their training observations.',
    figures: [['capital-workflow.png', 'Original method diagram from the local paper source.'], ['capital-forecast.png', 'Original oil-price forecast comparison from the local manuscript.'], ['capital-results.png', 'Original project-level model-fit comparison.']],
    links: [['OpenReview', 'https://openreview.net/forum?id=ary7hTgqkx']],
    note: 'The scenario panel covers 2026–2035. The local manuscript uses holdout and rolling-origin checks to examine predictive sensitivity across regions and project technologies.'
  },
  virel: {
    place: 'RIO DE JANEIRO, BRAZIL', label: '04', short: 'ViRel-Budget',
    subtitle: 'Visual-token budgets and measured GPU energy.',
    title: 'ViRel-Budget: Reliability-Constrained Visual-Token Budgeting for Green Vision-Language Inference',
    description: 'How much visual computation can a model skip while preserving the behavior we care about?',
    venue: 'ACM Multimedia 2026 · GreenMM Workshop · Oral presentation · Rio de Janeiro',
    authors: 'Sean Wan · Shilin Ou · Luyao Zhang',
    tag: 'VISION–LANGUAGE MODELS / GREEN AI', image: 'virel-workflow.png',
    why: 'Visual-token pruning changes the computation used to answer a question. We study its effects on answer behavior and GPU energy.',
    how: 'A frozen metadata controller selects one inference action per query. Evaluation separates task performance, intervention-defined reliability, and measured GPU energy.',
    lesson: 'The released replication reports SCOPE energy reductions of 11.87% on 7B and 10.62% on 13B under the tested setup. Token reduction and measured energy are evaluated separately.',
    figures: [['virel-workflow.png', 'Original framework figure from the GreenMM talk.'], ['virel-energy.png', 'Original energy results from the GreenMM talk; GPU energy and model-scale comparisons are distinguished.']],
    links: [['Code & result summaries', 'https://github.com/SeanWan514/ViRel-Budget'], ['ACM proceedings', 'https://dl.acm.org/doi/10.1145/3840750.3841450']],
    note: 'Energy percentages come from the released 630-query replication. Reliability is measured through behavior under defined visual interventions, alongside workload, backend, pruner, and hardware measurements.'
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
function openPaper(id) {
  const p = papers[id];
  if (!p) return;
  $('#paper-dialog-content').innerHTML = `<div class="eyebrow">${p.place} / RESEARCH NOTE ${p.label}</div><h2>${p.short}</h2><p class="paper-fulltitle">${p.title}</p><div class="paper-meta">${p.venue}<br>${p.authors}</div><div class="paper-summary-grid"><div><h4>THE QUESTION</h4><p>${p.why}</p></div><div><h4>THE APPROACH</h4><p>${p.how}</p></div><div><h4>FINDINGS</h4><p>${p.lesson}</p></div></div>${p.figures.map(([file,caption])=>`<figure><button class="image-button" data-image="assets/${file}" data-caption="${caption}"><img src="assets/${file}" alt="${caption}" loading="lazy"></button><figcaption>${caption}</figcaption></figure>`).join('')}<div class="paper-links">${p.links.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join('')}</div><details class="discussion-prompt"><summary>Source & study notes <span>+</span></summary><p>${p.note}</p></details>`;
  $('#paper-dialog').showModal();
  $('#paper-dialog').scrollTop = 0;
}

let figureGroup = [];
let figureIndex = 0;
function showFigure(index) {
  if (index < 0 || index >= figureGroup.length) return;
  figureIndex = index;
  const button = figureGroup[index];
  $('#expanded-image').src = button.dataset.image;
  $('#expanded-image').alt = button.querySelector('img')?.alt || button.dataset.caption;
  $('#expanded-caption').textContent = button.dataset.caption;
  $('#original-link').href = button.dataset.image;
  $('#figure-position').textContent = `${index + 1} of ${figureGroup.length}`;
  $('#figure-prev').disabled = index === 0;
  $('#figure-next').disabled = index === figureGroup.length - 1;
  $('#figure-pager').hidden = figureGroup.length < 2;
}
function openImage(button) {
  const chapter = button.closest('[data-study], #future, #paper-dialog');
  const figures = chapter ? [...chapter.querySelectorAll('.image-button[data-image]')] : [];
  figureGroup = figures.some(figure => figure.dataset.image === button.dataset.image) ? figures : [button];
  showFigure(figureGroup.findIndex(figure => figure.dataset.image === button.dataset.image));
  $('#image-dialog').showModal();
}

$('#figure-prev').addEventListener('click', () => showFigure(figureIndex - 1));
$('#figure-next').addEventListener('click', () => showFigure(figureIndex + 1));
$('#image-dialog').addEventListener('keydown', event => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showFigure(figureIndex + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});

document.addEventListener('click', event => {
  const paper = event.target.closest('[data-open-paper]');
  const figure = event.target.closest('[data-image]');
  if (paper) openPaper(paper.dataset.openPaper);
  if (figure) openImage(figure);
  const close = event.target.closest('.dialog-close');
  if (close) close.closest('dialog').close();
});
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  }
}));

function paintRanges(){
  $$('input[type=range]').forEach(input=>input.style.setProperty('--range-progress',`${(Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min))*100}%`));
}
document.addEventListener('input',event=>{if(event.target.matches('input[type=range]'))paintRanges();});

const virelData = {
  '7B': [
    {name: 'SCOPE', energy: -11.87, interval: [-16.30, -7.19], avoid: 33.97, unsafe: 0.63},
    {name: 'FastV', energy: 3.11, interval: [-0.75, 6.84], avoid: 61.27, unsafe: 0.79},
    {name: 'Random', energy: 5.96, interval: [0.95, 11.40], avoid: 55.56, unsafe: 2.54},
  ],
  '13B': [
    {name: 'SCOPE', energy: -10.62, interval: [-13.46, -7.48], avoid: 50.00, unsafe: 1.27},
    {name: 'FastV', energy: 1.35, interval: [-1.39, 4.13], avoid: 77.78, unsafe: 2.54},
    {name: 'Random', energy: 3.92, interval: [0.55, 7.40], avoid: 52.22, unsafe: 1.43},
  ],
};
let selectedBackend = '7B';
let selectedMethod = 'SCOPE';
const signedPercent = value => `${value < 0 ? '−' : '+'}${Math.abs(value).toFixed(2)}%`;
// The source reports intervals for energy reduction. Above, both endpoints
// have been negated and reordered to express change relative to dense.
function renderVirel() {
  const axisPosition = value => (value + 20) / 35 * 100;
  const rows = virelData[selectedBackend];
  $('#resource-rows').innerHTML = rows.map(row => {
    const [low, high] = row.interval;
    return `<button type="button" class="resource-row" data-method="${row.name}" aria-pressed="false" aria-label="${row.name}, GPU energy change ${signedPercent(row.energy)}, 95% confidence interval ${signedPercent(low)} to ${signedPercent(high)}, dense avoidance ${row.avoid.toFixed(2)}%, unsafe acceptance ${row.unsafe.toFixed(2)}%">
      <strong>${row.name}</strong>
      <span class="interval-cell"><span class="mobile-column">GPU energy change</span>
        <span class="energy-estimate">${signedPercent(row.energy)}</span>
        <span class="energy-plot" aria-hidden="true" style="--low:${axisPosition(low)}%;--high:${axisPosition(high)}%;--point:${axisPosition(row.energy)}%">
          <i class="energy-zero"></i><i class="energy-whisker"></i><i class="energy-dot"></i>
        </span>
        <span class="energy-scale" aria-hidden="true"><i>−20%</i><i>0</i><i>+15%</i></span>
        <span class="sr-only">95% confidence interval ${signedPercent(low)} to ${signedPercent(high)}.</span>
      </span>
      <span class="avoid-cell"><span class="mobile-column">Dense avoidance</span><b>${row.avoid.toFixed(2)}%</b><i aria-hidden="true" style="--avoid:${row.avoid}%"></i></span>
      <span class="unsafe-cell"><span class="mobile-column">Unsafe acceptance</span>${row.unsafe.toFixed(2)}%</span>
    </button>`;
  }).join('');
  $$('[data-backend]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.backend === selectedBackend));
  });
  selectMethod(selectedMethod);
}
function selectMethod(name) {
  selectedMethod = name;
  const row = virelData[selectedBackend].find(method => method.name === name);
  $$('#resource-rows button').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.method === name));
  });
  const [low, high] = row.interval;
  $('#virel-summary').innerHTML = `<strong>${name} · ${selectedBackend}</strong> Skipped dense inference on ${row.avoid.toFixed(2)}% of queries. Measured GPU energy was <b>${Math.abs(row.energy).toFixed(2)}% ${row.energy < 0 ? 'lower' : 'higher'}</b> than dense inference (95% CI for change ${signedPercent(low)} to ${signedPercent(high)}).`;
}
$$('[data-backend]').forEach(button => button.addEventListener('click', () => {
  selectedBackend = button.dataset.backend;
  renderVirel();
}));
$('#resource-rows').addEventListener('click', event => {
  const button = event.target.closest('[data-method]');
  if (button) selectMethod(button.dataset.method);
});

const allocations = {
  0: {fulfill:96.1,reward:0,slip:32.356},
  10: {fulfill:96.4,reward:4174,slip:32.165},
  20: {fulfill:95.6,reward:8976,slip:32.569},
  25: {fulfill:93.9,reward:11220,slip:33.032},
  50: {fulfill:78.2,reward:22441,slip:33.297}
};
const allocationPlot = $('#allocation-rows');
allocationPlot.innerHTML = Object.entries(allocations).map(([ratio, result]) => {
  const position = (result.fulfill - 70) / 30 * 100;
  return `<button type="button" class="allocation-row" data-ratio="${ratio}" aria-label="${ratio}% reward, ${100-ratio}% liquidity, ${result.fulfill.toFixed(1)}% of demand fulfilled">
    <span>${ratio} / ${100-ratio}</span><i class="fulfillment-track" aria-hidden="true" style="--point:${position}%"><i></i></i><strong>${result.fulfill.toFixed(1)}%</strong></button>`;
}).join('');
function renderAllocation(ratio) {
  const result = allocations[ratio];
  $$('#allocation-rows button').forEach(button => {
    button.setAttribute('aria-pressed', String(Number(button.dataset.ratio) === ratio));
  });
  $('#allocation-selected').textContent = `${ratio} / ${100-ratio}`;
  $('#producer-bar').style.width = `${ratio}%`;
  $('#liquidity-bar').style.width = `${100-ratio}%`;
  $('.allocation-bar').setAttribute('aria-label', `${ratio}% producer reward and ${100-ratio}% shared liquidity`);
  $('#allocation-results').innerHTML = `<p><span>Producer reward</span><strong>${result.reward.toLocaleString('en-US')} <small>kWh</small></strong></p><p><span>Demand fulfilled</span><strong>${result.fulfill.toFixed(1)}%</strong></p><p><span>Slippage proxy</span><strong>${result.slip.toFixed(3)}%</strong></p>`;
}
allocationPlot.addEventListener('click', event => {
  const button = event.target.closest('[data-ratio]');
  if (button) renderAllocation(Number(button.dataset.ratio));
});

// Classroom videos load on request; opening one restores the other's cover.
const classroomVideos=[
  {key:'rl',id:'2xATEwcRpy8',title:'Udacity: Reinforcement Learning Basics, complete video (about two and a half minutes)'},
  {key:'pruning',id:'tUWnOz0c4pU',title:'Mısra Turp: Pruning a neural Network for faster training times, complete two-minute video'}
];
function resetClassroomVideo(video){
  $(`#${video.key}-video-frame iframe`)?.remove();
  $(`#load-${video.key}-video`).hidden=false;
  $(`#reset-${video.key}-video`).hidden=true;
}
classroomVideos.forEach(video=>{
  $(`#load-${video.key}-video`).addEventListener('click',()=>{
    classroomVideos.forEach(resetClassroomVideo);
    const frame=document.createElement('iframe');
    frame.src=`https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&cc_load_policy=1&cc_lang_pref=en&hl=en&playsinline=1`;
    frame.title=video.title;
    frame.allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    frame.referrerPolicy='strict-origin-when-cross-origin';
    frame.setAttribute('allowfullscreen','');
    $(`#load-${video.key}-video`).hidden=true;
    $(`#${video.key}-video-frame`).append(frame);
    $(`#reset-${video.key}-video`).hidden=false;
  });
  $(`#reset-${video.key}-video`).addEventListener('click',()=>resetClassroomVideo(video));
});

renderVirel();
renderAllocation(20);
