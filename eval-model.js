/* Descriptive statistics for recorded benchmark outcomes. No synthetic samples. */
(function(root){
  'use strict';
  const mean=values=>values.reduce((s,v)=>s+v,0)/values.length;
  function summarize(rows,key){const values=rows.map(r=>r[key]),m=mean(values);return {n:values.length,mean:m,sd:Math.sqrt(values.reduce((s,v)=>s+(v-m)**2,0)/(values.length-1))};}
  function quantile(sorted,p){const i=(sorted.length-1)*p,lo=Math.floor(i),f=i-lo;return sorted[lo]+f*((sorted[lo+1]??sorted[lo])-sorted[lo]);}
  function box(values){const sorted=[...values].sort((a,b)=>a-b),q1=quantile(sorted,.25),median=quantile(sorted,.5),q3=quantile(sorted,.75),iqr=q3-q1;return {q1,median,q3,low:sorted.find(v=>v>=q1-1.5*iqr),high:[...sorted].reverse().find(v=>v<=q3+1.5*iqr)};}
  function paired(before,after,key){const index=new Map(before.map(r=>[`${r.run}:${r.episode}`,r]));if(index.size!==before.length||before.length!==after.length)throw Error('Unmatched evaluation groups');return after.map(r=>{const a=index.get(`${r.run}:${r.episode}`);if(!a)throw Error('Missing paired rollout');return {...r,delta:r[key]-a[key],before:a[key],after:r[key]};});}
  function histogram(values,count=16){let min=Math.min(0,...values),max=Math.max(0,...values);if(max-min<1e-10){min-=.01;max+=.01;}const pad=(max-min)*.04;min-=pad;max+=pad;const width=(max-min)/count,bins=Array.from({length:count},(_,i)=>({x:min+i*width,upper:min+(i+1)*width,n:0}));values.forEach(v=>bins[Math.min(count-1,Math.max(0,Math.floor((v-min)/width)))].n++);return {min,max,bins};}
  const api={mean,summarize,quantile,box,paired,histogram};if(typeof module!=='undefined'&&module.exports)module.exports=api;else root.SolarEvalMath=api;
})(typeof globalThis==='undefined'?this:globalThis);
