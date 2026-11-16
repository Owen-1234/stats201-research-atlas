# Between Data and Decisions

Shilin Ou · The Research Atlas · STATS 201: Introduction to Machine Learning in Social Science

## Timing

The atlas is the table of contents for the talk. Click a city to enter the corresponding study and use its return button to come back. The four papers follow Singapore, Shanghai, Jeju, and Rio. The Jeju section introduces RL; the Rio section opens with a two-minute pruning lesson.

| Time | Section | Use in the room |
| --- | --- | --- |
| 00:00–02:00 | The Research Atlas | Introduce the question and the four stops |
| 02:00–05:00 | Singapore: Capital Cost | One financing calculation and the forecasting workflow |
| 05:00–11:00 | Shanghai: SolarChain | Verification, the physical-bound example, and allocation |
| 11:00–16:00 | Jeju: RL background | Udacity short lesson (~2½ min) and one battery episode |
| 16:00–22:00 | Jeju: SolarChain-Eval | The objective, experiments, and an intervention trace |
| 22:00–24:00 | Pruning background | Mısra Turp’s complete two-minute network-pruning lesson |
| 24:00–27:00 | Rio: ViRel-Budget | Representation, proxy metrics, and measured GPU energy |
| 27:00–28:00 | Ongoing work | Who Bears the Cost? |
| 28:00–30:00 | Conclusion and discussion | Representation and the people affected by a decision |

The page includes more figures than need to be discussed in thirty minutes. Use one main figure per study; the others can support questions. The text below is a speaking draft with short demonstration cues. It keeps the two SolarChain papers as the main technical examples.

## 00:00–02:00 · The Research Atlas

Good afternoon. I’m Shilin Ou. Today I’ll use four projects to talk about the space between data and decisions. We’ll start with prediction, move to checking evidence, introduce reinforcement learning, and then look at how to measure the resources used by an AI system.

This map is the structure of the talk. Singapore is the capital-cost project. Shanghai is SolarChain, where we check generation reports before market settlement. Jeju is SolarChain-Eval, where a learned policy controls market parameters. Rio is ViRel-Budget, which studies visual computation and GPU energy.

**Point to the four titles, then select Singapore.**

The connection to this course is how we turn a social or economic question into a learning problem. That requires choices about the target, available evidence, and evaluation. The projects give us concrete examples of those choices. We’ll introduce the RL vocabulary before the Jeju experiments.

## 02:00–05:00 · Singapore: Capital Cost

The first project looks at the financing side of energy transition. A technology can stay physically identical while its financing conditions change. The target here is the weighted average cost of capital, or WACC: the average expected cost of financing the asset.

**Compare 4%, 8%, and 12%, then click one rate/lifetime cell. Keep this to about forty-five seconds.**

The reference installation has one megawatt of capacity, a one-million-dollar investment, a twenty-year life, and a twenty-percent capacity factor. At eight-percent financing, annual capital recovery is about a hundred and two thousand dollars. With twenty thousand dollars of annual operation and 1,752 megawatt-hours of generation, the illustrative levelized cost is about 69.6 dollars per megawatt-hour. At four percent, it is about 53.4. The bars separate straight-line recovery, the financing premium, and operation. The matrix shows how the financing rate and project life interact. This comparison holds the installation and its annual generation fixed.

The study uses a staged modeling pipeline. It first models fuel-price paths, then estimates inflation, and finally uses regression models for capital costs across project types. The original workflow figure shows those stages. A modeling chain also means that assumptions and uncertainty from an earlier stage can enter a later one.

**Show the original forecast comparison or workflow.**

The predictive question is how well the variables describe WACC in these scenarios. A causal study would also examine the process connecting fuel prices to financing and the other conditions that change along the way.

The paper uses holdout and rolling-origin checks to examine stability. That is a useful habit when time is involved: examine whether a model carries forward, as well as how it fits the available panel. We interpret the capital-cost estimates as predictive sensitivity in the scenario setup.

**Use Return to the Research Atlas, then select Shanghai.**

## 05:00–11:00 · Shanghai: SolarChain

Suppose a rooftop installation reports electricity it did not produce. A market might count that report as supply and allocate a reward. Our first SolarChain paper follows a report through the system to see what evidence can be checked before it reaches settlement.

The monthly benchmark has fifty simulated nodes in five Chinese cities and thirty-six thousand hourly records. The inputs have different origins. City-level weather comes from Open-Meteo. A physical model uses solar position, panel attributes, and temperature correction to generate plausible bounds. Individual nodes, reported output, demand, trades, and attacks are simulated.

**Show the five-city figure briefly, then trace a path in the architecture.**

A report arrives with physical and contextual evidence. The verifier checks it. A planner can inspect the candidate before approval. Accepted generation enters the allocation and settlement steps. The log records the decisions for replay. Follow that path through the figure.

### Building and checking a local network

**Use the real Shanghai map. Pause the clock, choose Solar array, and click a point on land. Add a factory next. Spend about seventy-five seconds on this demonstration.**

We place solar arrays and factories on OpenStreetMap streets and building footprints. An array adds generation; a factory adds demand. The icons stay at their selected coordinates, and the numbers on the map come from the same simulation as the device inspector and supply account.

**Inspect an array and choose Try 1.8×. Follow the flagged report in the stream, then restore the measured report.**

The physical output stays the same when we inflate a report. Its claimed output can exceed the bound, however, so the verifier excludes that claim from verified supply. The factory still has demand to meet. Pause on that distinction: generation, a reported measurement, and the amount admitted to an economic account are different quantities.

The original scatter plot shows the paper’s above-bound cases. The planner interface shows where a reviewer can inspect evidence for a decision. The classroom simulation gives us a way to follow one report through that logic.

### Comparing the verifiers

We test the methods on the same ordered monthly records. Attacks are the positive class. Recall measures how many injected attacks are detected; precision measures how often a flagged report is one of those attacks.

IQR/MAD reaches F1 equal to one on the original injected labels. The adaptive verifier reaches zero point nine eight eight. The adaptive method is rule based and also records contextual evidence. So we can compare aggregate accuracy, computational cost, and what a reviewer can inspect about an individual result.

The broader eleven-category stress test includes harder cases. Near-bound fraud and coordinated near-bound reports remain difficult. That suggests where authenticated context or another detection mechanism could be useful. It also shows why a single aggregate result does not describe every kind of error.

### Allocating accepted value

**Compare 20/80 with 50/50. Allow a brief prediction before clicking.**

After accepting generation, the prototype allocates value to producer rewards and shared liquidity. The paper sweeps forty-one allocations across seven simulated scenarios. The interface shows selected entries.

With twenty percent rewards and eighty percent liquidity, reported fulfillment is ninety-five point six percent. At fifty-fifty, producer rewards increase while fulfillment falls to seventy-eight point two percent in those conditions. The selected default depends on a score that puts half its weight on fulfillment and the rest on rewards and other market outcomes.

These weights belong in the research discussion. A producer and a buyer may prefer different allocations. The next study lets a policy learn to choose market parameters over time, which makes the objective especially important.

**Return to the atlas and select Jeju.**

## 11:00–16:00 · Jeju: reinforcement learning background

We’ll start with Udacity’s short introduction. It draws the exchange between an agent and its environment. Watch what flows in each direction: an action goes out; a state and a reward come back.

**Play the complete Reinforcement Learning Basics video, approximately 2½ minutes.**

In our setting, the agent is the software choosing an action. A state describes what it uses now. A policy specifies how it chooses. The environment produces a reward and a new state after the action.

**Choose one noon action in the battery example, then run the evening. Keep the demonstration to about forty-five seconds.**

We have two energy units. Each earns one credit now or three later. Storing both gives zero now and six in the evening. At gamma equal to zero point nine, the discounted return is five point four. Selling both now gives two. The small comparison below the ledger shows all three actions under the same discount factor. Lower gamma and watch when the preferred action changes.

The example gives us fixed prices so we can work out the answer directly. An RL algorithm updates a policy from many interactions. It needs experience with uncertain actions as well as opportunities to use what it has learned. An episode is one run; in SolarChain-Eval, it lasts twenty-four hours. An allocation also affects the liquidity available later in the episode.

## 16:00–22:00 · Jeju: SolarChain-Eval

### The learning problem · about one minute

SolarChain-Eval gives a policy control over hourly market parameters. Its state describes supply, demand, liquidity, price, and physical risk. The action chooses producer rewards, liquidity support, and token burning. Reward and liquidity shares must sum to no more than zero point nine eight.

We compare static, random, and myopic rules with PPO, SAC, and DQN. PPO and SAC use continuous actions; DQN chooses from a grid of a hundred and twenty-five combinations. The reward favors matched energy and penalizes drawdown, abrupt changes, unmet demand, physical risk, and unequal allocations across cities. These terms express the priorities the policy learns to pursue.

### Comparing the policies · about 90 seconds

**Use Compare policies. Select SAC, then change the horizontal axis from physics violation rate to mean slippage.**

Each small dot is a recorded episode, and a large ring is a policy mean. All six policies use the full reward. PPO and SAC have higher mean reward than the fixed and myopic rules. SAC has the lowest mean physics violation rate and the least artificial liquidity among the learned policies.

Changing the axis reveals another part of the comparison: SAC’s mean slippage is one point seven eight percent; PPO’s is one point three four percent.

**Switch to Rollout distributions and choose artificial liquidity.**

The box contains the middle half of the recorded values; its line is the median. PPO’s wider spread is visible alongside its mean. There are ninety episodes per policy across three training seeds. We can select a dot to inspect one episode.

### Changing a condition · about 90 seconds

**Use Change an experimental condition. Choose Remove physics penalty, uncheck With LLM governance, and select SAC.**

SAC’s artificial liquidity rises from zero point zero six eight six to zero point one nine two five megawatt-hours. The mean paired increase is zero point one two three eight. Each pair matches the same training run, policy, and evaluation episode. The histogram below shows all ninety changes.

Artificial liquidity measures market backing assigned to invalid supply. Its increase tells us what the policy does when the reward places less weight on physical risk. PPO and DQN show the same direction of change.

**Choose Add Planner / Auditor and check Physics penalty included.**

The policy is trained first and stays frozen during this evaluation. A Planner bounds its proposals, and an Auditor can revise high-risk actions. Negative jitter changes mean smoother actions: SAC and DQN decrease, while PPO increases. The four-cell matrix lets us inspect both experimental conditions together.

### Following one action · about two minutes

**Use Inspect an audit record. Select hour 1, then hour 15 in the timeline. Start and pause Replay 24 hours briefly.**

This is PPO episode six from the May twelve training run, without the physics penalty. Some hours pass through the Planner alone; ochre marks identify calls to the Auditor.

At hour fifteen, proposed liquidity is zero point nine three one. The Auditor reduces it to zero point two and removes the proposed burn. Reward share moves slightly from zero point zero four nine to zero point zero five. The plane shows the allocation shares against the benchmark limit and Planner bounds. Burn has its own track.

The record preserves the context, proposal, execution, and reason for the change. Across evaluated policies, oversight reduces artificial liquidity for PPO and raises it slightly for SAC and DQN under the constrained reward. The hourly record helps explain a particular intervention; the paired experiments show its broader effects. Together they let us ask how a decision was produced and whose outcomes it changes.

**Return to the atlas and select Rio.**

## 22:00–24:00 · Pruning background

Before the last paper, here is a short explanation of pruning. Watch how the network changes when some connections are removed.

**Play Mısra Turp’s complete two-minute video, Pruning a neural Network for faster training times.**

## 24:00–27:00 · Rio: ViRel-Budget

The video removes network connections. Our next study selects visual information. A vision-language model represents an image as tokens, which carry information about regions of the image into the model. The fox example gives us a way to picture what selecting a smaller set means.

**Show the original image and its token-grid illustration, then the workflow.**

ViRel-Budget chooses an inference action for each query. A frozen metadata controller makes that choice. We evaluate how the answer compares with dense inference, how it behaves under defined visual interventions, and how much GPU energy the selected path uses.

**Choose LLaVA 13B and compare the two charts.**

SCOPE reduces measured GPU energy by ten point six two percent in the released replication. FastV avoids dense inference on seventy-seven point seven eight percent of queries, while its measured energy is one point three five percent higher. A reduction in the computational proxy can coexist with a higher measured resource cost.

These results use three group-disjoint draws of two hundred and ten queries, six hundred and thirty in total. The selector lets us make the same comparison on the other model size.

For this course, the interesting point is how we define an outcome. A token count tells us about one part of the computation. An energy reading tells us what happened on the GPU. Behavioral tests tell us what changed in the answer. Measuring all three helps us understand where the trade-offs come from.

## 27:00–28:00 · Ongoing work: Who Bears the Cost?

Our ongoing project moves to the placement of Web AI requests. A gateway can use a user-side GPU or an institutional GPU. Runtime constraints can change the proposal before execution, shifting resources and reference charges between the two parties.

**Keep the proposal at eighty percent and capacity at sixty percent, then move capacity once.**

This illustration has a hundred equal-cost requests. The proposal puts eighty on the user side, but capacity permits sixty. Twenty move to the institution, and the accounts follow the executed sixty-forty split.

The project records the proposed and executed placements, the reason for repair, and the resulting accounts. It includes receipts and an independent verifier to check those records. The connection to the earlier studies is the difference between a policy’s output and what a system actually does. Explaining the outcome requires the record of that change and the allocation of its consequences.

## 28:00–30:00 · Conclusion

A model works with a representation of a problem: fuel prices as predictors, a generation report as evidence, physical risk as a penalty, or visual reliance as an evaluation label. Each representation makes some differences measurable and leaves others outside the analysis. Choosing which differences matter draws on both empirical evidence and the experience of the people affected.

For social science, this brings the people affected by a model into the definition of the task. A false rejection can change a producer’s payment. A reward weight can favor participation or shared liquidity. An inference policy can shift resource use between devices. Following these effects across participants gives an aggregate score its social meaning.

Machine learning gives us ways to examine such choices empirically. We can test a representation in another setting, alter an incentive, measure an intervention, or trace where a cost went. The evidence can inform how the system should be used, alongside the priorities and experience of the people who use it.

**Ask the closing question and allow a response:** If you changed one assumption in these studies, whose outcome would you expect to change first?

Thank you. I’d be glad to return to any study.

## Material to leave for questions

The full detector table, the paired policy comparisons, algorithm references, and the original figures provide additional depth. If time is short, keep the primer, one physics-penalty comparison, one audit trace, and the Rio proxy/measurement comparison. Each study’s return button makes it easy to revisit a figure without following the whole page again.
