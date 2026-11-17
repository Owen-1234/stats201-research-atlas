// Classroom illustrations. Recorded benchmark values are handled by eval-lab.js.
const q = (s) => document.querySelector(s);

// A small, explicitly illustrative state, using the liquidity/risk equations in env.py.
let marketHour = 0;
function marketTransition(state, liquidityRatio, burn, risk) {
  const unsafe = risk ? state.unsafe : 0;
  const unsafeBacked = unsafe * (.20 + liquidityRatio) / .98;
  const backed = state.verified + unsafeBacked;
  const added = backed * liquidityRatio;
  const demand = state.demand * Math.max(.75, 1 - .80 * burn);
  const available = state.opening + added, matched = Math.min(available, demand);
  return {...state,unsafe,unsafeBacked,backed,added,demand,available,matched,
    next:Math.max(available-matched,0),unmet:Math.max(demand-available,0),
    artificial:unsafeBacked*liquidityRatio,violation:unsafeBacked/Math.max(backed,1e-9)};
}
function renderMarketStep() {
  const liquidity=Number(q('#market-liquidity').value),burn=Number(q('#market-burn').value),risk=q('#market-risk').checked;
  const first=marketTransition({hour:12,opening:.1,verified:1,unsafe:.15,demand:.7},liquidity,burn,risk);
  const second=marketTransition({hour:13,opening:first.next,verified:.35,unsafe:.05,demand:.55},liquidity,burn,risk);
  const d=marketHour===0?first:second,f=v=>v.toFixed(3);
  q('#market-liquidity-output').textContent=liquidity.toFixed(2);
  q('#market-burn-output').textContent=burn.toFixed(2);
  document.querySelectorAll('[data-market-hour]').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.marketHour)===marketHour)));
  q('#market-inputs').innerHTML=[['Verified supply',d.verified],['Suspicious supply',d.unsafe],['Raw demand',marketHour===0?.7:.55]].map(([label,value])=>'<div><span>'+label+'</span><strong>'+f(value)+' <small>MWh</small></strong></div>').join('');
  const svg=q('#market-waterfall'),w=Math.max(280,svg.clientWidth||780),narrow=w<500,L=narrow?32:50,R=w-12,B=narrow?205:235,T=30,ceiling=1.2,y=v=>B-v/ceiling*(B-T),step=(R-L)/4,xs=Array.from({length:4},(_,i)=>L+step*(i+.5)),bw=Math.min(72,step*.48);
  svg.setAttribute('viewBox','0 0 '+w+' '+(narrow?265:300));
  const bars=[{label:'Brought forward',value:d.opening,lo:0,hi:d.opening,color:'#859e87'},{label:'Liquidity added',value:d.added,lo:d.opening,hi:d.available,color:'#547f69'},{label:'Matched demand',value:-d.matched,lo:d.next,hi:d.available,color:'#b79b65'},{label:'Next state',value:d.next,lo:0,hi:d.next,color:'#3b6659'}];
  const grid=[0,.3,.6,.9,1.2].map(v=>'<line x1="'+L+'" x2="'+R+'" y1="'+y(v)+'" y2="'+y(v)+'" class="market-grid"/><text x="'+(L-12)+'" y="'+(y(v)+4)+'" text-anchor="end" class="market-svg-axis">'+v.toFixed(1)+'</text>').join('');
  const shapes=bars.map((b,i)=>'<rect x="'+(xs[i]-bw/2)+'" y="'+y(b.hi)+'" width="'+bw+'" height="'+(y(b.lo)-y(b.hi))+'" rx="4" fill="'+b.color+'"/><text x="'+xs[i]+'" y="'+(y(b.hi)-12)+'" text-anchor="middle" class="market-svg-number">'+(b.value<0?'−':'')+f(Math.abs(b.value))+'</text><text x="'+xs[i]+'" y="'+(B+29)+'" text-anchor="middle" class="market-svg-label">'+b.label.split(' ').map((word,j)=>'<tspan x="'+xs[i]+'" dy="'+(j?12:0)+'">'+word+'</tspan>').join('')+'</text>'+((i<3)?'<path d="M'+(xs[i]+bw/2)+' '+y([d.opening,d.available,d.next][i])+'H'+(xs[i+1]-bw/2)+'" stroke="#a4b79a" stroke-dasharray="4 4" fill="none"/>':'')).join('');
  q('#market-waterfall').innerHTML='<title>'+d.hour+':00: '+f(d.opening)+' brought forward plus '+f(d.added)+' added, minus '+f(d.matched)+' matched, leaves '+f(d.next)+' for the next state.</title>'+grid+shapes+'<text x="'+L+'" y="16" class="market-svg-axis">LIQUIDITY · MWh EQUIVALENT</text>';
  q('#market-step-metrics').innerHTML='<div><span>DEMAND MATCHED</span><strong>'+f(d.matched)+'<small>/ '+f(d.demand)+'</small></strong><small>MWh equivalent</small></div><div><span>UNMET DEMAND</span><strong>'+f(d.unmet)+'</strong><small>MWh equivalent</small></div><div class="market-risk-metric"><span>ARTIFICIAL LIQUIDITY</span><strong>'+d.artificial.toFixed(4)+'</strong><small>MWh · '+(d.violation*100).toFixed(1)+'% backing violation rate</small></div>';
  q('#market-step-reading').textContent=(marketHour===0?'At 12:00, ':'At 13:00, the previous hour contributes '+f(first.next)+' to the opening state. ')+f(d.available)+' is available; '+f(d.matched)+' matches demand and '+f(d.next)+' carries forward. '+(risk?'Some new liquidity comes from suspicious supply, which the benchmark measures separately.':'With suspicious supply removed, artificial liquidity is zero.');
  if(typeof window.paintRanges==='function')window.paintRanges();
}
['#market-liquidity','#market-burn','#market-risk'].forEach(id=>q(id).addEventListener('input',renderMarketStep));
document.querySelectorAll('[data-market-hour]').forEach(b=>b.addEventListener('click',()=>{marketHour=Number(b.dataset.marketHour);renderMarketStep();}));
q('#market-reset').addEventListener('click',()=>{q('#market-liquidity').value=.4;q('#market-burn').value=0;q('#market-risk').checked=true;marketHour=0;renderMarketStep();});
renderMarketStep();

let marketLastWidth=0;new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(Math.abs(width-marketLastWidth)>1){marketLastWidth=width;renderMarketStep();}}).observe(q('#market-waterfall'));

// A single-request introduction to the user's ongoing placement project.
function placementDevice(kind) {
  const art=kind==='institution'
    ? '<path d="m35 128 87-35 88 37-89 34Z" fill="#dce6d3"/><path d="m71 42 52 23v78l-52-23Z" fill="#86a184"/><path d="m123 65 47-20v78l-47 20Z" fill="#5c8067"/><path d="m71 42 47-20 52 23-47 20Z" fill="#becfb0"/><g stroke="#e0e9d5" stroke-width="1.4"><path d="m81 61 32 14m-32 8 32 14m-32 8 32 14"/></g><g fill="#d9c38e"><path d="m85 61 5 2v5l-5-2Zm0 22 5 2v5l-5-2Zm0 22 5 2v5l-5-2Z"/></g><g fill="#9bb798"><path d="m135 72 22-9v5l-22 9Zm0 19 22-9v5l-22 9Zm0 19 22-9v5l-22 9Z"/></g>'
    : '<ellipse cx="122" cy="144" rx="85" ry="15" fill="#a8bb9e" opacity=".13"/><path d="m40 25 110-13 19 82-110 12Z" fill="#4f6e5e"/><path d="m48 32 96-11 14 66-93 11Z" fill="#8ead91"/><path d="m59 106 110-12 40 29-121 18Z" fill="#c9d5bc"/><path d="m88 141 121-18v7L88 149Z" fill="#92a688"/><path d="m59 106 29 35v8l-29-36Z" fill="#a9b99c"/><g stroke="#90a588" stroke-width="1.2"><path d="m81 113 90-11m-79 19 90-12m-72 18 63-9"/></g><g fill="none" stroke="#dce8cf" stroke-width="1.5"><path d="m88 49 30-3 5 27-30 4Z"/><path d="m99 48-1-8m12 6-1-8m-8 37 1 8m12-10 1 8m-26-23-8 1m10 10-8 1m37-15 8-1m-6 12 8-1"/></g>';
  return '<svg viewBox="0 0 240 170" aria-hidden="true">'+art+'</svg>';
}
function renderPlacementStory() {
  const busy=q('#placement-busy').checked;
  q('#placement-proposed-icon').innerHTML=placementDevice('user');
  q('#placement-executed-icon').innerHTML=placementDevice(busy?'institution':'user');
  q('#placement-check-state').textContent=busy?'Local GPU busy':'Local GPU ready';
  q('#placement-executed-host').textContent=busy?'Institutional GPU':'Your GPU';
  q('#placement-executed-account').innerHTML=busy?'Institution-side energy<br>and reference charge':'User-side energy<br>on your own device';
  q('#placement-story-reading').textContent=busy?'The request moves to the institution. Its resource use is recorded on the institutional side.':'The request stays on your device. Its GPU energy is recorded on the user side.';
  q('#routing-lab').dataset.host=busy?'institution':'user';
}
q('#placement-busy').addEventListener('change',renderPlacementStory);
renderPlacementStory();
