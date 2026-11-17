/* Deterministic classroom models. Monetary and energy quantities stay explicit. */
(function(root){
  'use strict';
  const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
  // Real-dollar, unlevered discounted cash flow. ATB 2024 utility-scale PV
  // benchmark inputs are normalized to 1 MW AC; this is not a 1 MW project quote.
  function finance({investment=1560000,years=30,rate=8,capacityFactor=.269,degradation=.007,operations=22000}={}){
    const r=rate/100,energy=8760*capacityFactor;
    const cashflows=Array.from({length:years},(_,i)=>{const year=i+1,discount=1/(1+r)**year;return {year,energy:energy*(1-degradation)**i,operations,discount};});
    const pvOperations=cashflows.reduce((sum,d)=>sum+d.operations*d.discount,0);
    const pvEnergy=cashflows.reduce((sum,d)=>sum+d.energy*d.discount,0);
    const pvCost=investment+pvOperations,cost=pvCost/pvEnergy;
    const annuity=cashflows.reduce((sum,d)=>sum+d.discount,0),annualCapital=investment/annuity;
    return {annualCapital,operations,energy,cost,pvOperations,pvEnergy,pvCost,cashflows};
  }
  function daylight(hour){return Math.max(0,Math.sin((hour-6)/12*Math.PI))*(hour>=6&&hour<=18?1:0);}
  function device(asset,hour,cloud=15){
    const sun=daylight(hour),irradiance=1000*sun*(1-.65*cloud/100),temp=18+irradiance*.025;
    if(asset.type!=='solar'){
      const duty=.82+.15*Math.cos((hour-13)/12*Math.PI);
      return {id:asset.id,type:asset.type,demand:asset.capacity*clamp(duty,.6,1),generation:0,verified:0,bound:0,irradiance,temp};
    }
    const bound=asset.capacity*irradiance/1000;
    const generation=bound*(.88+.015*Math.sin(hour*1.6+asset.row+asset.col));
    const reported=generation*(asset.bias??1),flagged=reported>bound+.01;
    return {id:asset.id,type:asset.type,generation,dc:generation/0.96,reported,bound,flagged,verified:flagged?0:reported,irradiance,temp,demand:0};
  }
  function city(assets,hour,cloud){
    const devices=assets.map(a=>device(a,hour,cloud));
    const sum=key=>devices.reduce((total,d)=>total+(d[key]||0),0);
    const generation=sum('generation'),verified=sum('verified'),demand=sum('demand'),served=Math.min(verified,demand);
    return {devices,generation,verified,demand,served,imports:Math.max(0,demand-verified),exports:Math.max(0,verified-demand),coverage:demand?served/demand*100:0};
  }
  const api={finance,daylight,device,city};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  else root.SolarAtlasModel=api;
})(typeof globalThis==='undefined'?this:globalThis);
