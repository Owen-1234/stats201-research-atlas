(function(){
  'use strict';
  const E=window.SolarEvalEvidence,M=window.SolarEvalMath,q=s=>document.querySelector(s),qa=s=>[...document.querySelectorAll(s)];
  const policies=['static','random','myopic','ppo','sac','dqn'],learned=['ppo','sac','dqn'];
  const names={static:'Static',random:'Random',myopic:'Myopic',ppo:'PPO',sac:'SAC',dqn:'DQN'};
  const colors={static:'#93a5a2',random:'#b6ad94',myopic:'#8a8e96',ppo:'#426c8c',sac:'#528c7d',dqn:'#b18e53'};
  const defs={reward:{label:'Cumulative reward',unit:'',scale:1,digits:2,direction:'↑'},violation:{label:'Physics violation rate',unit:'%',scale:100,digits:2,direction:'↓'},liquidity:{label:'Artificial liquidity',unit:'MWh',scale:1,digits:4,direction:'↓'},slippage:{label:'Mean slippage',unit:'%',scale:100,digits:2,direction:'↓'},volume:{label:'Trading volume',unit:'MWh',scale:1,digits:3,direction:'↑'},jitter:{label:'Action jitter',unit:'',scale:1,digits:4,direction:'↓'}};
  const state={policy:'ppo',learned:'ppo',view:'landscape',x:'violation',dist:'reward',showRuns:true,showSD:false,baselines:true,run:null,experiment:'physics',effectView:'columns',metric:'liquidity',physics:true,llm:false,step:15,playing:false};
  const groups=new Map();E.records.forEach((r,i)=>{r.index=i;const key=`${r.setting}:${r.policy}`;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(r);});
  const group=(setting,policy)=>groups.get(`${setting}:${policy}`)||[];
  const stats=(setting,policy,key)=>M.summarize(group(setting,policy),key);
  const f=(v,key,digits=defs[key].digits)=>(v*defs[key].scale).toFixed(digits);
  const unit=key=>defs[key].unit;
  const signed=(v,key)=>`${v>=0?'+':'−'}${f(Math.abs(v),key)}${['violation','slippage'].includes(key)?' pp':unit(key)?` ${unit(key)}`:''}`;
  const axisLabel=key=>`${defs[key].label}${unit(key)?` (${unit(key)})`:''} ${defs[key].direction}`;
  const text=(x,y,value,attrs='')=>`<text x="${x}" y="${y}" ${attrs}>${value}</text>`;
  function size(selector,desktop,mobile){
    const svg=q(selector),w=Math.max(280,svg.clientWidth||650);
    let h=w<500?mobile:desktop;
    if(selector==='#eval-main-chart'&&q('#eval-landscape').clientWidth>800){
      const plot=svg.parentElement,style=getComputedStyle(plot);
      const chrome=[...plot.children].filter(el=>el!==svg).reduce((sum,el)=>{const cs=getComputedStyle(el);return sum+el.getBoundingClientRect().height+parseFloat(cs.marginTop)+parseFloat(cs.marginBottom);},0)+parseFloat(style.paddingTop)+parseFloat(style.paddingBottom);
      h=Math.max(360,Math.round(q('.eval-policy-profile').getBoundingClientRect().height-chrome));
    }
    svg.setAttribute('viewBox','0 0 '+w+' '+h);svg.style.height=h+'px';return {svg,w,h};
  }
  function domain(values,pad=.12){let lo=Math.min(...values),hi=Math.max(...values);if(hi-lo<1e-9){lo-=.1;hi+=.1;}const p=(hi-lo)*pad;return [lo-p,hi+p];}
  function tickValue(v,key){if(key==='liquidity')return (v*defs[key].scale).toFixed(2);if(key==='jitter')return v.toFixed(3);return (v*defs[key].scale).toFixed(key==='reward'?1:1);}
  function mainPolicies(){return policies.filter(p=>state.baselines||learned.includes(p));}
  function renderMain(){
    renderProfile();
    const shown=mainPolicies(),key=state.view==='landscape'?state.x:state.dist,{svg,w,h}=size('#eval-main-chart',410,335),L=w<500?44:56,R=w-22,T=38,B=h-45;
    q('#eval-x-control').hidden=state.view!=='landscape';q('#eval-dist-control').hidden=state.view!=='distribution';q('#eval-sd-control').hidden=state.view!=='landscape';
    qa('[data-eval-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.evalView===state.view)));
    q('#eval-x-metric').value=state.x;q('#eval-dist-metric').value=state.dist;
    q('#eval-policy-legend').innerHTML=shown.map(p=>`<button data-eval-policy="${p}" aria-pressed="${p===state.policy}" style="--policy-color:${colors[p]}"><i></i>${names[p]}${!learned.includes(p)?'<small>rule</small>':''}</button>`).join('');
    const records=E.records.filter(r=>r.setting==='main'&&shown.includes(r.policy));
    let content='';
    if(state.view==='landscape'){
      const xValues=records.map(r=>r[key]),yValues=records.map(r=>r.reward);
      if(state.showSD)shown.forEach(p=>{const xs=stats('main',p,key),ys=stats('main',p,'reward');xValues.push(xs.mean-xs.sd,xs.mean+xs.sd);yValues.push(ys.mean-ys.sd,ys.mean+ys.sd);});
      const [xmin,xmax]=domain(xValues),[ymin,ymax]=domain(yValues),x=v=>L+(v-xmin)/(xmax-xmin)*(R-L),y=v=>B-(v-ymin)/(ymax-ymin)*(B-T);
      const grid=Array.from({length:5},(_,i)=>{const a=xmin+i*(xmax-xmin)/4,b=ymin+i*(ymax-ymin)/4;return `<line x1="${x(a)}" x2="${x(a)}" y1="${T}" y2="${B}" class="eval-grid"/><line x1="${L}" x2="${R}" y1="${y(b)}" y2="${y(b)}" class="eval-grid"/>${text(x(a),B+19,tickValue(a,key),'text-anchor="middle" class="eval-axis"')}${text(L-10,y(b)+4,b.toFixed(1),'text-anchor="end" class="eval-axis"')}`;}).join('');
      const dots=state.showRuns?records.map(r=>`<circle cx="${x(r[key])}" cy="${y(r.reward)}" r="${r.index===state.run?5:r.policy===state.policy?2.8:2}" fill="${colors[r.policy]}" opacity="${r.index===state.run?1:r.policy===state.policy?.63:.18}" ${r.index===state.run?'stroke="#203c50" stroke-width="1.5"':''} data-eval-run="${r.index}" class="eval-run-dot"><title>${names[r.policy]} · run ${r.run} · episode ${r.episode}: reward ${f(r.reward,'reward')}, ${defs[key].label} ${f(r[key],key)} ${unit(key)}</title></circle>`).join(''):'';
      const ppoOnRight=stats('main','ppo',key).mean>=stats('main','sac',key).mean;
      const offsets={static:[10,19],random:[9,-12],myopic:[10,-11],ppo:[ppoOnRight?13:-13,-15],sac:[ppoOnRight?-13:13,-15],dqn:[-14,23]};
      const means=shown.map(p=>{const xs=stats('main',p,key),ys=stats('main',p,'reward'),xx=x(xs.mean),yy=y(ys.mean),selected=p===state.policy,[dx,dy]=offsets[p];return `<g data-eval-policy="${p}" role="button" tabindex="0" aria-label="Select ${names[p]}. Mean reward ${f(ys.mean,'reward')}, ${defs[key].label} ${f(xs.mean,key)} ${unit(key)}" class="eval-mean ${selected?'selected':''}">${state.showSD?`<path d="M${x(xs.mean-xs.sd)} ${yy}H${x(xs.mean+xs.sd)}M${xx} ${y(ys.mean-ys.sd)}V${y(ys.mean+ys.sd)}" stroke="${colors[p]}" stroke-width="1.4" opacity=".65"/>`:''}<circle cx="${xx}" cy="${yy}" r="${selected?14:11}" fill="${colors[p]}" opacity=".14"/><circle cx="${xx}" cy="${yy}" r="${selected?7:5.5}" fill="${colors[p]}" stroke="#fcfcf7" stroke-width="2"/>${text(xx+dx,yy+dy,names[p],`class="eval-mean-label" text-anchor="${dx<0?'end':'start'}" fill="${colors[p]}"`)}</g>`;}).join('');
      content=`<title>Recorded policy reward versus ${defs[key].label}</title>${grid}${text(L,16,'Cumulative reward ↑','class="eval-axis-title"')}${text((L+R)/2,h-4,axisLabel(key),'class="eval-axis-title" text-anchor="middle"')}${dots}${means}`;
      q('#eval-main-caption').textContent=`Reward and ${defs[key].label.toLowerCase()}`;
      q('#eval-chart-note').textContent='Small dots are recorded episodes; large rings are policy means. Optional whiskers show ±1 standard deviation across episodes.';
    }else{
      const values=records.map(r=>r[key]),[lo,hi]=domain(values,.10),y=v=>B-(v-lo)/(hi-lo)*(B-T),step=(R-L)/shown.length,x=i=>L+step*(i+.5),bw=Math.min(44,step*.43);
      const grid=Array.from({length:5},(_,i)=>{const v=lo+i*(hi-lo)/4;return `<line x1="${L}" x2="${R}" y1="${y(v)}" y2="${y(v)}" class="eval-grid"/>${text(L-10,y(v)+4,tickValue(v,key),'class="eval-axis" text-anchor="end"')}`;}).join('');
      const boxes=shown.map((p,i)=>{const rows=group('main',p),box=M.box(rows.map(r=>r[key])),xx=x(i),selected=state.policy===p;
        const dots=state.showRuns?rows.map((r,j)=>{const jitter=((j*37%89)/89-.5)*Math.min(step*.7,58);return `<circle cx="${xx+jitter}" cy="${y(r[key])}" r="${r.index===state.run?4.5:2}" fill="${colors[p]}" opacity="${selected?.62:.26}" data-eval-run="${r.index}" class="eval-run-dot"><title>${names[p]} · ${r.run} · episode ${r.episode}: ${f(r[key],key)} ${unit(key)}</title></circle>`;}).join(''):'';
        return `${dots}<g data-eval-policy="${p}" role="button" tabindex="0" aria-label="Select ${names[p]}; median ${f(box.median,key)} ${unit(key)}" class="eval-box"><path d="M${xx} ${y(box.low)}V${y(box.high)}M${xx-bw*.35} ${y(box.low)}h${bw*.7}M${xx-bw*.35} ${y(box.high)}h${bw*.7}" stroke="${colors[p]}" stroke-width="1.6"/><rect x="${xx-bw/2}" y="${y(box.q3)}" width="${bw}" height="${Math.max(2,y(box.q1)-y(box.q3))}" rx="3" fill="${colors[p]}" fill-opacity="${selected?.34:.18}" stroke="${colors[p]}" stroke-width="${selected?2.2:1.4}"/><line x1="${xx-bw/2}" x2="${xx+bw/2}" y1="${y(box.median)}" y2="${y(box.median)}" stroke="${colors[p]}" stroke-width="2.6"/>${text(xx,B+21,names[p],'text-anchor="middle" class="eval-axis"')}</g>`;
      }).join('');
      content=`<title>Recorded ${defs[key].label} distributions for the six benchmark policies</title>${grid}${text(L,16,axisLabel(key),'class="eval-axis-title"')}${boxes}`;
      q('#eval-main-caption').textContent=`${defs[key].label} across evaluated episodes`;
      q('#eval-chart-note').textContent='Boxes show the median and middle 50% of recorded values. Whiskers reach the last values within 1.5 IQR; dots retain all observed episodes.';
    }
    svg.innerHTML=content;renderRunReadout(state.run);
    qa('[data-result-policy]').forEach(row=>row.classList.toggle('selected-result',row.dataset.resultPolicy.toLowerCase()===state.policy));
  }
  function renderProfile(){
    const p=state.policy;q('#eval-profile-title').textContent=names[p];q('#eval-profile-title').style.color=colors[p];
    q('#eval-profile-description').textContent={static:'Fixed market parameters throughout the episode.',random:'Actions sampled from the benchmark action space.',myopic:'A rule responding to current market conditions.',ppo:'A learned policy choosing continuous market parameters.',sac:'A learned actor-critic policy with continuous actions.',dqn:'A learned value-based policy over 125 discrete actions.'}[p];
    q('#eval-profile-metrics').innerHTML=['reward','violation','liquidity','slippage','volume'].map(key=>{const s=stats('main',p,key);return `<button data-eval-profile-metric="${key}" title="See the ${defs[key].label.toLowerCase()} distribution"><span>${defs[key].label} ${defs[key].direction}</span><strong>${f(s.mean,key)}<small>${unit(key)}</small></strong><small>± ${f(s.sd,key)} SD</small><b aria-hidden="true">↗</b></button>`;}).join('');
    q('#eval-profile-reading').textContent={static:'This fixed rule supplies a stable reference for the learned policies.',random:'Random actions have the lowest mean reward in this comparison.',myopic:'The myopic rule offers a useful comparison with policies that learn across time.',ppo:'PPO has lower mean slippage than SAC, alongside more artificial liquidity.',sac:'SAC has the highest mean reward here and the lowest mean artificial liquidity; its mean slippage is higher.',dqn:'The discrete action grid produces a different balance of reward, physical risk, and market friction.'}[p];
    q('#eval-run-select').innerHTML='<option value="">Policy summary · 90 rollouts</option>'+group('main',p).map(r=>`<option value="${r.index}" ${r.index===state.run?'selected':''}>Seed ${String(r.run).slice(-2)} · episode ${String(r.episode).padStart(2,'0')}</option>`).join('');
  }
  function renderRunReadout(index){
    const r=index===null?null:E.records[index];q('#eval-run-readout').textContent=r?`${names[r.policy]} · training seed ${r.run} · episode ${r.episode} | reward ${f(r.reward,'reward')} · violation ${f(r.violation,'violation')}% · artificial liquidity ${f(r.liquidity,'liquidity')} MWh`:'Select a small dot or choose a rollout to inspect its recorded outcomes.';
    q('#eval-clear-run').hidden=state.run===null;
  }
  function selectPolicy(p,run=null){if(!learned.includes(p)){state.baselines=true;q('#eval-baselines').checked=true;}state.policy=p;if(learned.includes(p))state.learned=p;state.run=run;renderMain();renderExperiments();}
  function settingsForEffect(){return state.experiment==='physics'?(state.llm?['llm','llmNoPhysics']:['main','noPhysics']):(state.physics?['main','llm']:['noPhysics','llmNoPhysics']);}
  function renderEffectColumns(data,key){
    const maximum=Math.max(...data.flatMap(d=>[d.before,d.after]));
    const power=Math.pow(10,Math.floor(Math.log10(maximum||1)));
    const ceiling=Math.ceil(maximum*1.15/power*2)/2*power||1;
    const label=v=>Number((v*defs[key].scale).toPrecision(3)).toString();
    const focused=document.activeElement?.closest('#eval-effect-columns [data-eval-learned]')?.dataset.evalLearned;
    const beforeLabel=state.experiment==='physics'?'With penalty':'RL only';
    const afterLabel=state.experiment==='physics'?'Without penalty':'RL + LLM';
    q('#eval-effect-columns').innerHTML=`<div class="effect-axis">${Array.from({length:5},(_,i)=>`<span style="bottom:${i*25}%">${label(ceiling*i/4)}</span>`).join('')}</div><div class="effect-columns-grid">${data.map(d=>`<button type="button" data-eval-learned="${d.policy}" class="effect-column-card" aria-pressed="${d.policy===state.learned}" aria-label="${names[d.policy]}: ${beforeLabel} ${f(d.before,key)}, ${afterLabel} ${f(d.after,key)} ${unit(key)}, paired change ${signed(d.delta,key)}"><span class="effect-bar-scene"><i class="effect-bar ${d.before===0?'is-zero':''}" style="--bar-height:${d.before/ceiling*100}%"><span>${f(d.before,key)}</span></i><i class="effect-bar effect-bar-after ${d.after===0?'is-zero':''}" style="--bar-height:${d.after/ceiling*100}%"><span>${f(d.after,key)}</span></i></span><span class="effect-column-policy">${names[d.policy]}</span><span class="effect-column-delta">Δ ${signed(d.delta,key)}</span></button>`).join('')}</div><p class="effect-columns-caption"><span>CONDITION MEANS · ${unit(key)||defs[key].label}</span><span>ZERO BASELINE · 90 MATCHED PAIRS</span></p>`;
    if(focused)q(`#eval-effect-columns [data-eval-learned="${focused}"]`)?.focus({preventScroll:true});
  }
  function renderExperiments(){
    const key=state.metric,[before,after]=settingsForEffect(),selected=state.learned;
    const data=learned.map(p=>{const pairs=M.paired(group(before,p),group(after,p),key);return {policy:p,before:stats(before,p,key).mean,after:stats(after,p,key).mean,delta:M.mean(pairs.map(r=>r.delta)),sd:M.summarize(pairs,'delta').sd,pairs};});
    q('#eval-effect-columns').toggleAttribute('hidden',state.effectView!=='columns');q('#eval-effect-chart').toggleAttribute('hidden',state.effectView==='columns');
    qa('[data-eval-effect-view]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.evalEffectView===state.effectView)));
    const {svg,w,h}=size('#eval-effect-chart',300,330),narrow=w<500;
    qa('[data-eval-experiment]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.evalExperiment===state.experiment)));
    qa('[data-eval-learned]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.evalLearned===selected));b.style.setProperty('--policy-color',colors[b.dataset.evalLearned]);});
    q('#eval-effect-metric').value=key;q('#eval-context').checked=state.experiment==='physics'?state.llm:state.physics;
    q('#eval-context-label').textContent=state.experiment==='physics'?'With LLM governance':'Physics penalty included';
    q('#eval-effect-title').textContent=state.experiment==='physics'?'Without − with the physics penalty':'RL + LLM − the same RL policy';
    q('#eval-effect-legend').innerHTML=`<b>${axisLabel(key)}</b>`+(state.effectView==='delta'?'Mean paired change · whiskers ±1 paired SD':state.experiment==='physics'?'<i class="effect-before-key"></i> With penalty <i class="effect-after-key"></i> Without penalty':'<i class="effect-before-key"></i> RL only <i class="effect-after-key"></i> RL + LLM');
    q('#eval-effect-scale-note').textContent=state.effectView==='columns'?'Column height encodes the original mean on a shared zero baseline. Exact values and paired changes are shown.':state.effectView==='paired'?'The horizontal axis focuses on these condition means. Read the labeled values; the axis need not begin at zero.':'Change = after minus before. Whiskers show ±1 standard deviation of matched episode changes, not a confidence interval.';
    let content='';
    if(state.effectView==='columns'){
      renderEffectColumns(data,key);
    }else if(state.effectView==='paired'){
      const [lo,hi]=domain(data.flatMap(d=>[d.before,d.after]),.15),L=narrow?28:62,R=w-(narrow?24:94),x=v=>L+(v-lo)/(hi-lo)*(R-L);
      const grid=Array.from({length:4},(_,i)=>{const v=lo+i*(hi-lo)/3;return `<line x1="${x(v)}" x2="${x(v)}" y1="30" y2="${h-42}" class="eval-grid"/>${text(x(v),h-16,tickValue(v,key),'text-anchor="middle" class="eval-axis"')}`;}).join('');
      const rows=data.map((d,i)=>{const y=narrow?66+i*86:65+i*70,a=x(d.before),b=x(d.after),active=d.policy===selected;return `<g data-eval-learned="${d.policy}" role="button" tabindex="0" aria-label="${names[d.policy]}: ${f(d.before,key)} to ${f(d.after,key)} ${unit(key)}; change ${signed(d.delta,key)}" class="eval-paired-row ${active?'selected':''}">${active?`<rect x="0" y="${y-(narrow?34:28)}" width="${w}" height="${narrow?77:63}" rx="5" fill="#eff2e9"/>`:''}${text(narrow?L:8,narrow?y-26:y+4,names[d.policy],'class="eval-policy-name"')}${text(narrow?R:w-4,narrow?y-26:y+4,signed(d.delta,key),'class="eval-delta-value" text-anchor="end"')}<line x1="${a}" x2="${b}" y1="${y}" y2="${y}" stroke="#a0b2a8" stroke-width="2"/><circle cx="${a}" cy="${y}" r="6" fill="#5d9282" stroke="#fffdf6" stroke-width="2"/><circle cx="${b}" cy="${y}" r="6" fill="#b3955e" stroke="#fffdf6" stroke-width="2"/>${text(a,y-13,f(d.before,key),'text-anchor="middle" class="eval-small-number"')}${text(b,y+22,f(d.after,key),'text-anchor="middle" class="eval-small-number"')}</g>`;}).join('');
      content=`<title>Matched condition means of ${defs[key].label} for PPO, SAC, and DQN</title>${grid}${rows}`;
    }else{
      const span=Math.max(...data.map(d=>Math.abs(d.delta)+d.sd))*1.2||.01,L=narrow?28:62,R=w-(narrow?24:94),x=v=>L+(v+span)/(2*span)*(R-L);
      const grid=[-1,-.5,0,.5,1].map(t=>`<line x1="${x(t*span)}" x2="${x(t*span)}" y1="30" y2="${h-42}" class="${t===0?'eval-zero':'eval-grid'}"/>${text(x(t*span),h-16,tickValue(t*span,key),'text-anchor="middle" class="eval-axis"')}`).join('');
      const rows=data.map((d,i)=>{const y=narrow?66+i*86:65+i*70,a=x(0),b=x(d.delta),active=d.policy===selected,color=d.delta<0?'#619483':'#b3955e';return `<g data-eval-learned="${d.policy}" role="button" tabindex="0" aria-label="${names[d.policy]}: paired change ${signed(d.delta,key)}, standard deviation ${f(d.sd,key)}" class="eval-paired-row ${active?'selected':''}">${active?`<rect x="0" y="${y-(narrow?34:28)}" width="${w}" height="${narrow?77:63}" rx="5" fill="#eff2e9"/>`:''}${text(narrow?L:8,narrow?y-26:y+4,names[d.policy],'class="eval-policy-name"')}${text(narrow?R:w-4,narrow?y-26:y+4,signed(d.delta,key),'class="eval-delta-value" text-anchor="end"')}<rect x="${Math.min(a,b)}" y="${y-10}" width="${Math.max(1,Math.abs(b-a))}" height="20" fill="${color}" rx="3"/><path d="M${x(d.delta-d.sd)} ${y}H${x(d.delta+d.sd)}M${x(d.delta-d.sd)} ${y-4}v8M${x(d.delta+d.sd)} ${y-4}v8" fill="none" stroke="#3c5a67" stroke-width="1.1"/><circle cx="${b}" cy="${y}" r="3.5" fill="#33566a"/></g>`;}).join('');
      content=`<title>Mean paired changes in ${defs[key].label}, with one paired standard deviation</title>${grid}${rows}`;
    }
    svg.innerHTML=content;
    const d=data.find(d=>d.policy===selected),hist=M.histogram(d.pairs.map(r=>r.delta)),histSize=size('#eval-delta-histogram',140,145),hw=histSize.w,hh=histSize.h,L=30,R=hw-20,B=hh-30,maxCount=Math.max(...hist.bins.map(b=>b.n)),x=v=>L+(v-hist.min)/(hist.max-hist.min)*(R-L),y=n=>B-n/maxCount*(B-20);
    const histTicks=[hist.min,...(x(0)-L>40&&R-x(0)>40?[0]:[]),hist.max];
    histSize.svg.innerHTML=`<title>${names[selected]} distribution of 90 matched episode changes</title><line x1="${L}" x2="${R}" y1="${B}" y2="${B}" class="eval-grid"/>${hist.bins.map(bin=>`<rect x="${x(bin.x)+.7}" y="${y(bin.n)}" width="${Math.max(1,x(bin.upper)-x(bin.x)-1.4)}" height="${B-y(bin.n)}" rx="1" fill="${(bin.x+bin.upper)/2<0?'#86aa9b':'#c0ac7f'}"><title>${bin.n} matched episodes; ${f(bin.x,key)} to ${f(bin.upper,key)}</title></rect>`).join('')}<line x1="${x(0)}" x2="${x(0)}" y1="12" y2="${B}" class="eval-zero"/><line x1="${x(d.delta)}" x2="${x(d.delta)}" y1="12" y2="${B}" stroke="#355c73" stroke-width="1.5" stroke-dasharray="3 3"/>${histTicks.map(v=>text(x(v),B+18,tickValue(v,key),'class="eval-axis" text-anchor="middle"')).join('')}${text(R,12,'episodes','text-anchor="end" class="eval-axis"')}${text(L-7,24,maxCount,'text-anchor="end" class="eval-axis"')}${text(L-7,B+3,'0','text-anchor="end" class="eval-axis"')}`;
    q('#eval-paired-label').textContent=`${names[selected]} · all 90 paired changes`;q('#eval-paired-value').textContent=`Mean ${signed(d.delta,key)}`;
    q('#eval-paired-note').textContent=`Each bar counts matched episodes. The dashed line marks the mean paired change; paired SD is ${f(d.sd,key)}${['violation','slippage'].includes(key)?' percentage points':unit(key)?` ${unit(key)}`:''}.`;
    const conditions=[['main','With penalty','RL'],['llm','With penalty','RL + LLM'],['noPhysics','Removed','RL'],['llmNoPhysics','Removed','RL + LLM']],values=conditions.map(([setting])=>stats(setting,selected,key).mean),min=Math.min(...values),max=Math.max(...values);
    const setting=state.physics?(state.llm?'llm':'main'):(state.llm?'llmNoPhysics':'noPhysics');
    q('#eval-condition-matrix').innerHTML='<span class="condition-corner">Physics</span><span>RL</span><span>RL + LLM</span>'+[0,1].map(row=>`<span class="condition-row-label">${row===0?'With penalty':'Removed'}</span>${conditions.slice(row*2,row*2+2).map(([condition],j)=>{const v=values[row*2+j],t=max===min?0:(v-min)/(max-min);return `<button data-eval-condition="${condition}" aria-pressed="${condition===setting}" style="background:hsl(207 18% ${96-t*47}%);color:${t>.72?'#fff':'#315064'}" aria-label="${condition}: ${f(v,key)} ${unit(key)}"><strong>${f(v,key)}</strong><small>${unit(key)||defs[key].label}</small></button>`;}).join('')}`).join('');
    const chosen=stats(setting,selected,key);
    q('#eval-condition-reading').innerHTML=`<span>${names[selected]} / ${state.physics?'PHYSICS PENALTY':'PENALTY REMOVED'} / ${state.llm?'RL + LLM':'RL'}</span><strong>${f(chosen.mean,key)}<small>${unit(key)}</small></strong><p>Mean ${defs[key].label.toLowerCase()} · ± ${f(chosen.sd,key)} SD</p>`;
    q('#eval-effect-summary').textContent=state.experiment==='physics'?`${names[selected]}: removing the physics term changes mean ${defs[key].label.toLowerCase()} by ${signed(d.delta,key)}.`:`${names[selected]}: the observed oversight effect on ${defs[key].label.toLowerCase()} is ${signed(d.delta,key)}.`;
  }
  let replayTimer=null;
  function pauseReplay(){if(replayTimer)clearInterval(replayTimer);replayTimer=null;state.playing=false;q('#eval-trace-play').setAttribute('aria-pressed','false');q('#eval-trace-play').textContent='▷ Replay 24 hours';}
  function renderTrace(){
    const trace=E.trace[state.step],a=trace.proposed,b=trace.executed,bounds=trace.bounds,pct=v=>(v*100).toFixed(1),esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;');
    q('#eval-timeline').innerHTML=E.trace.map(t=>'<button data-eval-step="'+t.step+'" class="'+(t.audited?'audited':'planner-only')+'" aria-pressed="'+(t.step===state.step)+'" aria-label="Hour '+t.hour+', '+(t.audited?'audit called':'Planner only')+', action change '+t.delta.toFixed(3)+'"><i style="height:'+(7+Math.min(t.delta,1.5)/1.5*32)+'px"></i><span>'+String(t.hour).padStart(2,'0')+'</span></button>').join('');
    q('#eval-trace-hour').textContent=String(trace.hour).padStart(2,'0')+':00';
    const decision=trace.audited?(trace.decision==='revise'?'Auditor revised the action':'Auditor approved the action'):'Planner bounds applied';
    q('#eval-audit-status').innerHTML='<span class="'+(trace.audited?'called':'not-called')+'"><i></i>'+(trace.audited?'AUDIT CALLED':'PLANNER ONLY')+'</span><strong>'+decision+'</strong><p>PPO · seed 20260512 · episode 6 · hour '+trace.hour+'</p>';
    const allocation=(action,which)=>{
      const reserved=Math.max(0,1-action.reward_ratio-action.liquidity_ratio);
      return '<div class="audit-allocation-bar" role="img" aria-label="'+which+': producer '+pct(action.reward_ratio)+' percent, liquidity '+pct(action.liquidity_ratio)+' percent, unallocated '+pct(reserved)+' percent"><i style="width:'+pct(action.reward_ratio)+'%" class="allocation-producer"></i><i style="width:'+pct(action.liquidity_ratio)+'%" class="allocation-liquidity"></i><i style="width:'+pct(reserved)+'%" class="allocation-reserved"></i></div><div class="audit-allocation-values"><span>Producer <b>'+pct(action.reward_ratio)+'%</b></span><span>Liquidity <b>'+pct(action.liquidity_ratio)+'%</b></span><span>Unallocated <b>'+pct(reserved)+'%</b></span></div>';
    };
    q('#eval-action-flow').innerHTML='<section class="audit-snapshot audit-proposed"><span>01 / POLICY PROPOSES</span><h5>A frozen PPO policy</h5>'+allocation(a,'Proposed allocation')+'<small>Burn rate: '+pct(a.burn_rate)+'%</small></section><section class="audit-governance"><span>02 / GOVERNANCE CHECK</span><h5>Planner intervals</h5><div>'+[['reward_ratio','α'],['liquidity_ratio','ℓ'],['burn_rate','b']].map(([k,l])=>'<span>'+l+' <b>'+pct(bounds[k][0])+'–'+pct(bounds[k][1])+'%</b></span>').join('')+'</div><p>'+(trace.audited?'Auditor called · '+esc(trace.decision):'No Auditor call at this hour')+'</p></section><section class="audit-snapshot audit-executed"><span>03 / ENVIRONMENT EXECUTES</span><h5>The final recorded action</h5>'+allocation(b,'Executed allocation')+'<small>Burn rate: '+pct(b.burn_rate)+'%</small></section>';
    q('#eval-action-comparison').innerHTML=[['reward_ratio','Reward share','α'],['liquidity_ratio','Liquidity share','ℓ'],['burn_rate','Burn rate','b']].map(([key,label,symbol])=>{
      const delta=b[key]-a[key],interval=bounds[key];
      return '<section class="audit-action-card"><header><span>'+label+'</span><i>'+symbol+'</i></header><div class="audit-paired-values"><span>'+pct(a[key])+'<small>%</small></span><i>→</i><strong>'+pct(b[key])+'<small>%</small></strong></div><div class="audit-bar-label"><span>Proposed</span><b>'+a[key].toFixed(3)+'</b></div><div class="audit-horizontal-bar"><i style="left:'+pct(interval[0])+'%;width:'+pct(interval[1]-interval[0])+'%" class="audit-interval"></i><b style="width:'+pct(a[key])+'%" class="audit-proposal-fill"></b></div><div class="audit-bar-label"><span>Executed</span><b>'+b[key].toFixed(3)+'</b></div><div class="audit-horizontal-bar"><i style="left:'+pct(interval[0])+'%;width:'+pct(interval[1]-interval[0])+'%" class="audit-interval"></i><b style="width:'+pct(b[key])+'%" class="audit-executed-fill"></b></div><div class="audit-bar-scale"><span>0</span><span>1</span></div><footer>'+(delta>=0?'+':'−')+pct(Math.abs(delta))+' <span>percentage points</span></footer></section>';
    }).join('');
    q('#eval-raw-risk').textContent=(trace.rawRisk*100).toFixed(0)+'%';q('#eval-risk-trigger').textContent=(trace.riskTrigger*100).toFixed(0)+'%';q('#eval-action-delta').textContent=trace.delta.toFixed(3);q('#eval-recorded-reason').textContent=trace.reason;
  }
  function handleSelection(event){const run=event.target.closest('[data-eval-run]'),policy=event.target.closest('[data-eval-policy]'),experimentPolicy=event.target.closest('[data-eval-learned]');if(run){const i=Number(run.dataset.evalRun);selectPolicy(E.records[i].policy,i);}else if(policy)selectPolicy(policy.dataset.evalPolicy);else if(experimentPolicy)selectPolicy(experimentPolicy.dataset.evalLearned);}
  document.addEventListener('click',handleSelection);
  q('#eval-main-chart').addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)&&event.target.closest('[data-eval-policy]')){event.preventDefault();handleSelection(event);}});
  q('#eval-effect-chart').addEventListener('keydown',event=>{if(['Enter',' '].includes(event.key)&&event.target.closest('[data-eval-learned]')){event.preventDefault();handleSelection(event);}});
  q('#eval-main-chart').addEventListener('pointerover',event=>{const dot=event.target.closest('[data-eval-run]');if(dot)renderRunReadout(Number(dot.dataset.evalRun));});
  q('#eval-main-chart').addEventListener('pointerleave',()=>renderRunReadout(state.run));
  qa('[data-eval-view]').forEach(b=>b.addEventListener('click',()=>{state.view=b.dataset.evalView;renderMain();}));
  q('#eval-x-metric').addEventListener('change',event=>{state.x=event.target.value;renderMain();});q('#eval-dist-metric').addEventListener('change',event=>{state.dist=event.target.value;renderMain();});
  q('#eval-show-runs').addEventListener('change',event=>{state.showRuns=event.target.checked;renderMain();});q('#eval-show-sd').addEventListener('change',event=>{state.showSD=event.target.checked;renderMain();});q('#eval-baselines').addEventListener('change',event=>{state.baselines=event.target.checked;if(!state.baselines&&!learned.includes(state.policy)){state.policy=state.learned;state.run=null;}renderMain();});
  q('#eval-profile-metrics').addEventListener('click',event=>{const b=event.target.closest('[data-eval-profile-metric]');if(b){state.dist=b.dataset.evalProfileMetric;state.view='distribution';renderMain();}});
  q('#eval-run-select').addEventListener('change',event=>{state.run=event.target.value===''?null:Number(event.target.value);renderMain();});q('#eval-clear-run').addEventListener('click',()=>{state.run=null;renderMain();});
  qa('[data-eval-experiment]').forEach(b=>b.addEventListener('click',()=>{state.experiment=b.dataset.evalExperiment;state.metric=state.experiment==='governance'?'jitter':'liquidity';renderExperiments();}));
  qa('[data-eval-effect-view]').forEach(b=>b.addEventListener('click',()=>{state.effectView=b.dataset.evalEffectView;renderExperiments();}));
  q('#eval-effect-metric').addEventListener('change',event=>{state.metric=event.target.value;renderExperiments();});q('#eval-context').addEventListener('change',event=>{if(state.experiment==='physics')state.llm=event.target.checked;else state.physics=event.target.checked;renderExperiments();});
  q('#eval-condition-matrix').addEventListener('click',event=>{const b=event.target.closest('[data-eval-condition]');if(!b)return;state.physics=['main','llm'].includes(b.dataset.evalCondition);state.llm=['llm','llmNoPhysics'].includes(b.dataset.evalCondition);renderExperiments();});
  q('#eval-timeline').addEventListener('click',event=>{const b=event.target.closest('[data-eval-step]');if(b){pauseReplay();state.step=Number(b.dataset.evalStep);renderTrace();q(`#eval-timeline [data-eval-step="${state.step}"]`).focus({preventScroll:true});}});
  q('#eval-trace-play').addEventListener('click',()=>{if(state.playing){pauseReplay();return;}state.playing=true;state.step=0;renderTrace();q('#eval-trace-play').textContent='Ⅱ Pause replay';q('#eval-trace-play').setAttribute('aria-pressed','true');replayTimer=setInterval(()=>{if(document.hidden){pauseReplay();return;}if(state.step>=23){pauseReplay();return;}state.step++;renderTrace();},700);});
  new IntersectionObserver(entries=>{if(!entries[0].isIntersecting&&state.playing)pauseReplay();}).observe(q('#eval-replay'));
  let lastWidth=0;new ResizeObserver(entries=>{const width=entries[0].contentRect.width;if(Math.abs(width-lastWidth)<1)return;lastWidth=width;renderMain();renderExperiments();renderTrace();}).observe(q('#eval-landscape'));
  qa('[data-result-policy] th').forEach(th=>{const row=th.closest('[data-result-policy]'),policy=row.dataset.resultPolicy.toLowerCase();th.innerHTML=`<button data-eval-policy="${policy}" class="eval-table-policy">${names[policy]}</button>`;});
  renderMain();renderExperiments();renderTrace();
})();
