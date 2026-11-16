"""Extract verified, local SolarChain-Eval records for the classroom figures."""
from pathlib import Path
import csv,json,statistics,hashlib
ROOT=Path(__file__).resolve().parents[1]
RUNS=ROOT.parent/'Solar_RL'
SETTINGS={'main':'main','no_physics_penalty':'noPhysics','agentic_llm_llm':'llm','agentic_llm_llm_no_physics_penalty':'llmNoPhysics'}
FIELDS={'cumulative_reward':'reward','episode_volume':'volume','physics_violation_rate':'violation','mean_slippage':'slippage','artificial_liquidity_MWh':'liquidity','action_jitter':'jitter','spatial_fairness_index':'fairness','audit_call_rate':'auditRate','revision_rate':'revisionRate'}
records=[];manifest=[]
for directory,setting in SETTINGS.items():
 for run in [20260511,20260512,20260513]:
  source=RUNS/f'paper_final_seed_{run}'/'runs'/directory/'metrics.csv'
  manifest.append({'file':str(source.relative_to(RUNS)),'sha256':hashlib.sha256(source.read_bytes()).hexdigest()})
  for row in csv.DictReader(source.open()):
   out={'setting':setting,'policy':row['policy'],'run':run,'episode':int(row['episode']),'environmentSeed':int(row['seed'])}
   out.update({short:round(float(row[key]),9) for key,short in FIELDS.items() if row.get(key) not in [None,'']})
   records.append(out)
assert len(records)==1620
paper={'static':[-23.38,.4874,.1803,.0140,.514],'random':[-25.46,.4771,.1137,.0148,.480],'myopic':[-23.08,.4779,.1009,.0144,.456],'ppo':[-22.35,.4520,.1453,.0134,.470],'sac':[-22.26,.4461,.0686,.0178,.521],'dqn':[-23.23,.4688,.1298,.0148,.491]}
for policy,values in paper.items():
 group=[r for r in records if r['setting']=='main' and r['policy']==policy];assert len(group)==90
 for (key,digits),expected in zip([('reward',2),('violation',4),('liquidity',4),('slippage',4),('volume',3)],values):
  actual=round(statistics.mean(r[key] for r in group),digits)
  assert actual==expected,(policy,key,actual,expected)
# Pair by training run and episode, rather than equating rounded means.
for base,abl,expected in [('main','noPhysics',[.0785,.1238,.0576]),('llm','llmNoPhysics',[.0598,.1149,.0413])]:
 for policy,delta in zip(['ppo','sac','dqn'],expected):
  a={(r['run'],r['episode']):r for r in records if r['setting']==base and r['policy']==policy}
  b={(r['run'],r['episode']):r for r in records if r['setting']==abl and r['policy']==policy}
  assert len(a)==len(b)==90 and a.keys()==b.keys()
  assert round(statistics.mean(b[k]['liquidity']-a[k]['liquidity'] for k in a),4)==delta
source=RUNS/'paper_final_seed_20260512/runs/agentic_llm_llm_no_physics_penalty'
actions={(r['policy'],int(r['episode']),int(r['step'])):r for r in csv.DictReader((source/'actions.csv').open())}
trace=[]
for line in (source/'agentic_logs.jsonl').read_text().splitlines():
 log=json.loads(line)
 if log['policy']!='ppo' or log['episode']!=6:continue
 action=actions[('ppo',6,log['step'])]
 trace.append({'step':log['step'],'hour':int(action['hour']),'audited':log['audit_called'],'decision':log['audit_decision'],'modified':log['action_modified'],'delta':log['action_delta'],'proposed':log['original_action'],'executed':log['final_action'],'bounds':log['plan']['action_bounds'],'reason':log['reason'],'rawRisk':float(action['raw_physics_record_rate']),'riskTrigger':log['plan']['audit_policy']['force_audit_if_violation_rate_above']})
trace.sort(key=lambda x:x['step']);assert len(trace)==24
selected=trace[15];assert selected['audited'] and selected['decision']=='revise'
assert round(selected['proposed']['liquidity_ratio'],3)==.931 and round(selected['executed']['liquidity_ratio'],3)==.2
payload={'schema':1,'policies':['static','random','myopic','ppo','sac','dqn'],'records':records,'trace':trace,'traceSource':{'run':20260512,'policy':'ppo','setting':'llmNoPhysics','episode':6,'highlight':15}}
(ROOT/'assets/eval-evidence.js').write_text('window.SolarEvalEvidence='+json.dumps(payload,separators=(',',':'))+';\n')
with (ROOT/'evidence/solarchain-eval-rollouts.csv').open('w',newline='') as f:
 writer=csv.DictWriter(f,fieldnames=['setting','policy','run','episode','environmentSeed',*FIELDS.values()]);writer.writeheader();writer.writerows(records)
(ROOT/'evidence/solarchain-eval-trace.json').write_text(json.dumps({'source':payload['traceSource'],'steps':trace},indent=2)+'\n')
(ROOT/'evidence/solarchain-eval-provenance.json').write_text(json.dumps({'canonicalManuscript':'Solar_RL/SolarChain_Eval_KDD_AgenticAI_Camera_Ready_arXiv_latest/evaluation.tex','records':len(records),'mainRecords':540,'recordsPerPolicyAndSetting':90,'trainingRuns':[20260511,20260512,20260513],'sourceFiles':manifest,'checked':'All five main-table means and both governance regimes of artificial-liquidity ablation deltas match the paper at its displayed precision.'},indent=2)+'\n')
print(f'Exported {len(records)} real episode records and {len(trace)} hourly audit steps; paper means and paired deltas verified.')
