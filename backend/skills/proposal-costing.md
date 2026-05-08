# Skill: Proposal Costing — Civil Engineering Sub-Consultant

Called when generating a fee estimate from a parsed RFP. Produces a structured cost breakdown
by phase and line item, ready for reviewer sign-off and insertion into the Word proposal.

---

## STAFF ROLES & 2026 HOURLY RATES

| Code | Role | Rate |
|------|------|------|
| PE4  | Senior Engineer (PE IV) — review/QC | $240/hr |
| PE1  | Project Engineer (PE I) — engineering lead | $175/hr |
| EIT  | Engineer-in-Training | $140/hr |
| CS3  | Civil Tech / Designer (CS III / CT III) — CAD lead | $175/hr |
| CT2  | Civil Tech II (CS II) | $155/hr |
| CT1  | Civil Tech I (CS I) | $135/hr |
| PC   | PC/CC — field & construction (specs, QTO, inspections) | $170/hr |

**Role responsibilities:**
- **PE4**: High-level review only. Spends roughly 25–50% of PE1 time per line item.
- **PE1 + EIT**: Share the bulk of engineering/coordination work. EIT typically does slightly more hours; PE1 is about 50–75% of EIT time depending on complexity.
- **CS3**: All CAD-heavy work — drawing setup, servicing plans, grading plans, as-builts.
- **PC**: Everything field or contractor-facing — specs, quantity takeoffs, inspections, site walks, RFIs.

**General time-split rule (applies to most deliverables):**
- CS3 or PC does the base hours.
- PE1 ≈ 50% of base hours (more if technically demanding, e.g. stormwater modeling).
- PE4 ≈ 25–50% of PE1 hours (pure review).
- EIT shares load with PE1 or CS3 depending on whether it's engineering or CAD work.

---

## MEETINGS — CALCULATION FORMULA

Use the meeting counts extracted from the RFP (parse-rfp.md calculates these).

**Per meeting:**
- 1 hr PE1 + 1 hr EIT (or CS3) per meeting
- Add 0.5–1 hr PE4 per phase (not per meeting) for high-level participation

**For meetings with specified durations (e.g. "2-hour kickoff"):**
- Multiply the duration by 2 (one person each: PE1 + EIT)
- E.g. 2-hr kickoff = 2 hrs PE1 + 2 hrs EIT = 4 hrs total

---

## PHASE A — PRE-DESIGN VALIDATION

*Note: Pre-Design and Schematic Design should be costed as separate phases even if combined in
older Excel templates. Each is listed below.*

### Pre-Design Validation

| Code | Line Item | Hours & Roles | Scaling Notes |
|------|-----------|---------------|---------------|
| A1 | Project intro / kick-off meeting | Meeting formula (1 PE1 + 1 EIT per meeting) + 0.5 PE4 | Per meeting count in RFP |
| A2 | Project info review & setup | 7.5 PE1 or EIT + 2 hrs CS3 setup | Split in half if schematic design is a separate phase in the same engagement |
| A3 | Misc coordination, cost consultant coordination | 1 hr PE1 + 1 hr EIT per cost consultant deliverable | Max ~4 hrs total; taper down in later phases |

### Schematic Design

| Code | Line Item | Hours & Roles | Scaling Notes |
|------|-----------|---------------|---------------|
| A4 | Schematic meetings | Meeting formula | Per RFP meeting count |
| A5 | Concept servicing plans (per option) | **Large site (10+ acres, big parking lot):** 22.5 hrs CS3 + ~10 hrs PE1 + ~4 hrs PE4. **Medium site:** ~15 hrs CS3 + 7 hrs PE1 + 3 hrs PE4. **Simple site (small or mostly building footprint):** ~10 hrs CS3 + 4 hrs PE1 + 2 hrs PE4. | Multiply base if multiple concept options (e.g. ×3 options = 3× hours, but with some efficiency gain; use ~2.5×) |
| A6 | Class 4/5 cost consultant coordination | 1 hr PE1 + 1 hr EIT | Per cost estimate exercise required |
| A7 | Misc coordination / report coordination | 2 hrs PE1 + 2 hrs EIT | Catch-all |

---

## PHASE B — DESIGN DEVELOPMENT

| Code | Line Item | Hours & Roles | Scaling Notes |
|------|-----------|---------------|---------------|
| B1 | Kick-off meeting + pre-app meeting | Meeting formula based on specified durations | E.g. "2-hr pre-app" = 2 hrs PE1 + 2 hrs EIT each meeting |
| B1b | Design meetings (regular cadence) | 1 hr PE1 + 1 hr EIT per meeting + 0.5–1 hr PE4 per phase | From RFP meeting count |
| B2 | Project info review & CAD base setup | 7.5 hrs CS3 + 2–3 hrs PE1 | Always include; scale slightly for very large sites |
| B3 | Concept grading plan | **Large (10-acre, large parking lot):** 30 hrs CS3 + 4 hrs PE1 + 2 hrs PE4. **Medium:** 22.5 hrs CS3 + 4 hrs PE1 + 2 hrs PE4. **Simple (building fills site, minimal parking):** 12 hrs CS3 + 2 hrs PE1 + 1 hr PE4 | Parking lot area is the key driver, not building size |
| B3b | Grading revisions | 50% of concept grading hours, same role split | Always include |
| LEED | Civil LEED assessment (if required) | 4 hrs EIT + 7.5 hrs PE1 ≈ $1,750 | Only if leedRequired = true |
| B4 | Concept servicing plan (DP stage) | EIT: base hours. PE1: ~50% of EIT. PE4: ~50% of PE1. **Large:** 15 hrs EIT + 7.5 hrs PE1 + 4 hrs PE4. **Medium:** 10 hrs EIT + 5 hrs PE1 + 2 hrs PE4. **Small:** 5 hrs EIT + 2.5 hrs PE1 + 1 hr PE4 | Spec and grading go hand in hand |
| B5 | Civil specifications | 5 hrs PC + 1 hr PE1 (review) | Standard; always include |
| B6 | Quantity takeoffs | 7.5 hrs PC + 2 hrs PE1 (support/questions) | PE1 support was missing from template — add it |
| B7 | Costing coordination | 2 hrs PE1 + 2 hrs EIT | Per cost estimate exercise in this phase |
| B8 | DP response to comments (1 round) | **Large:** 3 hrs PE4 + 3 hrs PE1 + 15 hrs CS3 ≈ $3,570. **Medium:** 2 hrs PE4 + 2 hrs PE1 + 10 hrs CS3. **Small:** 1 hr PE4 + 1 hr PE1 + 5 hrs CS3 | One round always included; add second round only if RFP specifies |
| B9 | Project management / contingency | 5–10% of phase subtotal. Calculate total first, then set aside. Typically 3 hrs PE4 + 3 hrs PE1 + 3 hrs EIT for a $30K phase | Always include |
| B10 | Fire flow letter (if required) | 4 hrs EIT + 4 hrs PE1 = 8 hrs. Add 1–2 hrs each for response to city comments | Only if fire flow letter is in scope |

---

## PHASE C — CONSTRUCTION DOCUMENTATION (DSSP)

*Split into C (DSSP drawings) and D (ESC) in the Excel for clarity. Combine into one
"Construction Documentation" phase total in the proposal document.*

| Code | Line Item | Hours & Roles | Scaling Notes |
|------|-----------|---------------|---------------|
| C1 | Site servicing plan (deep utilities) | 10.5 hrs CS3 or EIT + 5 hrs PE1 + 1.5 hrs PE4 | Do NOT lump stormwater in here — keep separate |
| C2 | Meetings | Meeting formula from parsed meeting count | |
| C3 | Site grading (refined for SWM/storage) | 7.5 hrs CS3 + 2 hrs PE1 | Refining from DP grading based on SWM volumes |
| C4 | Stormwater management plan/design | More engineering-heavy than servicing. **Standard:** 15 hrs PE1 + 10 hrs EIT + 3 hrs PE4. **Large/complex:** 20 hrs PE1 + 15 hrs EIT + 5 hrs PE4 | Always separate from C1. Modeling, sizing pipe/pond/release rate |
| C5 | Stormwater management report (if required) | ~43.5 hrs total: 22.5 hrs PE1 + 15 hrs EIT + 6 hrs PE4. This is a full week of work | Not always required. Only if parsed RFP or user confirmed it's needed |
| C6 | Stormwater report revisions (1 round city comments) | 3 hrs PE1 + 3 hrs EIT | If C5 is included |
| C7 | Specification revisions & additions | 2 hrs PC + 1.5 hrs PE1 | Design has developed; update specs accordingly |
| C8 | QA/QC | 3 hrs PE1 + 3 hrs PE4 | Always include for any phase with drawing deliverables |
| C9 | Response to city comments (DSSP) | **Large:** 10 hrs CS3 + 4 hrs EIT + 2 hrs PE1 + 0.5 hrs PE4 ≈ $2,780. **Medium:** 5 hrs CS3 + 2 hrs EIT + 1 hr PE1. **Small:** 3 hrs CS3 + 1 hr EIT + 0.5 hr PE1 | One round; 2–3 days of people's time for large sites |

---

## PHASE D — CONSTRUCTION DOCUMENTATION (ESC)

*Combine with Phase C total in proposal document.*

| Code | Line Item | Hours & Roles | Scaling Notes |
|------|-----------|---------------|---------------|
| D2 | ESC drawings prep | 30 hrs EIT or CS3 | Applies when site > 0.4 ha (full ESC application, not letter) |
| D2b | ESC good housekeeping letter | ~5 hrs EIT + 1 hr PE1 | Only when site ≤ 0.4 ha |
| D3 | QA/QC | 2 hrs PE4 + 4 hrs PE1 | |
| D4 | PM | 2 hrs PE1 | |

**Total ESC sub-phase always ~$5,000–$6,000 for full application. Scale proportionally for letter.**

---

## PHASE E — PROCUREMENT SERVICES ASSISTANCE

| Code | Line Item | Hours & Roles | Scaling Notes |
|------|-----------|---------------|---------------|
| E1 | Site tender walk | 2.5 hrs EIT (1.5 hr meeting + 0.5 hr drive each way) | Always include if in scope |
| E2 | Respond to tender inquiries | 6 hrs PE1 or EIT | Per RFP assumption (e.g. "6 hours assumed") |
| E2b | Revise specs | 0.5 hrs PC + 1 hr PE1 | Minor at tender stage |
| E3 | Issue IFC + misc PM / contingency | 2 hrs PE4 + 6 hrs PE1 + 6 hrs EIT | Finalize drawings, answer last questions, contingency |
| E4 | Review & coordinate pre-procurement cost estimates | 2 hrs PE1 + 1 hr EIT | Add if RFP mentions cost coordination at tender |

---

## PHASE G — CONSTRUCTION ADMINISTRATION (INSPECTION & CONTRACT ADMIN)

*Note: Base this on the active CIVIL construction timeline, not the overall building timeline.*

| Code | Line Item | Hours & Roles | Scaling Notes |
|------|-----------|---------------|---------------|
| G1 | Review & respond to RFIs / change orders | Based on civil construction timeline. Assume ~1 hr/week civil. **6 months:** 22.5 hrs (15 PE1 + 7.5 EIT). **3 months:** ~10 hrs. **12 months:** 40 hrs | Civil active period only |
| G2 | Construction progress meetings | Meeting formula from RFP (use civil-appropriate cadence — every 3 weeks for civil sub). 1 hr PE1 + 1 hr EIT per meeting | |
| G3 | Review shop drawings | 3 hrs PE1 + 3 hrs EIT | Standard — always include |
| G4 | Construction coordination meeting (on-site) | 2.5 hrs PE1 | 2-hr meeting + 0.5 hr travel. Always include |
| G5 | Part-time inspections & documentation | Per visit: base PC hours (e.g. 3.75 hrs/visit). PE1 = 25% of PC hours. PE4 = 25% of PE1 hours. **Large site (lots of parking/pipe), 6 visits:** 22.5 hrs PC + 5.6 hrs PE1 + 1.4 hrs PE4. **Smaller, 4 visits:** 15 hrs PC + 3.75 PE1 + 0.94 PE4 | Scale visit count and hours per visit by site complexity |
| G6 | ESC inspections | $0 unless explicitly in scope | Not typically in civil sub scope |
| G7 | Project management / contingency | 15% of phase subtotal. Typically 4 hrs PE4 + 4 hrs PE1 + 4 hrs EIT | Always include |

---

## PHASE F — POST CONSTRUCTION SERVICES & WARRANTY

| Code | Line Item | Hours & Roles | Scaling Notes |
|------|-----------|---------------|---------------|
| F2 | CCC documents & inspection | Only if off-site surface improvements in scope. ~6 hrs PC + 1 hr PE1 | Skip if offsite = excluded |
| F3 | Warranty / deficiency inspection & report | **Large site:** 12 hrs PC + 2.5 hrs PE1. **Small site:** ~6 hrs PC + 1.5 hrs PE1. PC drives out twice (inspection + follow-up), writes report; PE1 assists | Scale by site area and complexity |
| F4 | As-built survey review & compliance drawings | **Tie-ins only (typical):** 0.5 hrs PE4 + 2 hrs PE1 + 2 hrs EIT = $750. **Off-site improvements:** scale up 3–4× | Submit utility tie-in compliance to city; coordinate with survey |
| F5 | As-built drawings preparation | **Standard (tie-ins only):** 10 hrs CS3 + 4 hrs PE1 + 1 hr PE4. **With off-site package:** scale up significantly | City submits redlines; tech interprets and updates |
| F6 | Contingency | 10% of phase subtotal | Always include |

---

## DISBURSEMENTS & FEES IN PROPOSAL

- **Disbursements**: 8% standard rate on applicable fees. **DO NOT list in the proposal.** Covered in terms and conditions. Only list phase subtotals and grand total (ex. GST).
- **GST**: 5%. Do not list in proposal.
- **Validity**: "Fees are valid through December 31, [year]."

---

## ITEMS THAT ARE CONDITIONAL / NOT ALWAYS INCLUDED

Add these only if confirmed in parsed RFP or user answers:

| Item | When to include | Where it goes |
|------|-----------------|---------------|
| LEED civil assessment | `leedRequired = true` | Phase B (Design Development) |
| Fire flow letter + city response | Confirmed by user or in RFP scope | Phase B |
| Stormwater management report | RFP requires DSSP/SWMP report | Phase C (separate line from design) |
| Sanitary servicing study | User confirmed `sanitary = yes` | Add as a separate line in Phase C or B depending on timing |
| ESC application vs. letter | Site > 0.4 ha → full application; ≤ 0.4 ha → letter | Phase D |
| CCC documents | Off-site improvements in scope | Phase F |
| Off-site improvements package | `offsite = yes` | Add separate line items to Phases C, D, F |
| Cost consultant coordination | Listed in RFP per phase | Add B7-equivalent in each applicable phase |

---

## OUTPUT FORMAT

Return a JSON object with this structure:

```json
{
  "phases": [
    {
      "phaseCode": "A",
      "phaseName": "Pre-Design Validation",
      "lineItems": [
        {
          "code": "A1",
          "description": "Kick-off and meetings",
          "hours": { "PE4": 0.5, "PE1": 2.0, "EIT": 2.0, "CS3": 0, "PC": 0 },
          "fee": 595,
          "notes": "2 meetings × 1 hr each per person + 0.5 PE4"
        }
      ],
      "subtotal": 4855,
      "pmContingency": 243,
      "phaseTotal": 5098
    }
  ],
  "grandTotal": 94500,
  "flags": [
    "Sanitary servicing study not costed — user indicated excluded",
    "Off-site improvements excluded per user answers"
  ]
}
```

Fees = sum of (hours × rate) for each role.
Round line item fees to nearest $5. Round phase subtotals to nearest $50.
Flag any deliverable from `parsed.phases` that could not be mapped to a line item above.
