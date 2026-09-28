# VoltIQ: capability audit and competitive gaps

> **Purpose.** What VoltIQ can honestly claim today, what the solar monitoring
> market treats as table stakes, and the gap between the two. Written so the
> website never claims a capability the codebase does not have.
>
> Companion docs: [SA_Competitor_List.md](SA_Competitor_List.md) ·
> [../website/Product_Deep_Links.md](../website/Product_Deep_Links.md) ·
> [../website/Product_5W_Strategy.md](../website/Product_5W_Strategy.md)
>
> **Last reviewed:** 28 September 2026. Source of truth for "have" claims is the
> VoltIQ repo at `build/VoltIQ`, verified against the code, not the marketing.

---

## 1. What VoltIQ actually has today

Every row below was verified in the VoltIQ codebase on the date above. These are
the only capabilities the website may state as fact.

| Capability | Evidence in the repo |
|---|---|
| Multi-brand cloud polling: Deye, Sunsynk, Luxpower, FoxESS | `voltiq/const.py` Provider enum; `voltiq/clients/{deye,sunsynk,luxpower,foxess}.py`; `api/services/poller.py`. **FoxESS confirmed production-live by the product owner on 28 September 2026**, not merely code-complete. |
| Normalised units and one sign convention across brands | `voltiq/models/` frozen Pydantic v2 models (W, kWh, V, A, C); sign convention documented in `CLAUDE.md` |
| Polling every 15 min 06:00-19:45 SAST, hourly 20:00-22:00 | `n8n/voltiq-morning-poll.json`; `docs/n8n-workflows.md` |
| Automated issue detection | `api/services/issue_detector.py`, `api/services/analyzer.py` |
| Upsell opportunity flagging, surfaced once per opportunity | `api/services/upsell.py`, `upsell_data.py`; design decision in `CLAUDE.md` |
| Co-branded WhatsApp morning reports, sent only when there is something to report | n8n workflows; design decision in `CLAUDE.md` |
| Live fleet feed endpoint (built, not used on the site) | `api/services/fleet_live.py`; `GET https://n8n.digitaloperations.co.za/webhook/fleet-live` (verified returning 200 with live data) |
| Provider credentials encrypted at rest | `api/security/encryption.py` (Fernet), stored as encrypted JSONB |
| Baseline / always-on load detection | `api/services/baseline_data.py`; commit `e9f18c7` |
| Charge-slot and TOU settings modelling | `voltiq/models/settings.py` (`ChargeSlot`, overnight slots supported) |
| Multi-tenant installer + system management | `api/routes/installers.py`, `api/routes/systems.py` |

---

## 2. What the market treats as standard

Drawn from the 2026 platform comparisons and vendor documentation cited at the
end of this document. This is the baseline an installer comparing VoltIQ against
SolarEdge Monitoring, Huawei FusionSolar, Solarman Business, Solytic, AlsoEnergy
or SurgePV will expect.

**Performance measurement**
- Performance Ratio (PR), actual against weather-corrected expected yield
- Specific yield in kWh/kWp
- System availability / uptime factor
- Degradation rate tracking over years
- Soiling index

**Detection depth**
- String-level monitoring, not just plant-level
- Peer-group comparison: each string scored against the cohort that should
  behave identically under the same weather
- Inverter error-code surfacing and remote diagnostics before a truck roll

**Workflow**
- O&M ticketing with assignment, status and SLA timers
- Work-order history per site
- Spares and stock planning against predicted failures

**Commercial**
- Tariff-aware savings and cost reporting, including time-of-use
- Customer-facing portals with restricted logins
- White-label reports and branding

**Integration**
- Documented public API and CSV export
- IEC 61724-1 alignment for data exchange
- Weather data ingestion for irradiance-corrected expectations

---

## 3. The gaps

Ranked by how often an installer will ask about them.

### 3.1 Blocking gaps (a competitor will win the deal on these)

| Gap | Why it matters | Effort signal |
|---|---|---|
| **No Performance Ratio or weather-corrected expected yield** | PR is the single number commercial customers and financiers ask for. Without irradiance data VoltIQ cannot say whether underproduction is the weather or a fault. | Needs a weather/irradiance data source plus per-site kWp. Significant. |
| **No string-level monitoring** | VoltIQ reads what the manufacturer cloud exposes at system level. Competitors detect a single failed string weeks before it shows in monthly totals. | Constrained by what each upstream API exposes. Investigate per provider. |
| **No O&M ticketing or SLA tracking** | Detection without workflow means the installer still manages callouts in WhatsApp and a spreadsheet. This is the "who, when, how" layer every O&M buyer expects. | Meaningful build: work orders, assignment, status, history. |
| **No public API or data export** | Larger installers want CSV out and API access for their own BI. Currently there is no customer-facing API surface. | Moderate. The FastAPI service exists; this is auth, docs and rate limiting. |

### 3.2 Competitive gaps (raised in evaluation, not usually deal-breaking)

| Gap | Notes |
|---|---|
| **No customer-facing portal with logins** | VoltIQ Home is a WhatsApp report only. FusionSolar and others let the installer create a restricted owner account. Our WhatsApp-only approach is defensible as a deliberate choice, but say so rather than leave it looking like an omission. |
| **No degradation or soiling tracking** | Both need long baselines. We now have the baseline machinery (`baseline_data.py`) so this is closer than it looks. |
| **No specific yield (kWh/kWp)** | Needs per-site installed kWp captured at onboarding. Cheap to add and unlocks peer comparison. |
| **No documented uptime/availability metric** | We exclude upstream outages from our uptime target in the terms but publish no availability figure for the systems themselves. |
| **No weather data ingestion** | Prerequisite for PR, and for cutting false positives on overcast days. |
| **No spares or stock planning** | Referenced in the marketing render pack (shot B11) but not built. |

### 3.3 Things we have but do not productise

These are the most valuable near-term wins because the hard part is done.

| Capability | Current state | What is missing |
|---|---|---|
| **Consumption forensics** (always-on load detection, TOU grid-charge timing, import/export attribution) | Proven on a real customer engagement. Reports live at `VoltIQ/docs/reports/christof-sander/`. The generator scripts were lost in a scratchpad wipe; the reports are now static HTML. | No repeatable pipeline, no UI, no productised deliverable. This is currently a consulting output, not a feature. **Do not put it on the website until it is productised.** |
| **Live fleet feed** | Built and live (`fleet_live.py`, public webhook, verified returning 200). Not used on the website: the landing page deliberately shows no live figures. | Scoped to one hardcoded installer id. Not per-customer, not authenticated for third-party use. Available if a live display is ever wanted. |
| **Charge-slot / TOU settings** | Modelled in `voltiq/models/settings.py`. | Not surfaced as analysis or recommendation anywhere in the product. The "grid charging is mistimed, costing R800 to R1,500 a season" finding came from manual analysis. |

---

## 4. Rules for the website

1. **Never claim PR, string-level detection, ticketing, or an API.** None exist.
2. **Never claim consumption forensics or TOU optimisation as a product feature.**
   It has been delivered once, by hand. It is a services conversation, not a
   tier feature.
3. **"AI suggestions" must be described by what they are built on**, which is the
   fleet's own telemetry, baselines and history. No LLM or model provider appears
   anywhere in the VoltIQ dependency tree. Describe the input, not the technology.
4. **Early fault warnings carry the same advisory framing as issue alerts.** See
   the VoltIQ tab in `products-terms.html`.
5. **The four supported brands are Deye, Sunsynk, Luxpower and FoxESS.** Nothing
   else may be named as supported. All four are production-live; FoxESS was
   confirmed by the product owner on 28 September 2026, so the claim on
   `products-terms.html` is sound.
6. **No live figures on the page.** A working live-fleet endpoint exists and was
   trialled on the landing page, then removed by decision. If it is ever put back,
   it reports one customer fleet, not the whole VoltIQ install base, and must be
   labelled as such.

---

## 5. Recommended sequence

1. **Capture installed kWp at onboarding.** One field. Unlocks specific yield and
   peer comparison, which is the cheapest step toward PR.
2. **Add a weather/irradiance source.** Prerequisite for PR and the single biggest
   reducer of false positives.
3. **Productise consumption forensics.** We have already proven the analysis is
   worth paying for. Rebuilding it as a pipeline turns a consulting job into a
   Fleet-tier feature and is genuinely differentiated against the generic
   monitoring platforms.
4. **Ticketing.** Closes the largest workflow gap against dedicated O&M software.
5. **Customer API and CSV export.** Unblocks the larger installers.

---

## Sources

- [Solar Fleet Management 2026, SurgePV](https://www.surgepv.com/blog/solar-fleet-management)
- [Solar Monitoring Systems Comparison 2026, SurgePV](https://www.surgepv.com/blog/solar-monitoring-systems-comparison)
- [PV Monitoring Platform 2026, SurgePV](https://www.surgepv.com/blog/pv-monitoring-platform)
- [Best Solar Management Software for EPCs and Asset Owners 2026, SurgePV](https://www.surgepv.com/best-solar-software/management)
- [PV Monitoring Software Comparison, Solytic](https://solytic.com/comparisons/pv-monitoring-software-comparison/)
- [String-Level Monitoring, DYNVOLT](https://www.dynvolt.com/blog/string-level-monitoring-underperformance-detection)
- [Monitoring Platforms for Solar Photovoltaic Systems, US Department of Energy](https://www.energy.gov/cmei/femp/monitoring-platforms-solar-photovoltaic-systems)
- [Data and monitoring requirements, Solar Best Practices](https://solarbestpractices.com/guidelines/detail/data-and-monitoring-requirements)
- [Huawei FusionSolar SmartPVMS overview](https://support.huawei.cn/enterprise/en/doc/EDOC1100462190/c39dc276/overview)
- [Best Solar O&M Software in 2026, list.solar](https://apps.list.solar/category/solar-project-asset-management/om-software/)
