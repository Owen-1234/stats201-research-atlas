// Classroom illustrations. Recorded benchmark values are handled by eval-lab.js.
const q = (s) => document.querySelector(s);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

function solarArray() {
  return `<g transform="translate(85 142)"><path d="M0 76 130 28 212 63 80 114Z" fill="#b9cbb7" opacity=".34"/><path d="M25 55 124 17 190 46 90 85Z" fill="#345e62" stroke="#dce7d7" stroke-width="2"/><path d="m25 55 65 30v8L25 63Z" fill="#244b51"/><path d="m90 85 100-39v8L90 93Z" fill="#21454b"/><g stroke="#95b7b0" stroke-width="1.1" opacity=".8"><path d="m58 42 66 30m-33-43 66 30M46 65l99-38M68 75l99-38"/></g><g stroke="#809781" stroke-width="4"><path d="M45 71v18m113-23v18M92 92v16"/></g></g>`;
}

function batteryIllustration(charge) {
  return `<g transform="translate(374 195)"><ellipse cx="60" cy="104" rx="69" ry="21" fill="#9eb397" opacity=".14"/><path d="M10 14 49 0 105 23 65 39Z" fill="#dce6cb"/><path d="m65 39 40-16v73l-40 17Z" fill="#789774"/><path d="M10 14 65 39v74L10 88Z" fill="#b8cda3"/><path d="m47 0 17-6 25 10-17 7Z" fill="#43694b"/><path d="m25 43 25 11v22L25 65Z" fill="${charge > 0 ? '#547b4e' : '#a8bc94'}"/><path d="m25 69 25 11v22L25 91Z" fill="${charge > 1 ? '#547b4e' : '#a8bc94'}"/><path d="m77 49 17-7v14l-17 7Z" fill="#9ab18a"/><path d="m77 70 17-7v14l-17 7Z" fill="#9ab18a"/></g>`;
}

function cityIllustration() {
  return `<g transform="translate(638 118)"><path d="m-4 117 92-36 101 44-91 36Z" fill="#a8bba6" opacity=".24"/><g stroke="#f3f4e8" stroke-width="1"><path d="m26 47 32-12 37 17-32 12Z" fill="#b2c9bd"/><path d="m26 47 37 17v77l-37-17Z" fill="#72968b"/><path d="m63 64 32-12v77l-32 12Z" fill="#537a71"/><path d="m101 81 26-10 35 16-26 10Z" fill="#d6c6a4"/><path d="m101 81 35 16v56l-35-16Z" fill="#bba580"/><path d="m136 97 26-10v56l-26 10Z" fill="#99825f"/></g><g fill="#e6d5a1"><path d="m35 66 8 3v11l-8-3Zm0 23 8 3v11l-8-3Zm15-17 7 3v11l-7-3Zm0 23 7 3v11l-7-3Zm61 4 7 3v10l-7-3Zm0 20 7 3v10l-7-3Z"/></g></g>`;
}

function renderEnergy({ storedUnits, eveningComplete, gamma }) {
  const chosen = storedUnits !== null;
  const stored = storedUnits ?? 0, now = 2 - stored, later = 3 * stored;
  const stage = q('#energy-scene');
  q('#energy-playground').dataset.phase = eveningComplete ? 'evening' : 'noon';
  q('#energy-phase-label').textContent = eveningComplete ? '02 / THE EVENING OUTCOME' : '01 / MAKE A NOON DECISION';
  const flow = (path, on, color, extra = '') => `<path d="${path}" fill="none" stroke="${color}" stroke-width="${on ? 4 : 1.5}" opacity="${on ? 1 : .35}" class="${on && !reduced ? 'energy-current' : ''}" ${extra}/>`;
  stage.innerHTML = `<svg viewBox="0 0 880 390" role="img" aria-label="Two solar energy units: ${chosen ? `${now} sold at noon, ${stored} stored for evening; ${eveningComplete ? later + ' evening credits received' : 'evening not yet run'}` : 'choose whether to sell now or store for evening'}">
    <defs><pattern id="energy-floor" width="44" height="25" patternUnits="userSpaceOnUse"><path d="M0 12.5 22 0 44 12.5 22 25Z" fill="none" stroke="#9bb399" stroke-width=".55"/></pattern><linearGradient id="energy-sky" x2="1" y2="1"><stop stop-color="#f5f2df"/><stop offset="1" stop-color="#e6eee4"/></linearGradient></defs>
    <path d="m35 255 340-144 455 151-338 122Z" fill="url(#energy-floor)" opacity=".3"/>
    <g class="energy-sun" transform="translate(157 66)"><circle r="21" fill="#cfb26f"/><circle r="31" fill="none" stroke="#cfb26f" opacity=".24"/>${Array.from({length:8},(_,i)=>`<path d="M0-39v-8" stroke="#c3a86d" transform="rotate(${i*45})"/>`).join('')}</g>
    <g transform="translate(741 60)"><circle r="21" fill="#adc2b4"/><circle cx="9" cy="-7" r="18" fill="#edf2e8"/><circle cx="36" cy="-13" r="2" fill="#9eb6a5"/></g>
    ${flow('M240 210 313 183 414 107', chosen && now > 0, '#b99b60')}
    ${flow('M240 210 315 244 389 263', chosen && stored > 0 && !eveningComplete, '#6d946b')}
    ${flow('M477 263 C560 294 609 235 673 211', chosen && stored > 0 && eveningComplete, '#6d946b', 'stroke-dasharray="7 6"')}
    <g transform="translate(384 83)"><path d="m0 35 48-18 58 24-48 20Z" fill="#d4bc83"/><path d="M0 35v9l58 26v-9Z" fill="#b39861"/><path d="m58 61 48-20v9L58 70Z" fill="#8e7850"/><path d="m24 20 25-9 30 12-25 10Z" fill="#e7d7af"/><text x="54" y="-12" text-anchor="middle" class="energy-svg-small">SELL AT NOON</text><text x="54" y="91" text-anchor="middle" class="energy-svg-value">${chosen ? now : '—'} <tspan class="energy-svg-small">credits now</tspan></text></g>
    ${solarArray()}${batteryIllustration(eveningComplete ? 0 : stored)}${cityIllustration()}
    <text x="173" y="293" text-anchor="middle" class="energy-svg-label">Solar generation</text><text x="173" y="314" text-anchor="middle" class="energy-svg-small">2 ENERGY UNITS</text>
    <text x="433" y="340" text-anchor="middle" class="energy-svg-label">${eveningComplete ? 'Battery discharged' : 'Keep for later'}</text><text x="433" y="360" text-anchor="middle" class="energy-svg-small">${chosen ? eveningComplete ? '0 UNITS REMAINING' : `${stored} / 2 UNITS STORED` : '2-UNIT CAPACITY'}</text>
    <text x="735" y="298" text-anchor="middle" class="energy-svg-label">Evening market</text><text x="735" y="319" text-anchor="middle" class="energy-svg-small">${eveningComplete ? `${later} CREDITS RECEIVED` : '3 CREDITS / UNIT'}</text>
    <text x="157" y="22" text-anchor="middle" class="energy-svg-small">12:00 / NOON</text><text x="741" y="22" text-anchor="middle" class="energy-svg-small">18:00 / EVENING</text>
    ${chosen ? `<g class="energy-route-tag" transform="translate(302 144)"><rect x="-28" y="-13" width="56" height="25" rx="12"/><text text-anchor="middle" y="4">${now} sold</text></g><g class="energy-route-tag" transform="translate(318 274)"><rect x="-30" y="-13" width="60" height="25" rx="12"/><text text-anchor="middle" y="4">${stored} stored</text></g>` : ''}
  </svg>`;
  q('#energy-now-value').textContent = chosen ? String(now) : '—';
  q('#energy-later-value').textContent = eveningComplete ? String(later) : '—';
  q('#energy-storage-value').textContent = chosen ? String(eveningComplete ? 0 : stored) : '—';
  q('#energy-later-label').textContent = eveningComplete ? 'EVENING REWARD' : 'EVENING / NOT RUN YET';
  if (eveningComplete) {
    const total = now + gamma * later;
    q('#return-display').innerHTML = `<span>DISCOUNTED RETURN</span><strong>${total.toFixed(2)} <small>credits</small></strong><p>${now} now + ${gamma.toFixed(2)} × ${later} in the evening</p><small>Undiscounted revenue: ${now + later} credits</small>`;
    const outcomes = [0,1,2].map(n=>({n,now:2-n,future:gamma*3*n,total:2-n+gamma*3*n}));
    const best = Math.max(...outcomes.map(d=>d.total));
    q('#battery-comparison').innerHTML = `<div class="energy-comparison-head"><span>COMPARE THE THREE CHOICES</span><small>Now + discounted evening reward · credits</small></div>${outcomes.map(d=>`<button type="button" data-battery-plan="${d.n}" class="energy-result-row ${d.n===stored?'chosen':''}"><span>${['Sell both','Split the day','Store both'][d.n]}</span><span class="energy-result-track"><i style="width:${d.now/6*100}%"></i><b style="width:${d.future/6*100}%"></b></span><strong>${d.total.toFixed(2)}</strong><small>${Math.abs(d.total-best)<1e-9?'BEST AT THIS γ':''}</small></button>`).join('')}<div class="energy-comparison-key"><span><i></i>Noon reward</span><span><i></i>Discounted evening reward</span></div>`;
  } else if (chosen) {
    q('#return-display').innerHTML = `<span>NEXT STEP</span><strong>18:00 awaits.</strong><p>Run the evening to observe the remaining reward.</p><small>${stored} ${stored === 1 ? 'unit' : 'units'} stored · evening price: 3 credits per unit</small>`;
  }
}

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

document.addEventListener('atlas:battery',e=>queueMicrotask(()=>renderEnergy(e.detail)));
document.addEventListener('atlas:routing',e=>renderRouting(e.detail));
document.addEventListener('click',e=>{
  const plan=e.target.closest('[data-battery-plan]');
  if(plan)q(`[data-store="${plan.dataset.batteryPlan}"]`).click();
  const preset=e.target.closest('[data-routing-preset]');
  if(preset){q('#placement').value=preset.dataset.proposed;q('#capacity').value=preset.dataset.capacity;window.renderCost();}
});
window.renderBattery();
window.renderCost();
