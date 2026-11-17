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
    links: [['Code & result summaries', 'https://github.com/Global-Nomad-Nexus/ViRel-Budget'], ['ACM proceedings', 'https://dl.acm.org/doi/10.1145/3840750.3841450']],
    note: 'Energy percentages come from the released 630-query replication. Reliability is measured through behavior under defined visual interventions, alongside workload, backend, pruner, and hardware measurements.'
  }
};

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => [...document.querySelectorAll(selector)];
let selectedPaper = 'capital';
function selectPaper(id) {
  if (!papers[id]) return;
  selectedPaper=id;
  $$('[data-paper]').forEach(el=>{
    const active=el.dataset.paper===id;
    el.classList.toggle('active',active);
    if(active)el.setAttribute('aria-current','location');
    else el.removeAttribute('aria-current');
  });
}

function openPaper(id) {
  const p = papers[id];
  if (!p) return;
  $('#paper-dialog-content').innerHTML = `<div class="eyebrow">${p.place} / RESEARCH NOTE ${p.label}</div><h2>${p.short}</h2><p class="paper-fulltitle">${p.title}</p><div class="paper-meta">${p.venue}<br>${p.authors}</div><div class="paper-summary-grid"><div><h4>THE QUESTION</h4><p>${p.why}</p></div><div><h4>THE APPROACH</h4><p>${p.how}</p></div><div><h4>FINDINGS</h4><p>${p.lesson}</p></div></div>${p.figures.map(([file,caption])=>`<figure><button class="image-button" data-image="assets/${file}" data-caption="${caption}"><img src="assets/${file}" alt="${caption}" loading="lazy"></button><figcaption>${caption}</figcaption></figure>`).join('')}<div class="paper-links">${p.links.map(([label,url])=>`<a href="${url}" target="_blank" rel="noopener">${label} ↗</a>`).join('')}</div><details class="discussion-prompt"><summary>Source & study notes <span>+</span></summary><p>${p.note}</p></details>`;
  $('#paper-dialog').showModal();
  $('#paper-dialog').scrollTop = 0;
}

function openImage(src, caption) {
  $('#expanded-image').src = src;
  $('#expanded-image').alt = caption;
  $('#expanded-caption').textContent = caption;
  $('#original-link').href = src;
  $('#image-dialog').showModal();
}

document.addEventListener('click', event => {
  const stop = event.target.closest('[data-paper]');
  const paper = event.target.closest('[data-open-paper]');
  const figure = event.target.closest('[data-image]');
  if (stop) selectPaper(stop.dataset.paper);
  if (paper) openPaper(paper.dataset.openPaper);
  if (figure) openImage(figure.dataset.image, figure.dataset.caption);
  const close = event.target.closest('.dialog-close');
  if (close) close.closest('dialog').close();
});
$$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
  if (event.target === dialog) {
    const r = dialog.getBoundingClientRect();
    if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) dialog.close();
  }
}));
$('#map-zoom').addEventListener('click', () => {$('#world-map').setAttribute('viewBox','665 65 300 290'); $('#map-zoom').setAttribute('aria-pressed','true');});
$('#map-reset').addEventListener('click', () => {$('#world-map').setAttribute('viewBox','0 0 1000 440'); $('#map-zoom').setAttribute('aria-pressed','false');});

function paintRanges(){
  $$('input[type=range]').forEach(input=>input.style.setProperty('--range-progress',`${(Number(input.value)-Number(input.min))/(Number(input.max)-Number(input.min))*100}%`));
}
document.addEventListener('input',event=>{if(event.target.matches('input[type=range]'))paintRanges();});

const virelData={
  '7B':[{name:'SCOPE',energy:-11.87,avoid:33.97,unsafe:.63},{name:'FastV',energy:3.11,avoid:61.27,unsafe:.79},{name:'Random',energy:5.96,avoid:55.56,unsafe:2.54}],
  '13B':[{name:'SCOPE',energy:-10.62,avoid:50,unsafe:1.27},{name:'FastV',energy:1.35,avoid:77.78,unsafe:2.54},{name:'Random',energy:3.92,avoid:52.22,unsafe:1.43}]
};
let selectedBackend='7B';
function renderVirel(){
  const values=virelData[selectedBackend],energyX=v=>250+v/15*160,avoidX=v=>90+v/100*310;
  const energyGrid=[-15,-10,-5,0,5,10].map(v=>`<line x1="${energyX(v)}" x2="${energyX(v)}" y1="35" y2="187" stroke="${v===0?'#7795b6':'#dce0da'}" stroke-width="${v===0?'1.3':'.7'}"/><text x="${energyX(v)}" y="212" text-anchor="middle" class="chart-tick">${v}%</text>`).join('');
  const energyBars=values.map((d,i)=>{const y=60+i*51,pos=energyX(d.energy);return `<g class="method-result" data-method="${d.name}" tabindex="0" role="img" aria-label="${d.name}: ${d.energy>0?'plus ':''}${d.energy.toFixed(2)} percent energy change"><title>${d.name}: ${d.energy.toFixed(2)}% GPU energy change, ${d.unsafe.toFixed(2)}% unsafe acceptance</title><rect class="method-row" x="0" y="${y-21}" width="462" height="42" rx="5" fill="transparent"/><text x="3" y="${y+5}" font-size="12" fill="#25496c">${d.name}</text><rect x="${Math.min(250,pos)}" y="${y-10}" width="${Math.abs(pos-250)}" height="22" rx="3" fill="${d.energy<0?'#486c87':'#b48850'}"/><text x="${d.energy<0?pos-7:pos+7}" y="${y+5}" text-anchor="${d.energy<0?'end':'start'}" font-size="11" fill="#3d5a78">${d.energy>0?'+':''}${d.energy.toFixed(2)}%</text></g>`;}).join('');
  $('#virel-energy-chart').innerHTML=`<title>${selectedBackend} measured GPU energy change compared with dense inference</title>${energyGrid}${energyBars}`;
  const avoidGrid=[0,25,50,75,100].map(v=>`<line x1="${avoidX(v)}" x2="${avoidX(v)}" y1="35" y2="187" stroke="#dce0da" stroke-width=".7"/><text x="${avoidX(v)}" y="212" text-anchor="middle" class="chart-tick">${v}%</text>`).join('');
  const avoidBars=values.map((d,i)=>{const y=60+i*51;return `<g class="method-result" data-method="${d.name}" tabindex="0" role="img" aria-label="${d.name}: ${d.avoid.toFixed(2)} percent of queries avoiding dense inference"><title>${d.name}: ${d.avoid.toFixed(2)}% dense avoidance, ${d.unsafe.toFixed(2)}% unsafe acceptance</title><rect class="method-row" x="0" y="${y-21}" width="462" height="42" rx="5" fill="transparent"/><text x="3" y="${y+5}" font-size="12" fill="#25496c">${d.name}</text><rect x="90" y="${y-10}" width="310" height="22" rx="3" fill="#e5e9e3"/><rect x="90" y="${y-10}" width="${avoidX(d.avoid)-90}" height="22" rx="3" fill="${i===0?'#486c87':'#a6b9be'}"/><text x="${avoidX(d.avoid)+7}" y="${y+5}" font-size="11" fill="#3d5a78">${d.avoid.toFixed(2)}%</text></g>`;}).join('');
  $('#virel-avoidance-chart').innerHTML=`<title>${selectedBackend} queries avoiding dense inference</title>${avoidGrid}${avoidBars}`;
  $('#virel-summary').innerHTML=values.map(d=>`<div data-method="${d.name}"><strong>${d.name}</strong><span>${d.unsafe.toFixed(2)}% unsafe acceptance</span></div>`).join('');
  $$('[data-backend]').forEach(el=>{const active=el.dataset.backend===selectedBackend;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
}
$$('[data-backend]').forEach(el=>el.addEventListener('click',()=>{selectedBackend=el.dataset.backend;renderVirel();}));

const virelExplorer=$('.virel-explorer');
function highlightMethod(name){virelExplorer.querySelectorAll('[data-method]').forEach(el=>el.classList.toggle('method-highlight',el.dataset.method===name));}
virelExplorer.addEventListener('pointerover',event=>highlightMethod(event.target.closest('[data-method]')?.dataset.method));
virelExplorer.addEventListener('pointerleave',()=>highlightMethod());
virelExplorer.addEventListener('focusin',event=>highlightMethod(event.target.closest('[data-method]')?.dataset.method));
virelExplorer.addEventListener('focusout',()=>highlightMethod());


const allocations = {
  0: {fulfill:96.1,reward:0,slip:32.356},
  10: {fulfill:96.4,reward:4174,slip:32.165},
  20: {fulfill:95.6,reward:8976,slip:32.569},
  25: {fulfill:93.9,reward:11220,slip:33.032},
  50: {fulfill:78.2,reward:22441,slip:33.297}
};
function renderAllocation(ratio) {
  const d=allocations[ratio];
  $$('[data-ratio]').forEach(el=>{const on=Number(el.dataset.ratio)===ratio;el.classList.toggle('active',on);el.setAttribute('aria-pressed',String(on));});
  $('#producer-bar').style.width=`${ratio}%`; $('#producer-bar').textContent=ratio?`${ratio}%`:'';
  $('#liquidity-bar').style.width=`${100-ratio}%`; $('#liquidity-bar').textContent=`${100-ratio}%`;
  $('.allocation-bar').setAttribute('aria-label',`${ratio}% producer reward; ${100-ratio}% shared liquidity`);
  $('#allocation-results').innerHTML=`<div><span>DEMAND FULFILLED</span><strong>${d.fulfill.toFixed(1)}<small>%</small></strong></div><div><span>PRODUCER REWARD</span><strong>${d.reward.toLocaleString('en-US')}<small> kWh</small></strong></div><div><span>SLIPPAGE PROXY</span><strong>${d.slip.toFixed(2)}<small>%</small></strong></div>`;
}
$$('[data-ratio]').forEach(el=>el.addEventListener('click',()=>renderAllocation(Number(el.dataset.ratio))));

function renderCost() {
  paintRanges();
  const proposed=Number($('#placement').value), capacity=Number($('#capacity').value), user=Math.min(proposed,capacity), repaired=proposed-user;
  $('#placement-output').textContent=`${proposed}%`; $('#capacity-output').textContent=`${capacity}%`;
  $('#proposal-number').textContent=`${proposed} / ${100-proposed}`; $('#repair-number').textContent=`${user} / ${100-user}`;
  $('#user-cost').textContent=String(user); $('#institution-cost').textContent=String(100-user);
  document.dispatchEvent(new CustomEvent('atlas:routing',{detail:{proposed,capacity,user,repaired}}));
  $('#repair-explanation').textContent=repaired?`${repaired} requests move to the institution after the capacity check. The executed split determines the accounts.`:'The proposal fits the available capacity. Proposed and executed accounts agree.';
}
$('#placement').addEventListener('input',renderCost); $('#capacity').addEventListener('input',renderCost);

// Two-step classroom exercise. Fixed illustrative prices, not a policy trained
// on the SolarChain benchmark. All decisions are made by the reader.
let storedUnits = null;
let eveningComplete = false;
function renderBattery() {
  paintRanges();
  const gamma=Number($('#discount').value);
  document.dispatchEvent(new CustomEvent('atlas:battery',{detail:{storedUnits,eveningComplete,gamma}}));
  $('#discount-output').textContent=gamma.toFixed(2);
  $$('[data-store]').forEach(el=>{const active=storedUnits!==null&&Number(el.dataset.store)===storedUnits;el.classList.toggle('active',active);el.setAttribute('aria-pressed',String(active));});
  const charge=storedUnits===null||eveningComplete?0:storedUnits;
  $$('#battery-drawing>span').forEach((el,i)=>el.classList.toggle('charged',i<charge));
  $('#battery-drawing').setAttribute('aria-label',`Battery storing ${charge} energy units`);
  $('#battery-time').textContent=eveningComplete?'18:00 / EVENING':'12:00 / NOON';
  $('#battery-price').textContent=eveningComplete?'3 credits per unit':'1 credit per unit';
  $('#run-evening').disabled=storedUnits===null||eveningComplete;
  const stored=storedUnits??0;
  $('#episode-path').innerHTML=`<div class="${storedUnits!==null?'complete':''}"><span>12:00</span><strong>${storedUnits===null?'2 units available':`${2-stored} sold`}</strong><small>${storedUnits===null?'Choose an action':`${stored} stored`}</small></div><span class="episode-link">${storedUnits===null?'→':`${stored} units →`}</span><div class="${eveningComplete?'complete':''}"><span>18:00</span><strong>${eveningComplete?`${stored} sold`:'Evening market'}</strong><small>${eveningComplete?`${3*stored} credits received`:'3 credits per unit'}</small></div>`;
  if(storedUnits===null){
    $('#battery-feedback').textContent='Choose how much to store. The evening result depends on this decision.';
    $('#episode-ledger').innerHTML=''; $('#battery-comparison').innerHTML='';
    $('#return-display').innerHTML='<span>Discounted return</span><strong>G = r<sub>noon</sub> + γr<sub>evening</sub></strong>';
    return;
  }
  const immediate=2-storedUnits, later=3*storedUnits, total=immediate+gamma*later;
  $('#episode-ledger').innerHTML=`<table><thead><tr><th scope="col">Time</th><th scope="col">Action</th><th scope="col">Reward</th><th scope="col">Stored after</th></tr></thead><tbody><tr><th scope="row">Noon</th><td>Sell ${immediate}, store ${storedUnits}</td><td>${immediate}</td><td>${storedUnits}</td></tr>${eveningComplete?`<tr><th scope="row">Evening</th><td>Sell ${storedUnits}</td><td>${later}</td><td>0</td></tr>`:''}</tbody></table>`;
  if(!eveningComplete){
    $('#battery-comparison').innerHTML='';
    $('#battery-feedback').textContent=`You receive ${immediate} ${immediate===1?'credit':'credits'} now and keep ${storedUnits} ${storedUnits===1?'unit':'units'} for the evening.`;
    $('#return-display').innerHTML='<span>Next step</span><strong>Run the evening to calculate G.</strong>';
    return;
  }
  const allReturns=[0,1,2].map(store=>2-store+gamma*3*store);
  $('#battery-comparison').innerHTML=`<span class="comparison-caption">Return from each possible noon action</span>${allReturns.map((value,i)=>`<div class="${i===storedUnits?'chosen':''}"><span>Store ${i}</span><div><i style="width:${value/6*100}%"></i></div><strong>${value.toFixed(2)}</strong></div>`).join('')}`;
  const best=Math.max(...allReturns);
  const bestActions=allReturns.map((value,i)=>Math.abs(value-best)<1e-9?i:null).filter(value=>value!==null);
  const verdict=Math.abs(total-best)<1e-9?'This is a best action for these prices and this discount factor.':`Storing ${bestActions.join(' or ')} units gives a higher discounted return of ${best.toFixed(2)}.`;
  $('#battery-feedback').textContent=`The evening sale brings ${later} ${later===1?'credit':'credits'}. ${verdict}`;
  $('#return-display').innerHTML=`<span>Discounted return for this episode</span><strong>${immediate} + ${gamma.toFixed(2)} × ${later} = ${total.toFixed(2)}</strong><small>Undiscounted sales revenue: ${immediate+later} credits.</small>`;
}
$$('[data-store]').forEach(el=>el.addEventListener('click',()=>{storedUnits=Number(el.dataset.store);eveningComplete=false;renderBattery();}));
$('#run-evening').addEventListener('click',()=>{if(storedUnits!==null){eveningComplete=true;renderBattery();}});
$('#reset-battery').addEventListener('click',()=>{storedUnits=null;eveningComplete=false;renderBattery();});
$('#discount').addEventListener('input',renderBattery);

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

let scrollScheduled=false;
window.addEventListener('scroll',()=>{
  if(scrollScheduled)return;
  scrollScheduled=true;
  requestAnimationFrame(()=>{
    scrollScheduled=false;
    const cutoff=window.innerHeight*.35;
    const study=$$('[data-study]').find(el=>{
      const r=el.getBoundingClientRect();
      return r.top<=cutoff&&r.bottom>cutoff;
    });
    if(study&&study.dataset.study!==selectedPaper)selectPaper(study.dataset.study);
  });
},{passive:true});

selectPaper('capital'); renderVirel(); renderAllocation(20); renderCost(); renderBattery();
