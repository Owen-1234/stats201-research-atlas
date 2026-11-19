(function(){
  'use strict';
  const M=window.SolarAtlasModel,q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
  const money=v=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(v);
  const time=h=>`${String(Math.floor(h)%24).padStart(2,'0')}:${String(Math.round((h%1)*60)).padStart(2,'0')}`;
  const kw=v=>`${v.toFixed(1)} <small>kW</small>`;
  const svgText=(x,y,t,extra='')=>`<text x="${x}" y="${y}" ${extra}>${t}</text>`;
  function paint(){if(typeof paintRanges==='function')paintRanges();}


  function drawFinancingCurve(evaluate, rate, capacityFactor, years) {
    const svg = q('#finance-scenarios');
    const width = Math.max(220, Math.round(svg.clientWidth || 680));
    const compact = width < 450;
    const height = compact ? 218 : 275;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    const left = 44, right = width - 18, top = 29, bottom = height - 43;
    const ceiling = Math.ceil(evaluate(16, .214).cost / 40) * 40;
    const x = r => left + (r - 2) / 14 * (right - left);
    const y = cost => bottom - cost / ceiling * (bottom - top);
    const grid = [0, 1, 2, 3, 4].map(i => {
      const cost = ceiling * i / 4;
      return `<line x1="${left}" x2="${right}" y1="${y(cost)}" y2="${y(cost)}" class="finance-grid"/>${svgText(left - 7, y(cost) + 4, '$'+cost, 'text-anchor="end" class="dcf-axis"')}`;
    }).join('');
    const rates = compact ? [2, 6, 10, 14, 16] : [2, 4, 6, 8, 10, 12, 14, 16];
    const ticks = rates.map(r => svgText(x(r), bottom + 17, r+'%', 'text-anchor="middle" class="dcf-axis"')).join('');
    const resources = [{cf: .214, line: '#74866f', dash: '5 3'}, {cf: .269, line: '#256557', dash: ''}, {cf: .34, line: '#9b692e', dash: '2 3'}];
    const curves = resources.map(resource => {
      const points = Array.from({length: 57}, (_, i) => {
        const r = 2 + i / 4;
        return `${x(r)},${y(evaluate(r, resource.cf).cost)}`;
      });
      return `<polyline points="${points.join(' ')}" fill="none" stroke="${resource.line}" stroke-dasharray="${resource.dash}" stroke-width="${resource.cf === capacityFactor ? 3 : 1.8}"/>`;
    }).join('');
    const cost = evaluate(rate).cost;
    const labelX = Math.min(right - 35, Math.max(left + 35, x(rate)));
    const labelY = Math.max(top + 4, y(cost) - 20);
    svg.innerHTML = `<title>${years}-year discounted cash-flow model. At ${rate}% the selected plant requires $${cost.toFixed(1)} per MWh.</title>
      ${grid}${ticks}${curves}<path d="M${x(rate)} ${top}V${bottom}" stroke="#73877a" stroke-dasharray="3 4"/>
      <circle cx="${x(rate)}" cy="${y(cost)}" r="5.5" fill="#164c42" stroke="#fff" stroke-width="2"/>
      <rect x="${labelX - 34}" y="${labelY - 14}" width="68" height="22" rx="5" fill="#205849"/>
      ${svgText(labelX, labelY+1, '$'+cost.toFixed(1), 'text-anchor="middle" class="dcf-value"')}
      ${svgText(left, 14, 'Real $/MWh', 'class="dcf-axis"')}${svgText((left+right)/2, height-3, 'Real discount rate', 'text-anchor="middle" class="dcf-axis"')}`;
  }

  function renderFinance(){
    const investment=Number(q('#project-cost').value)*1000,years=Number(q('#project-life').value),rate=Number(q('#wacc').value),capacityFactor=Number(q('#finance-resource').value);
    const evaluate=(r,cf=capacityFactor,n=years)=>M.finance({investment,years:n,rate:r,capacityFactor:cf});
    const current=evaluate(rate),reference=evaluate(8),delta=current.cost-reference.cost;
    q('#project-cost-output').textContent='$'+(investment/1e6).toFixed(2)+'m';
    q('#project-life-output').textContent=years+' years';q('#wacc-output').textContent=rate.toFixed(1)+'%';
    q('#annual-capital').textContent='$'+(current.pvCost/1e6).toFixed(2)+'m';
    q('#levelized-cost').innerHTML='$'+current.cost.toFixed(1)+'<small>/MWh</small>';
    q('#financing-delta').innerHTML=(delta>=0?'+':'−')+'$'+Math.abs(delta).toFixed(1)+'<small>/MWh</small>';
    q('#finance-energy').textContent=current.energy.toLocaleString('en-US',{maximumFractionDigits:1})+' MWh';

    drawFinancingCurve(evaluate, rate, capacityFactor, years);
    const presets = q('#finance-scenarios-mobile');
    [4, 8, 12].forEach(r => {
      let button = presets.querySelector(`[data-preset-rate="${r}"]`);
      if (!button) {
        button = document.createElement('button');
        button.type = 'button';
        button.dataset.presetRate = r;
        presets.append(button);
      }
      button.setAttribute('aria-pressed', String(r === rate));
      button.innerHTML = `<span>${r}% real rate</span><strong>$${evaluate(r).cost.toFixed(1)}<small>/MWh</small></strong>`;
    });
    q('#finance-caption').textContent='At '+rate.toFixed(1)+'%, discounted costs are '+money(current.pvCost)+' and discounted generation is '+current.pvEnergy.toLocaleString('en-US',{maximumFractionDigits:0})+' MWh. Their ratio is $'+current.cost.toFixed(1)+'/MWh. Every curve discounts annual output after 0.7% yearly degradation.';
    q('#finance-interpretation').textContent='At the displayed price, the present value of revenue equals the present value of investment and operating costs. '+(Math.abs(delta)<.05?'This scenario uses the 8% reference rate.':rate.toFixed(1)+'% '+(delta>0?'raises':'lowers')+' the required price by $'+Math.abs(delta).toFixed(1)+'/MWh versus 8%, with physical generation unchanged.');
    paint();
  }
  ['#project-cost','#project-life','#wacc','#finance-resource'].forEach(id=>q(id).addEventListener('input',renderFinance));
  q('#finance-reset').addEventListener('click',()=>{q('#project-cost').value=1560;q('#project-life').value=30;q('#wacc').value=8;q('#finance-resource').value=.269;renderFinance();});



  q('#finance-scenarios-mobile').addEventListener('click', event => {
    const button = event.target.closest('[data-preset-rate]');
    if (!button) return;
    q('#wacc').value = button.dataset.presetRate;
    renderFinance();
  });
  let lastCurveWidth = 0;
  new ResizeObserver(([entry]) => {
    if (Math.abs(lastCurveWidth - entry.contentRect.width) < 1) return;
    lastCurveWidth = entry.contentRect.width;
    renderFinance();
  }).observe(q('#finance-scenarios'));
  const GEO=window.ShanghaiAtlasMap;
  const baseline=()=>[
    {id:'PV-01',type:'solar',lat:31.2410,lon:121.4860,row:0,col:1,capacity:24,bias:1},
    {id:'PV-02',type:'solar',lat:31.2424,lon:121.5110,row:1,col:2,capacity:36,bias:1},
    {id:'PV-03',type:'solar',lat:31.2300,lon:121.5060,row:3,col:5,capacity:24,bias:1},
    {id:'FC-01',type:'factory',lat:31.2295,lon:121.4855,row:3,col:1,capacity:30},
    {id:'FC-02',type:'factory',lat:31.2340,lon:121.5120,row:1,col:5,capacity:42},
  ];
  const state={assets:baseline(),hour:10,cloud:15,tool:'inspect',selected:'PV-01',running:true,visible:false,speed:1,version:0,solarCount:3,factoryCount:2,pending:[],records:[],history:[],draftBias:1,busy:false,camera:{cx:440,cy:325,zoom:1},buildSizes:{solar:24,factory:36}};
  const map=q('#city-map'),lab=q('#solar-city');let latest=M.city(state.assets,state.hour,state.cloud);
  const typeName=type=>({solar:'Solar array',factory:'Factory'}[type]);
  function project(lon,lat){const p=GEO.projection;return {x:p.offsetX+(lon*Math.PI/180-p.minx)*p.scale,y:GEO.height-p.offsetY-(Math.log(Math.tan(Math.PI/4+lat*Math.PI/360))-p.miny)*p.scale};}
  function unproject(x,y){const p=GEO.projection;return {lon:(p.minx+(x-p.offsetX)/p.scale)*180/Math.PI,lat:(2*Math.atan(Math.exp(p.miny+(GEO.height-p.offsetY-y)/p.scale))-Math.PI/2)*180/Math.PI};}
  function inRing(point,ring){let inside=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if(((a[1]>point.y)!==(b[1]>point.y))&&(point.x<(b[0]-a[0])*(point.y-a[1])/(b[1]-a[1])+a[0]))inside=!inside;}return inside;}
  const onWater=point=>GEO.water.some(ring=>inRing(point,ring));
  const selectedAsset=()=>state.assets.find(a=>a.id===state.selected);
  function applyCamera(){
    const aspect=(map.clientWidth||880)/(map.clientHeight||650),h=Math.min(650,880/aspect)/state.camera.zoom,w=h*aspect;
    state.camera.cx=Math.max(w/2,Math.min(880-w/2,state.camera.cx));state.camera.cy=Math.max(h/2,Math.min(650-h/2,state.camera.cy));
    map.setAttribute('viewBox',`${state.camera.cx-w/2} ${state.camera.cy-h/2} ${w} ${h}`);
    const length=state.camera.zoom>2?200:500,metersPerUnit=6378137*Math.cos(31.237*Math.PI/180)/GEO.projection.scale;
    q('#city-scale-line').style.width=`${length/metersPerUnit*(map.clientWidth||880)/w}px`;q('#city-scale-label').textContent=`${length} m`;
  }
  function solarIcon(id){return `<g class="solar-building"><ellipse cy="3" rx="39" ry="14" fill="#80918b" opacity=".18"/><path d="M-26-8V4M24-12V0M0 1v9" stroke="#849491" stroke-width="3"/><path d="M-37-20-1-36 36-22 0-6Z" fill="#2b4b64" stroke="#f5f4ed" stroke-width="1.2"/><path d="m-25-25 37 15m-25-20 37 15m-31 3 36-16m-24 21 36-16" fill="none" stroke="#97adb7" stroke-width=".7"/><text class="building-label" y="24" text-anchor="middle">${id}</text></g>`;}
  function factoryIcon(id){return `<g class="factory-building"><ellipse cy="5" rx="40" ry="16" fill="#85918a" opacity=".2"/><path d="m-34-36 36 19v29l-36-19Z" fill="#b7b8aa"/><path d="m2-17 34-18v29L2 12Z" fill="#d8d4c5"/><path d="m-34-36 34-18 36 19L2-17Z" fill="#ededdf"/><path d="m-20-44 8-4v-27l-8 4Z" fill="#a9b1aa"/><path d="m-12-48 7 4v-27l-7-4Z" fill="#c5c9be"/><path d="m-20-71 8-4 7 4-8 4Z" fill="#e3e5d8"/><path d="m-26-25 8 4v9l-8-4Zm14 7 8 4v9l-8-4Z" fill="#637c83"/><path d="m10-14 8-4v9l-8 4Zm13-7 8-4v9l-8 4Z" fill="#899b95"/><text class="building-label" y="28" text-anchor="middle">${id}</text></g>`;}
  function tree(x,y,scale=1){return `<g transform="translate(${x} ${y}) scale(${scale})"><path d="M0 0v-20" stroke="#7d8675" stroke-width="3"/><ellipse cy="-24" rx="11" ry="15" fill="#91a590"/><ellipse cx="-3" cy="-27" rx="8" ry="12" fill="#adbc9f"/></g>`;}
  function renderMap(){
    const focused=document.activeElement?.dataset?.asset;
    const factories=state.assets.filter(a=>a.type==='factory');
    const flows=state.assets.filter(a=>a.type==='solar').map(a=>{const start=project(a.lon,a.lat),target=factories.reduce((best,f)=>{const p=project(f.lon,f.lat);return !best||Math.hypot(p.x-start.x,p.y-start.y)<best.distance?{...p,distance:Math.hypot(p.x-start.x,p.y-start.y)}:best;},null);if(!target)return '';return `<path d="M${start.x} ${start.y}Q${(start.x+target.x)/2} ${Math.min(start.y,target.y)-30} ${target.x} ${target.y}" class="energy-flow"/>`;}).join('');
    const buildings=state.assets.map(a=>{const {x,y}=project(a.lon,a.lat);return `<g transform="translate(${x} ${y})" class="geo-asset ${a.id===state.selected?'selected':''}" data-asset="${a.id}" data-building="${a.id}" role="button" tabindex="0" aria-label="Inspect ${typeName(a.type).toLowerCase()} ${a.id}"><title>${a.id} · ${typeName(a.type)} · ${a.capacity} kW · ${a.lat.toFixed(4)} N, ${a.lon.toFixed(4)} E</title><circle class="asset-selected-ring" r="27"/><circle r="31" fill="transparent"/><circle class="asset-location-dot" r="4"/><path d="M0 0v-14" stroke="#879f9f" stroke-width="1.4"/><g transform="translate(0 -12) scale(.62)" pointer-events="none">${a.type==='solar'?solarIcon(a.id):factoryIcon(a.id)}<g class="device-signal"><circle cx="${a.type==='solar'?29:33}" cy="${a.type==='solar'?-35:-58}" r="5"/></g></g><text class="geo-reading" y="23" text-anchor="middle" data-map-reading="${a.id}"></text></g>`;}).join('');
    const pending=state.pending.map(a=>`<g transform="translate(${a.x} ${a.y})" class="geo-pending"><circle r="21"/><path d="M-12 8V-14h24V8M-12-6h24M0-14v22"/><text y="35" text-anchor="middle">BUILDING</text></g>`).join('');
    map.innerHTML=`<title>Central Shanghai: The Bund and Lujiazui. ${state.assets.length} simulated energy assets.</title><image href="assets/shanghai-basemap.svg" x="0" y="0" width="880" height="650" pointer-events="none"/><g class="energy-flows">${flows}</g><g id="geo-buildings">${buildings}</g><g id="geo-pending">${pending}</g><g id="geo-build-preview" class="geo-build-preview" pointer-events="none" hidden><circle r="20"/><path d="M-9 0H9M0-9V9"/></g>`;
    if(focused)map.querySelector(`[data-asset="${focused}"]`)?.focus({preventScroll:true});
    applyCamera();renderMapState();
  }
  function renderMapState(){
    map.classList.toggle('night',state.hour<6||state.hour>=18);map.classList.toggle('is-running',state.running&&state.visible);
    latest.devices.filter(d=>d.type==='solar').forEach(d=>map.querySelector(`[data-building="${d.id}"]`)?.classList.toggle('flagged',d.flagged));
    latest.devices.forEach(d=>{const reading=map.querySelector(`[data-map-reading="${d.id}"]`);if(reading)reading.textContent=`${(d.type==='solar'?d.reported:d.demand).toFixed(1)} kW${d.flagged?' !':''}`;});
  }
  function seedHistory(){state.history=Array.from({length:13},(_,i)=>{const h=(state.hour-(12-i)*.25+24)%24;return {hour:h,...M.city(state.assets,h,state.cloud)};});}
  function renderHistory(){
    const data=state.history,max=Math.max(20,...data.flatMap(d=>[d.generation,d.demand])),ceil=Math.ceil(max/20)*20;
    const x=i=>42+i/(data.length-1)*630,y=v=>173-v/ceil*141;
    const grids=[0,.5,1].map(t=>`<line x1="42" x2="672" y1="${y(t*ceil)}" y2="${y(t*ceil)}" class="history-grid"/>${svgText(32,y(t*ceil)+4,(t*ceil).toFixed(0),'text-anchor="end" class="axis-text"')}`).join('');
    const line=(key,color,dash='')=>`<polyline points="${data.map((d,i)=>`${x(i)},${y(d[key])}`).join(' ')}" fill="none" stroke="${color}" stroke-width="2.4" ${dash?`stroke-dasharray="${dash}"`:''}/>`;
    const ticks=[0,4,8,12].filter(i=>i<data.length).map(i=>svgText(x(i),200,time(data[i].hour),'text-anchor="middle" class="axis-text"')).join('');
    q('#city-history').innerHTML=`<title>Recent simulated city energy readings</title>${grids}<polygon points="42,173 ${data.map((d,i)=>`${x(i)},${y(d.generation)}`).join(' ')} 672,173" fill="#719e9220"/>${line('generation','#538b7a')}${line('demand','#b49055')}${line('verified','#304e68','4 4')}${ticks}${['generation','demand','verified'].map((key,i)=>`<circle cx="672" cy="${y(data[data.length-1][key])}" r="3.5" fill="${['#538b7a','#b49055','#304e68'][i]}"/>`).join('')}`;
  }
  function renderInspector(){
    const a=selectedAsset();
    q('#city-device').dataset.deviceId=a?.id??'';
    q('#city-device-select').innerHTML=state.assets.map(asset=>`<option value="${asset.id}" ${asset.id===a?.id?'selected':''}>${asset.id} · ${typeName(asset.type)} · ${asset.capacity} kW</option>`).join('');
    if(!a){q('#city-device').innerHTML='<div class="inspector-empty"><span>↖</span><h4>Choose a building.</h4><p>Inspect a solar array or factory to see its readings and report status.</p></div>';return;}
    state.draftBias=a.bias??1;
    q('#city-device').innerHTML=`<div class="device-title"><span class="device-type">${typeName(a.type).toUpperCase()}</span><h4>${a.id}</h4><p>${a.capacity} kW ${a.type==='solar'?'rated capacity':'rated demand'}<br>${a.lat.toFixed(4)}° N · ${a.lon.toFixed(4)}° E</p></div><div class="device-reading"><span>${a.type==='solar'?'AC output':'Current demand'}</span><strong id="device-main-value"></strong><small id="device-timestamp"></small></div><dl class="device-measures">${(a.type==='solar'?[['device-dc','DC output'],['device-bound','Physical upper bound'],['device-report','Reported output'],['device-temp','Module temperature'],['device-irradiance','Irradiance']]:[['device-served','Supplied by verified solar'],['device-fulfillment','Local solar share'],['device-import','Grid supply']]).map(([id,label])=>`<div><dt>${label}</dt><dd id="${id}"></dd></div>`).join('')}</dl><div id="device-verdict" class="device-verdict" role="status"></div>${a.type==='solar'?`<div class="report-controls"><label for="report-bias">Report multiplier <output id="report-bias-output">${state.draftBias.toFixed(1)}×</output></label><input type="range" id="report-bias" min="1" max="2.5" step="0.1" value="${state.draftBias}"><div><button id="submit-city-report" class="studio-primary">Submit report</button><button id="inflate-city-report" class="studio-text-button">Try 1.8×</button></div><button id="restore-city-report" class="studio-text-button">Restore measured report</button></div>`:`<p class="device-factory-note">Factories add electricity demand. Add solar capacity or change the time to see how much of it can be met locally.</p>`}`;
    renderSensor();paint();
  }
  function renderSensor(){
    const a=selectedAsset();if(!a||q('#city-device').dataset.deviceId!==a.id)return;
    const d=latest.devices.find(d=>d.id===a.id);if(!d)return;
    q('#device-main-value').innerHTML=kw(a.type==='solar'?d.generation:d.demand);q('#device-timestamp').textContent=`Simulated reading · ${time(state.hour)}`;
    if(a.type==='solar'){
      q('#device-dc').textContent=`${d.dc.toFixed(1)} kW`;q('#device-bound').textContent=`${d.bound.toFixed(1)} kW`;q('#device-report').textContent=`${d.reported.toFixed(1)} kW`;q('#device-temp').textContent=`${d.temp.toFixed(1)} °C`;q('#device-irradiance').textContent=`${d.irradiance.toFixed(0)} W/m²`;
      q('#device-verdict').className=`device-verdict ${d.flagged?'flagged':'accepted'}`;
      q('#device-verdict').innerHTML=`<i></i><div><strong>${d.flagged?'Report flagged':'Report within the bound'}</strong><span>${d.flagged?`${(d.reported-d.bound).toFixed(1)} kW above the modelled limit; excluded from verified supply.`:'Eligible for the simulated local supply account.'}</span></div>`;
    }else{
      const local=d.demand*(latest.demand?latest.served/latest.demand:0);
      q('#device-served').textContent=`${local.toFixed(1)} kW`;q('#device-fulfillment').textContent=`${(latest.coverage).toFixed(0)}%`;q('#device-import').textContent=`${(d.demand-local).toFixed(1)} kW`;
      q('#device-verdict').className='device-verdict accepted';q('#device-verdict').innerHTML='<i></i><div><strong>Demand recorded</strong><span>Verified solar supply is shared across factories in proportion to their demand.</span></div>';
    }
  }
  function renderReadings(){
    latest=M.city(state.assets,state.hour,state.cloud);
    q('#city-generation').innerHTML=kw(latest.generation);q('#city-demand').innerHTML=kw(latest.demand);
    const panels=state.assets.filter(a=>a.type==='solar'),factories=state.assets.filter(a=>a.type==='factory');
    q('#city-panel-count').textContent=`${panels.length} arrays · ${panels.reduce((v,a)=>v+a.capacity,0)} kW installed`;
    q('#city-factory-count').textContent=`${factories.length} factories · ${factories.reduce((v,a)=>v+a.capacity,0)} kW rated demand`;
    q('#city-coverage').innerHTML=latest.demand?`${latest.coverage.toFixed(0)}<small>%</small>`:'—';
    q('#city-balance').textContent=latest.imports>.05?`${latest.imports.toFixed(1)} kW from the grid`:`${latest.exports.toFixed(1)} kW available for export`;
    q('#city-clock').textContent=time(state.hour);q('#city-hour').value=state.hour;q('#city-hour-output').textContent=time(state.hour);q('#city-cloud-output').textContent=`${state.cloud}%`;
    q('#city-play').textContent=state.running?'Ⅱ Pause':'▷ Play';q('#city-play').setAttribute('aria-pressed',String(state.running));
    q('#sensor-connection').textContent=state.busy?'◌ Checking…':state.running?'● Reporting':'Ⅱ Paused';
    renderMapState();renderSensor();paint();
  }
  function renderRecords(){
    q('#city-reports').innerHTML=state.records.slice(0,5).map(r=>`<div class="report-row ${r.flagged?'flagged':''}"><span class="record-time">${r.time}</span><span><strong>${r.id}</strong><small>${r.text}</small></span><b>${r.status}</b></div>`).join('');
  }
  function appendReports(snapshot=latest,chosen){
    const nodes=snapshot.devices.filter(d=>d.type==='solar'&&(!chosen||d.id===chosen));
    state.records=[...nodes.map(d=>({time:time(snapshot.hour??state.hour),id:d.id,text:`${d.reported.toFixed(1)} kW / ${d.bound.toFixed(1)} kW bound`,flagged:d.flagged,status:d.flagged?'Flagged':'Verified'})),...state.records].slice(0,12);renderRecords();
  }
  function capture(){state.history.push({hour:state.hour,...latest});state.history=state.history.slice(-13);renderHistory();}
  function delayedReport(chosen){
    const version=state.version;state.busy=true;renderReadings();const snapshot={...latest,hour:state.hour};
    setTimeout(()=>{if(version!==state.version)return;state.busy=false;appendReports(snapshot,chosen);renderReadings();},650);
  }
  function activateTool(tool){
    state.tool=tool;qa('[data-city-tool]').forEach(b=>{const active=b.dataset.cityTool===tool;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
    lab.dataset.tool=tool;q('#city-tool-hint').textContent={inspect:'Drag to explore. Select a built asset for its readings.',solar:'Click a location on land to add a solar array.',factory:'Click a location on land to add a factory.',remove:'Select a built asset to remove it.'}[tool];
    const building=['solar','factory'].includes(tool);
    q('#build-spec').hidden=!building;q('.inspector-heading .eyebrow').textContent=building?'BUILD CONFIGURATION':'DEVICE INSPECTOR';
    q('#build-spec-title').textContent=`New ${typeName(tool)?.toLowerCase()??'asset'}`;q('#build-preview').innerHTML=`<svg viewBox="0 0 130 100"><g transform="translate(65 65)">${tool==='solar'?solarIcon(''):factoryIcon('')}</g></svg>`;
    q('#build-size-label').textContent=tool==='solar'?'Array capacity':`${typeName(tool)??'Device'} demand`;
    if(building){q('#city-build-size').step=6;q('#city-build-size').min=12;q('#city-build-size').value=state.buildSizes[tool];}
    q('#city-build-output').textContent=`${q('#city-build-size').value} kW`;
    q('#geo-build-preview')?.setAttribute('hidden','');
  }
  function inspectAsset(id){
    const existing=state.assets.find(a=>a.id===id);if(!existing)return;
    if(state.tool==='remove'){
      state.assets=state.assets.filter(a=>a.id!==id);if(state.selected===id)state.selected=state.assets[0]?.id;
      q('#city-build-status').textContent=`${id} removed from the map.`;renderReadings();capture();renderMap();renderInspector();return;
    }
    state.selected=id;activateTool('inspect');renderMap();renderInspector();q('#city-build-status').textContent=`Inspecting ${id} at ${existing.lat.toFixed(4)}° N, ${existing.lon.toFixed(4)}° E.`;
  }
  function buildAt(point){
    if(!['solar','factory'].includes(state.tool)){q('#city-build-status').textContent='Choose Solar array or Factory, then click on land.';return;}
    if(point.x<0||point.x>880||point.y<0||point.y>650)return;
    if(onWater(point)){q('#city-build-status').textContent='This location is on the river. Choose a point on land.';return;}
    if(state.assets.some(a=>{const p=project(a.lon,a.lat);return Math.hypot(p.x-point.x,p.y-point.y)<27;})){q('#city-build-status').textContent='An asset is already nearby. Choose another location.';return;}
    if(state.pending.some(p=>Math.hypot(p.x-point.x,p.y-point.y)<27))return;
    if(state.assets.length+state.pending.length>=40){q('#city-build-status').textContent='The classroom city has reached 40 assets. Remove one or reset the city to build again.';return;}
    const type=state.tool,capacity=Number(q('#city-build-size').value),version=state.version,geo=unproject(point.x,point.y),pending={...point};
    state.pending.push(pending);q('#city-build-status').textContent=`Constructing ${capacity} kW ${typeName(type).toLowerCase()} at ${geo.lat.toFixed(4)}° N, ${geo.lon.toFixed(4)}° E…`;renderMap();
    setTimeout(()=>{if(version!==state.version)return;state.pending=state.pending.filter(p=>p!==pending);const counter=type==='solar'?'solarCount':'factoryCount',prefix=type==='solar'?'PV':'FC',id=`${prefix}-${String(++state[counter]).padStart(2,'0')}`;
      state.assets.push({id,type,...geo,row:state[counter]%5,col:state[counter]%7,capacity,bias:1});state.selected=id;
      q('#city-build-status').textContent=`${id} built and reporting at its map location.`;activateTool('inspect');renderReadings();capture();renderMap();renderInspector();delayedReport(type==='solar'?id:undefined);
    },1100);
  }
  const mapPoint=event=>new DOMPoint(event.clientX,event.clientY).matrixTransform(map.getScreenCTM().inverse());
  let drag=null,skipClick=false;
  map.addEventListener('pointerdown',event=>{if(event.button!==0||event.target.closest('[data-asset]'))return;drag={x:event.clientX,y:event.clientY,cx:state.camera.cx,cy:state.camera.cy,moved:false};if(state.tool==='inspect')map.setPointerCapture(event.pointerId);});
  map.addEventListener('pointermove',event=>{
    if(drag&&Math.hypot(event.clientX-drag.x,event.clientY-drag.y)>6)drag.moved=true;
    if(drag&&state.tool==='inspect'){
      const dx=event.clientX-drag.x,dy=event.clientY-drag.y;if(Math.hypot(dx,dy)>4){drag.moved=true;const view=map.viewBox.baseVal;state.camera.cx=drag.cx-dx/(map.clientWidth/view.width);state.camera.cy=drag.cy-dy/(map.clientHeight/view.height);applyCamera();}
    }
    const preview=q('#geo-build-preview');if(['solar','factory'].includes(state.tool)&&preview){const point=mapPoint(event);preview.removeAttribute('hidden');preview.setAttribute('transform',`translate(${point.x} ${point.y})`);preview.classList.toggle('invalid',onWater(point));}
  });
  map.addEventListener('pointerup',event=>{skipClick=!!drag?.moved;drag=null;});
  map.addEventListener('pointercancel',()=>{drag=null;});
  map.addEventListener('pointerleave',()=>q('#geo-build-preview')?.setAttribute('hidden',''));
  map.addEventListener('click',event=>{if(skipClick){skipClick=false;return;}const asset=event.target.closest('[data-asset]');if(asset)inspectAsset(asset.dataset.asset);else buildAt(mapPoint(event));});
  map.addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)){const asset=event.target.closest('[data-asset]');if(asset){event.preventDefault();inspectAsset(asset.dataset.asset);}}});
  q('#build-map-center').addEventListener('click',()=>buildAt({x:state.camera.cx,y:state.camera.cy}));
  q('#city-zoom-in').addEventListener('click',()=>{state.camera.zoom=Math.min(4,state.camera.zoom*1.4);applyCamera();});
  q('#city-zoom-out').addEventListener('click',()=>{state.camera.zoom=Math.max(1,state.camera.zoom/1.4);applyCamera();});
  q('#city-map-fit').addEventListener('click',()=>{state.camera={cx:440,cy:325,zoom:1};applyCamera();});
  let wasNarrow=false;
  new ResizeObserver(()=>{const narrow=map.clientWidth<500;if(narrow&&!wasNarrow){const a=selectedAsset();if(a){const p=project(a.lon,a.lat);state.camera.cx=p.x;state.camera.cy=p.y;}}wasNarrow=narrow;applyCamera();}).observe(map);
  qa('[data-city-tool]').forEach(b=>b.addEventListener('click',()=>activateTool(b.dataset.cityTool)));
  q('#city-build-size').addEventListener('input',()=>{q('#city-build-output').textContent=`${q('#city-build-size').value} kW`;if(state.buildSizes[state.tool]!==undefined)state.buildSizes[state.tool]=Number(q('#city-build-size').value);paint();});
  q('#city-play').addEventListener('click',()=>{state.running=!state.running;renderReadings();});
  q('#city-speed').addEventListener('change',event=>{state.speed=Number(event.target.value);});
  q('#city-hour').addEventListener('input',event=>{state.hour=Number(event.target.value);renderReadings();seedHistory();renderHistory();appendReports();});
  q('#city-cloud').addEventListener('input',event=>{state.cloud=Number(event.target.value);renderReadings();capture();});
  q('#city-device-select').addEventListener('change',event=>{state.selected=event.target.value;const asset=selectedAsset(),point=project(asset.lon,asset.lat);state.camera.cx=point.x;state.camera.cy=point.y;renderInspector();renderMap();});
  q('#city-device').addEventListener('input',event=>{if(event.target.id==='report-bias'){state.draftBias=Number(event.target.value);q('#report-bias-output').textContent=`${state.draftBias.toFixed(1)}×`;paint();}});
  q('#city-device').addEventListener('click',event=>{
    const action=event.target.closest('button')?.id,a=selectedAsset();if(!a||a.type!=='solar')return;
    if(!['submit-city-report','inflate-city-report','restore-city-report'].includes(action))return;
    if(action==='inflate-city-report')state.draftBias=1.8;
    if(action==='restore-city-report')state.draftBias=1;
    a.bias=state.draftBias;q('#report-bias').value=state.draftBias;q('#report-bias-output').textContent=`${state.draftBias.toFixed(1)}×`;
    delayedReport(a.id);capture();
  });
  q('#city-reset').addEventListener('click',()=>{
    state.version++;state.assets=baseline();state.hour=10;state.cloud=15;state.selected='PV-01';state.solarCount=3;state.factoryCount=2;state.pending=[];state.buildSizes={solar:24,factory:36};state.records=[];state.busy=false;state.speed=1;q('#city-speed').value='1';q('#city-cloud').value=15;activateTool('inspect');renderReadings();seedHistory();renderHistory();renderMap();renderInspector();appendReports();q('#city-build-status').textContent='Map reset to three solar arrays and two factories.';state.camera={cx:440,cy:325,zoom:1};applyCamera();
  });
  new IntersectionObserver(entries=>{state.visible=entries[0].isIntersecting;renderMapState();},{threshold:.06}).observe(lab);
  setInterval(()=>{if(!state.running||!state.visible||document.hidden)return;state.hour=(state.hour+.25*state.speed)%24;delayedReport();capture();},2000);
  renderFinance();renderMap();renderReadings();renderInspector();seedHistory();renderHistory();appendReports();activateTool('inspect');
})();
