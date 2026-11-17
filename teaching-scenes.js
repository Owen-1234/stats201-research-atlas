// Classroom illustrations. Recorded benchmark values are handled by eval-lab.js.
const q = (s) => document.querySelector(s);

function renderRouting({proposed,capacity,user,repaired}) {
  const direct = 100 - proposed, totalInstitution = 100 - user;
  const y0 = 100, factor = 1.65;
  const inputInstitution = 360 - direct * factor;
  const outputInstitution = 378 - totalInstitution * factor;
  const ribbon = (x1,a,b,x2,c,d,cls) => `<path d="M${x1} ${a}C340 ${a} 530 ${c} ${x2} ${c}V${d}C530 ${d} 340 ${b} ${x1} ${b}Z" class="${cls}"/>`;
  q('#routing-scene').innerHTML = `<svg viewBox="0 0 880 430" role="img" aria-label="100 requests: ${proposed} proposed on user GPUs; capacity ${capacity}; ${user} execute on user GPUs, ${totalInstitution} on institutional GPUs, including ${repaired} rerouted requests.">
    <defs><pattern id="routing-grid" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#b5c6b0" stroke-width=".5"/></pattern></defs><rect x="165" y="65" width="550" height="335" fill="url(#routing-grid)" opacity=".35"/>
    <text x="158" y="33" class="routing-axis">01 / PROPOSED</text><text x="445" y="33" text-anchor="middle" class="routing-axis">02 / CAPACITY CHECK</text><text x="720" y="33" class="routing-axis">03 / EXECUTED</text>
    ${user?ribbon(185,y0,y0+user*factor,710,82,82+user*factor,'routing-user-ribbon'):''}
    ${repaired?ribbon(185,y0+user*factor,y0+proposed*factor,710,outputInstitution,outputInstitution+repaired*factor,'routing-repair-ribbon'):''}
    ${direct?ribbon(185,inputInstitution,360,710,outputInstitution+repaired*factor,378,'routing-institution-ribbon'):''}
    <path d="M445 64V398" stroke="#91aa8c" stroke-width="1.2" stroke-dasharray="4 6"/>
    <rect x="398" y="68" width="94" height="39" rx="19" fill="#f7f9ee" stroke="#cbd9bf"/><text x="445" y="92" text-anchor="middle" class="routing-gate-label">${capacity}% capacity</text>
    <rect x="173" y="${y0}" width="12" height="${proposed*factor}" rx="3" fill="#648d6c"/>
    <rect x="173" y="${inputInstitution}" width="12" height="${direct*factor}" rx="3" fill="#b5bca8"/>
    <rect x="710" y="82" width="12" height="${user*factor}" rx="3" fill="#416f54"/>
    <rect x="710" y="${outputInstitution}" width="12" height="${totalInstitution*factor}" rx="3" fill="#b28e5c"/>
    <text x="155" y="116" text-anchor="end" class="routing-count">${proposed}</text><text x="155" y="136" text-anchor="end" class="routing-small">user-side</text>
    <text x="155" y="${Math.max(inputInstitution+25,312)}" text-anchor="end" class="routing-count">${direct}</text><text x="155" y="${Math.max(inputInstitution+45,332)}" text-anchor="end" class="routing-small">institution</text>
    <text x="739" y="107" class="routing-count">${user}</text><text x="739" y="127" class="routing-small">user-side</text>
    <text x="739" y="${Math.max(outputInstitution+25,316)}" class="routing-count">${totalInstitution}</text><text x="739" y="${Math.max(outputInstitution+45,336)}" class="routing-small">institution</text>
    <g transform="translate(445 ${repaired ? 267 : 218})"><rect x="-81" y="-20" width="162" height="43" rx="7" fill="${repaired?'#fbf1df':'#eef4e7'}" stroke="${repaired?'#d5b78b':'#bdcfad'}"/><text text-anchor="middle" y="6" class="routing-callout">${repaired ? `${repaired} requests rerouted ↘` : 'The proposal fits ✓'}</text></g>
    <text x="445" y="422" text-anchor="middle" class="routing-small">Ribbon thickness represents request count. Total: 100 requests.</text>
  </svg>`;
  q('#routing-rerouted-count').textContent = String(repaired);
  q('#routing-request-grid').innerHTML = Array.from({length:100},(_,i)=>`<i class="${i<user?'request-local':i<proposed?'request-rerouted':'request-direct'}" aria-hidden="true"></i>`).join('');
  q('#routing-request-grid').setAttribute('aria-label',`${user} user-side requests, ${repaired} rerouted requests, ${direct} direct institution requests`);
  q('#routing-overflow-label').textContent = repaired ? 'CAPACITY OVERFLOW' : 'NO REPAIR NEEDED';
  q('#routing-reroute-card').classList.toggle('has-overflow', repaired > 0);
  document.querySelectorAll('[data-routing-preset]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.proposed===String(proposed)&&b.dataset.capacity===String(capacity))));
}

document.addEventListener('atlas:routing',e=>renderRouting(e.detail));
document.addEventListener('click',e=>{
  const preset=e.target.closest('[data-routing-preset]');
  if(preset){q('#placement').value=preset.dataset.proposed;q('#capacity').value=preset.dataset.capacity;window.renderCost();}
});
window.renderCost();

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
