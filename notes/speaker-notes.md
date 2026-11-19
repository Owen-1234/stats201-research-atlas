# Between Data and Decisions

Shilin Ou · Duke Kunshan University

STATS 201 · Introduction to Machine Learning in Social Science

30-minute English speaking script · 19 November 2026

## Running order

Aim for about 112 spoken words per minute and use the pauses marked below. Read the plain paragraphs aloud. The indented cues are for the presenter. The clock includes time to look at the figures, play both complete videos, and hear an answer from the room. The chapter menu stays at the top of the page. [Open the atlas](https://stats201-research-atlas.vercel.app/)

| Clock | On screen | Live action |
| --- | --- | --- |
| 00:00–02:00 | Opening and reading route | Find the four studies and the ongoing project |
| 02:00–05:00 | Singapore · Capital Cost | Trace the paper workflow, then compare 4%, 8%, and 12% |
| 05:00–11:00 | Shanghai · SolarChain | Inspect one report, then compare the 20/80 and 50/50 allocations |
| 11:00–16:00 | Jeju · Reinforcement learning | Play Udacity’s full lesson (about 2½ min) and carry liquidity into 13:00 |
| 16:00–22:00 | Jeju · SolarChain-Eval | Follow one SAC episode, one matched comparison, and one PPO intervention |
| 22:00–24:00 | Rio · Pruning | Play Mısra Turp’s full two-minute video |
| 24:00–27:00 | Rio · ViRel-Budget | Read the fox illustration and the 13B replication intervals |
| 27:00–28:00 | Who Bears the Cost? | Trace the original flowchart and switch the local GPU’s availability |
| 28:00–30:00 | Discussion | Invite one answer about whose outcome changes |

## 00:00–02:00 · Opening

Good afternoon. I’m Shilin Ou. Imagine that you own a rooftop solar panel. At noon it sends a number to a market. Before anyone pays you, somebody has to decide whether to believe the reading. And before we can even ask that question, somebody had to decide whether the panel was worth financing. Those are two quite different decisions about the same piece of equipment.

Today I want to follow what happens between a model’s inputs and a decision that affects somebody. The map takes us through four studies. In Singapore the model predicts a financing condition. In Shanghai a report can enter a settlement. In Jeju a policy chooses how to run that market. In Rio we measure the electricity a model uses to answer a question.

> Leave the reading route on screen for about 20 seconds. Give students time to read across the verbs. [Reading route](https://stats201-research-atlas.vercel.app/#talk-route)

There’s one more question after the four studies. If we move a computation to a different machine, whose energy account picks it up? We’ll come back to that at the end. For now, keep the rooftop in mind. Let’s start at the point where someone has to fund it.

## 02:00–05:00 · Singapore — predicting the cost of capital

The financing study asks how fossil-fuel price scenarios relate to the cost of financing different energy technologies. Our target is WACC, the weighted average cost of capital. In plain language, it combines the cost of borrowing with the return expected by people who put their own capital into the project.

> Open the original method figure. Trace fuel-price forecasts, the inflation estimate, and the project-level WACC model from left to right. Allow about 15 seconds to read it, then close it. [Paper workflow](https://stats201-research-atlas.vercel.app/#capital-method)

Each step passes an estimate to the next. If an oil-price forecast misses a turn, the financing model inherits that input. The paper checks how the fitted relationships carry forward when later scenario years are held out. Some later periods have a narrow range of WACC values, so small errors can move the fit statistic appreciably. That matters if someone wants to use these scenarios to judge future investment conditions.

What would a different financing rate actually mean for a solar project? The next chart lets us do that calculation. Imagine one megawatt of capacity at the benchmark cost of 1.56 million dollars, a thirty-year operating life, and the middle solar-resource class. A payment in thirty years has less present value than the same payment today. We want a constant electricity price that can recover the upfront investment and the operating costs from the electricity sold over that life.

> Select **Restore benchmark inputs**. Point to the 8% result, then choose the **4% real rate** and **12% real rate** buttons under the curve. Pause about 25 seconds across the two clicks. [Financing studio](https://stats201-research-atlas.vercel.app/#finance-studio)

At eight percent the answer is about seventy-three dollars per megawatt-hour. At four percent it is about fifty-two, and at twelve percent it is about ninety-six. The panels produce the same physical output in all three cases. Discounting changes the value of future electricity relative to the cost paid at installation. The paper supplies the forecasting question. The discounted cash-flow calculation shows why the financing condition matters to a developer.

## 05:00–11:00 · Shanghai — which solar reports reach settlement?

Now suppose the panels have been built and someone is ready to pay for electricity. A rooftop reports that it produced more than its neighbors. Maybe a cloud passed over the other street. Maybe the reading is wrong. What information would you want before settling that claim?

In SolarChain we follow a report from physical evidence through verification, planner review, and allocation. The monthly experiment covers fifty simulated nodes in five Chinese cities and thirty-six thousand hourly generation records. The weather observations come from real cities. The panel profiles, reported generation, demand, and injected cases are produced by the simulator. That gives us a known set of labels for checking the detector.

> Show the five-city original, then the original architecture just below it. Let the audience find the handoff from verification to settlement. Keep about 20 seconds for the figures. [Shanghai study](https://stats201-research-atlas.vercel.app/#verify)

Picture the role of the person who reviews a flagged report. A score tells them that the case deserves attention. An estimated upper bound tells them what the system thought was physically plausible for that panel at that hour. They can look at the recent readings and the local context before approving a payment. Those two pieces of information answer different questions.

> On the city map, select **Reset**, then **Pause** while it is daylight. Use the preloaded **PV-01**. Point to **AC output**, **Physical upper bound**, and **Reported output**. Choose **Try 1.8×**, let the flag appear, and give the room about 30 seconds to compare the three readings. Finish with **Restore measured report**. [Shanghai map](https://stats201-research-atlas.vercel.app/#solar-city)

I’m changing the claim while the clock is stopped. Watch the generation reading. The device is still producing the same power. The report now exceeds its bound, and the market excludes that report from verified supply. A buyer still has the same demand. That is why an error in a sensor record can become an economic event. It changes how much supply reaches the account against which the buyer can trade.

On the original monthly labels, the IQR/MAD statistical rule scores one on F1. The adaptive verifier scores 0.988 and detects all the injected positives in that comparison. Precision tells us how many flags correspond to an injected case. Recall tells us how many injected cases the rule found. In the wider stress test, coordinated claims close to the physical boundary remain difficult. Two plausible-looking reports can agree with one another. A reviewer needs to know how that agreement was produced.

Imagine two calls to the person reviewing those reports. One comes from a producer whose legitimate reading was rejected on an unusually clear day. The other comes from a factory that expected electricity the market had credited but that no panel actually produced. Both people can point to the same accuracy table and still want different evidence. The producer wants to see the boundary applied to that particular panel. The factory wants to know which accepted reports actually backed its trade. Keeping the decision record lets us ask both questions.

Once the report is accepted, there’s another choice. What share of accepted value goes directly to producers, and what share stays in the market to support trading?

> Show **20 / 80**. Ask the room to predict what happens to fulfillment if producers receive half. Wait for one prediction, then select **50 / 50**. Allow about 30 seconds. [Five reported allocations](https://stats201-research-atlas.vercel.app/#allocation-lab)

At twenty-eighty, the simulations fulfill 95.6 percent of demand and allocate 8,976 kilowatt-hours of reward to producers. At fifty-fifty, rewards rise to 22,441 and fulfillment falls to 78.2 percent. Each dot is a reported split, averaged over the same seven scenarios. A buyer waiting for a trade and a producer waiting for payment could reasonably rank these options differently. In the next paper we give a policy the power to change the allocation every hour. We still have to tell it what a good outcome is.

## 11:00–16:00 · Jeju — learning from feedback

We’ll begin with Udacity’s introduction to reinforcement learning. Watch what the agent sends to the environment, then watch what comes back. That exchange is what our market example needs.

> Play **Reinforcement Learning Basics** in full, about 2½ minutes. [RL lesson](https://stats201-research-atlas.vercel.app/#rl-basics)

The state is the information the agent has when it acts. Its policy chooses an action. The market responds with a reward and a next state. If today’s allocation leaves some liquidity in the market, the next decision starts with that balance. We can watch this happen in two hours of the benchmark equations.

> Choose **Reset the example** at noon. Leave burn at zero and suspicious supply included. Move **Liquidity support** from 0.40 to its maximum, 0.78. Pause at the last column, then select **13:00 · next state**. Allow about 35 seconds for the ledger. [Two-hour market ledger](https://stats201-research-atlas.vercel.app/#energy-playground)

At the starting setting, roughly 0.537 is available at noon and all of it matches demand. Nothing carries forward. At the higher setting, the market can meet the noon demand and carry 0.297 into the next hour. Read the first column at one o’clock. That same 0.297 has become the opening balance. Meanwhile some new liquidity comes from suspicious supply. The example keeps a separate count of that backing.

These inputs were chosen for the classroom. In training, a policy encounters many transitions and learns from the rewards over an episode. Our episodes last twenty-four hours. A larger allocation can help the next hour and support a questionable report in the current one. The way we score those consequences gives the policy its incentive.

## 16:00–22:00 · Jeju — evaluating a market policy

A policy here chooses three settings every hour. It assigns a producer reward share, a liquidity share, and a burn rate. The environment rewards matched energy and applies penalties for outcomes including unmet demand, physical risk, and abrupt changes in action. We compare six policies under the full reward, three learned policies and three rules.

> In **One policy. More than one outcome.**, keep **With physics penalty · RL** and **All episodes**. Select **SAC**, then select the first episode in the picker, from training seed 20260511. Allow about 20 seconds to locate the cloud and read the highlighted result. [3D policy plot](https://stats201-research-atlas.vercel.app/#spatial-lab)

Each point is one whole evaluated day. There are ninety for each policy, from three training seeds. The vertical direction is cumulative reward. The two directions along the floor give physical violations and artificial liquidity. Artificial liquidity is market backing assigned to physically unsupported supply. Two days with a similar reward can differ in how much of that supply the policy backed.

For the selected SAC day, the reward is about minus twenty point five four, and artificial liquidity is 0.0444 megawatt-hours. Now I’m going to carry that very same observation into the flat plot. You can check the seed and episode number underneath. Those identifiers let us follow a case through two views.

> Click **Open this episode in 2D**. Point to the selected dot and the larger mean ring. In the SAC profile, click **Artificial liquidity** for its distribution. Leave about 20 seconds for the room to find the median and the spread. [Main comparison](https://stats201-research-atlas.vercel.app/#eval-landscape)

The selected episode tells us what happened on a particular day. The boxes summarize many days. Under the constrained reward SAC averages about 0.0686 megawatt-hours of artificial liquidity. PPO averages 0.1453. SAC also has higher average slippage, 1.78 percent compared with PPO’s 1.34 percent. If a trader cares about the terms on which a trade clears, that second comparison belongs beside the first.

There’s a useful difference between the box and the ring you saw a moment ago. The ring marked an average. The line inside the box is the median day, and the box spans the middle half of the observations. If you were running a market, you might care a great deal about the days outside that box. Notice also how these ninety episodes were collected. Thirty come from each of three training seeds. That distinction matters if someone asks how much evidence we have about variation from training the policy again.

Now we can change an incentive and ask a more specific question. What happens to questionable backing when we train without the physics penalty?

> Follow **Compare penalty effects**. Use **Remove physics penalty**, **Artificial liquidity**, and **SAC** with **With LLM governance** clear. Point to the two columns and the histogram below. Allow about 20 seconds. [Matched experiments](https://stats201-research-atlas.vercel.app/#eval-experiments)

Mean artificial liquidity rises from 0.0686 to 0.1925 megawatt-hours. Subtract within each matched seed and evaluated episode, then average those ninety differences. The increase is 0.1238. The displayed means are rounded separately. The histogram lets us see how the changes varied from episode to episode. The definition of reward changes between these two settings. Artificial liquidity keeps the same unit and meaning in both.

There’s a second experiment about what reaches execution. We freeze a trained policy and put a Planner and an Auditor between its proposal and the environment. The log lets us inspect which settings changed before the market used them.

> Follow **Inspect the recorded intervention**. Use **Auditor intervention** at 15:00. Point to the paired liquidity columns, then to the burn pair. Allow about 15 seconds. [Recorded action](https://stats201-research-atlas.vercel.app/#eval-replay)

In this PPO episode the proposal puts 93.1 percent into liquidity. The executed setting is 20 percent. The proposed burn is 20 percent and the executed burn is zero. We can name the decision, the hour, and the settings that actually ran. The aggregate effect of oversight depends on the base policy. That is why we keep both the population comparison and the individual record.

Our last study follows what actually ran on a GPU. As we move to Rio, watch what the next video removes from the network.

## 22:00–24:00 · Rio — pruning

> Play Mısra Turp’s **Pruning a neural network** in full. This two-minute block is reserved for the video. [Pruning lesson](https://stats201-research-atlas.vercel.app/#pruning-basics)

## 24:00–27:00 · Rio — measuring the cost of an answer

The video removed connections from a network. ViRel-Budget makes a choice about the visual information passed into a vision-language model. Look at the fox. If the question is about the animal, some regions of the image may matter much more than others. Change the question to one about the background and those priorities can change too.

> Show the original fox and token-grid illustration below the player. Give students about 10 seconds to decide which regions they would keep for each question. [Rio study](https://stats201-research-atlas.vercel.app/#virel-study)

Our controller uses the available metadata to choose an inference action for each query. It stays frozen during evaluation. We compare the answer with dense inference, examine behavior under defined visual changes, and measure energy on the device. Skipping a dense pass tells us which path the controller chose. The energy reading tells us what that whole path cost on this GPU.

> Choose **LLaVA 13B**, then **FastV**. Give students time to locate the energy estimate, the zero mark, and the dense-avoidance percentage. Select **SCOPE** and read across the same columns. Allow about 25 seconds. [GPU measurements](https://stats201-research-atlas.vercel.app/#virel-results)

FastV avoids dense inference on 77.78 percent of the queries. Its measured energy change is plus 1.35 percent. The interval reaches from minus 1.39 to plus 4.13 percent, so these data leave room for either direction. SCOPE avoids dense inference on half the queries and uses 10.62 percent less GPU energy. Its entire reported interval lies on the lower-energy side of zero.

The rightmost column asks a different question about the same queries. On this model size, the reported unsafe-acceptance rates are 2.54 percent for FastV and 1.27 percent for SCOPE. Someone responsible for answer quality would want that column alongside the energy measurement.

These results come from three group-disjoint draws of 210 queries, on one GPU. If I had shown you only the avoidance column, FastV would have looked like the obvious choice for saving energy. Which measurement would you put in a procurement report? And if a computation can move between devices, whose meter would you read?

## 27:00–28:00 · Ongoing work — Who Bears the Cost?

> Point to proposal, execution, and accounts on the original flowchart. In the short example below it, clear **Your GPU is busy**. Allow about 12 seconds. [Original project flowchart](https://stats201-research-atlas.vercel.app/#cost-architecture)

This is the question in our ongoing project. A gateway proposes sending a request to your GPU. In the example, it is busy, so an available institutional GPU takes the request. Now I’ll make your GPU available. The proposal is the same, but this time the work runs on your device. The energy account follows the machine that ran it. We want a record that lets a user or an institution reconstruct that change and see which party was assigned the resource use.

## 28:00–30:00 · Discussion

We began with a rooftop and a financing rate. Keeping the equipment fixed and changing that rate changed the electricity price the developer needed. In Shanghai a physical check changed the supply credited to a producer. In Jeju a change in the reward changed the kind of supply a policy backed. And in Rio we could test an energy-saving claim because someone measured electricity on the GPU.

Each case suggests a practical question you can ask of a machine learning study. Pick one quantity the researchers chose to represent. Who would notice first if that choice changed? Would it be the person who receives a payment, the buyer waiting for a trade, or the person whose device runs the model?

> Ask the question shown on screen. Leave 35–45 seconds for a response. If someone names a party, ask which recorded quantity would let them check their prediction. [Discussion](https://stats201-research-atlas.vercel.app/#discussion)

Thank you. I’d be glad to return to any figure you’d like to examine together.

## For questions after the talk

- The finance matrix lets you hold the rate fixed and change the life. The ATB cost inputs, capacity factors, and zero-NPV equation sit below the curve. [Financing studio](https://stats201-research-atlas.vercel.app/#finance-studio)
- For a second governance example, **Planner adjustment** at 01:00 takes proposed liquidity from 93.1% to 40.0%. The full 24-hour record is linked below the figure. [Recorded action](https://stats201-research-atlas.vercel.app/#eval-replay)
- On LLaVA 7B, SCOPE’s measured change is −11.87%. Select the same method on both model sizes to inspect the estimates and intervals. [Replication results](https://github.com/SeanWan514/ViRel-Budget#-main-finding)
- Each research image opens at full resolution. Use the left and right arrows to move among the originals in that chapter and Escape to return. [Paper directory](https://stats201-research-atlas.vercel.app/#sources)
