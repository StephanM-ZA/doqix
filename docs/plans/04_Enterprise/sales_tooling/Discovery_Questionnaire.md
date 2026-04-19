# 03 — Enterprise Discovery Questionnaire

> The questions you ask before you quote. Split into two stages:
> (1) **Qualify Call** — 30–60 min, free
> (2) **Discovery Sprint** — 1–2 weeks, paid (R15K–R30K)

**Version:** 1.0 · **Date:** 2026-04-15

---

## STAGE 1 — QUALIFY CALL (free, 30–60 min)

**Goal:** Decide if they're a real opportunity. Don't scope solutions yet.

### Opening (2 min)
- "Thanks for booking. I've got 45 min. I want to understand your business, the pain, and whether we're a fit. No slides, no pitch — just questions. Cool?"

### A. The Company
1. Tell me about the business in 2 minutes. What do you do, who for, where?
2. How many staff? How many locations?
3. What's the growth stage — starting, scaling, optimising, restructuring?
4. What's driving the timing of this conversation? (What changed recently?)

### B. The Pain
5. Walk me through the workflow or problem that made you reach out.
6. Who owns this problem internally? Who's most affected by it?
7. How long has it been a problem? What's been tried before?
8. If nothing changes, what happens in the next 6–12 months?
9. What does "solved" look like? How would you measure it?

### C. The Stack
10. What tools does the team use daily? (Get specific names, not categories.)
11. Is there anything on-premise or legacy involved?
12. Any sacred cows — systems you absolutely won't replace?
13. Who owns IT decisions? Is there an internal tech team?

### D. The Buyer
14. Who else is involved in the decision?
15. Have you allocated budget, or is this still discovery for budgeting?
16. What's your timeline to have something live?
17. How have you bought similar services in the past? What went well/badly?

### E. Compliance & Risk
18. Any regulatory requirements? (POPIA, ISO, PCI, sector-specific?)
19. Any data that can't leave SA / can't touch cloud?
20. Do you need SSO, audit trails, role-based access?

### F. Close
21. "Based on what you've told me, here's what I'd recommend: a paid 1–2 week discovery sprint at R[15–30K]. We map your processes, identify priority workflows, and come back with a written proposal. The fee is credited against the build if you proceed. Does that feel like the right next step?"
22. If yes: schedule kickoff, send SOW for discovery.
23. If no: clarify what's missing, or disqualify politely.

### Qualification Scorecard (fill in after the call)

| Criterion | Score 1–5 |
|-----------|-----------|
| Clear, painful problem | ___ |
| Budget signal (not a "we'll see") | ___ |
| Timeline within 3 months | ___ |
| Decision-maker in the room (or easily accessible) | ___ |
| Tech stack we can work with | ___ |
| Realistic expectations | ___ |
| Cultural fit (they listen; they're coachable) | ___ |

**Total ≥ 25/35** → proceed to discovery sprint.
**18–24** → nurture, don't chase.
**< 18** → politely decline, refer elsewhere.

---

## STAGE 2 — DISCOVERY SPRINT (paid, 1–2 weeks)

**Goal:** Gather everything needed to quote accurately and write the proposal.

**Deliverables at end:**
- Process map (current state)
- Priority workflow list (3–8 workflows)
- Success metrics agreed
- Written proposal with 3 options
- Implementation roadmap

### Session 1 — Executive Framing (60 min, with decision-maker)

1. What's your 12-month plan for this business?
2. Where does operations/automation sit in that plan?
3. What does success look like one year after go-live?
4. What are the three things you absolutely cannot afford to break?
5. Who are the internal champions? Who might resist?
6. What's the political landscape — any departmental tensions we should know?

### Session 2 — Process Deep-Dive (90 min, with ops/team leads)

For each candidate workflow:

1. Walk me through the current process step by step.
2. Who does each step? How long does it take? How often?
3. Where does it break? What are the symptoms?
4. What's the volume — daily, weekly, monthly?
5. What systems are involved at each step?
6. What data moves between systems? What format?
7. What happens when something goes wrong today?
8. What's the ideal version of this process?
9. What would you measure to know it's working?

### Session 3 — Systems & Data (60 min, with IT/tech)

1. Full inventory of systems — SaaS and on-prem.
2. API availability per system? Docs?
3. Any existing integrations? (Zapier, Make, custom code, iPaaS?)
4. Authentication approach — SSO? Service accounts?
5. Data governance — who owns what, who can access what?
6. Backup & DR expectations.
7. Security review process — what do we need to clear?
8. Hosting constraints — must stay in SA? Client-hosted? Cloud OK?

### Session 4 — Volume & Scale (45 min, with ops)

1. Transaction volumes per workflow (today / 12 mo / 3 yr).
2. Peak vs average load.
3. Seasonality or predictable spikes.
4. User count — who will interact with automation outputs?
5. SLA expectations — uptime, response time, resolution time.

### Session 5 — Commercial & Contractual (60 min, with decision-maker + finance)

1. Budget envelope (setup + ongoing)?
2. Budget cycle — when does the financial year reset?
3. Procurement process — purchase orders, vendor onboarding, legal review?
4. Payment terms preference?
5. Contract term appetite — 1yr, 2yr, 3yr?
6. Insurance / indemnity requirements?
7. Exit/offboarding expectations if relationship ends?

### Internal Analysis (Do.Qix side, 2–3 days)

After sessions, internal team:
1. Map each workflow to complexity bucket (simple/medium/hard).
2. Identify integration risks.
3. Run the pricing calculator (02_Pricing_Calculator.md).
4. Draft three proposal options.
5. Prep implementation roadmap.
6. Red-team the proposal — what could go wrong? Priced in?

### Proposal Presentation (60–90 min)

- Walk through current state findings
- Present three options (Foundation / Growth / Partnership)
- Recommend one, explain why
- Handle objections
- Agree next step and timeline to decision

---

## Red Flags to Watch For

| Signal | What it means |
|--------|---------------|
| "We just need a quick automation" | They don't understand the complexity; scope creep incoming |
| "Can you do it by [unrealistic date]?" | Either they'll negotiate on quality or blame you when it slips |
| "Send me a quote without discovery" | Tire-kicker or price-shopper. Hold the line on paid discovery. |
| No named decision-maker | You're being used as a pricing benchmark |
| "Our last vendor was terrible" | Maybe true — or maybe they're the problem |
| "We've already decided what we need" | You're being asked to be an order-taker, not a partner |
| Pushback on every commercial term | Relationship will be adversarial. Price it in or walk. |

---

## Green Flags

- Named champion AND named economic buyer in the room
- Specific numbers when describing the pain ("costs us ~40 hours a week")
- Acknowledges past failures and what they learned
- Asks about our process, not just our price
- Willing to pay for discovery
- Brings their own problem framing, not a shopping list
