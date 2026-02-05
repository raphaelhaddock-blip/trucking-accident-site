# Differentiation Rules for Trucking Accident Site

## Purpose

This document defines **testable rules** with unique IDs to prevent duplicate/doorway content across 50 state pages, 1,615 city pages, and accident type pages. Every content generation agent and human reviewer gates content against these rules.

**The problem:** SEO audit flagged 2,294 duplicate content issues and 8/10 doorway page risk. These rules codify the fix.

**References (do not duplicate — this doc adds testable rule IDs):**
- `docs/STATE_CONTENT_SPEC.md` — detailed state page structure
- `docs/CITY_CONTENT_SPEC.md` — detailed city page structure
- `docs/TRUCKING_SEO_ARCHITECTURE.md` — audit findings

---

## The Swap Test

**If you can swap the location name and the content still makes sense, it fails.**

### FAILS the Swap Test

> "Truck accidents in [CITY] are dangerous. If you've been injured in an 18-wheeler crash, contact a truck accident lawyer today."

This sentence works for any of our 1,615 cities. It is worthless.

### PASSES the Swap Test

> "The I-10/I-35 interchange in San Antonio sees 47,000 trucks daily — the highest volume at any Texas intersection. The cloverleaf design at Exit 574 forces 80,000-lb rigs into 25-mph curves, contributing to 23 jackknife incidents in 2023 alone."

You cannot swap "San Antonio" with "Houston" and have this be true. The interchange, exit number, curve design, truck count, and crash data are all unique.

### Apply the Swap Test to Every Section

Before approving content, mentally swap the location with a neighboring city or state. If the paragraph still reads correctly, **reject it**.

---

## State Page Rules: S1–S5

Every state page must satisfy all five rules. Failure on any rule = content rejected.

### S1: Specific Trucking Corridors with AADT Truck Counts

**Rule:** Name 4–5 interstate corridors with **specific AADT truck traffic counts** and **mile markers** for danger zones within the state.

**Passes S1:**
> "I-95 (New Jersey Turnpike) carries 42,000 trucks daily near Exit 14. The express/local merge zone at MM 78–82 is the state's most dangerous truck corridor."

**Fails S1:**
> "Several major interstates cross the state, carrying heavy truck traffic."

**Data source:** State DOT traffic count maps, FHWA TMAS database.

### S2: State Comparative Negligence Type + Statute Citation

**Rule:** State the **exact negligence standard** (pure comparative, modified 50%, modified 51%, contributory) with the **statute citation** and explain its practical impact on truck accident claims.

**Passes S2:**
> "New Jersey follows modified comparative negligence under N.J.S.A. 2A:15-5.1. If you are more than 50% at fault, you recover nothing. In truck cases, carriers frequently argue the driver changed lanes unsafely to shift fault above the 50% bar."

**Fails S2:**
> "The state uses a comparative negligence system that may reduce your recovery."

### S3: State DOT Truck Fatality Data (FARS Source, Specific Year)

**Rule:** Cite **FARS-sourced fatality data** for the state with a **specific year or range**, the state's **national ranking**, and **year-over-year trend**.

**Passes S3:**
> "Texas recorded 806 large-truck fatalities in 2022 (FARS), ranking #1 nationally. This represents a 14% increase from 2019, driven by growth in Permian Basin oilfield traffic."

**Fails S3:**
> "This state has one of the highest rates of truck accidents in the country."

**Data source:** NHTSA FARS Encyclopedia, FMCSA Pocket Guide to Large Truck and Bus Statistics.

### S4: Named Distribution Centers / Ports / Intermodal Facilities

**Rule:** Name **3+ specific facilities** (company name + city) that generate truck traffic in the state, with volume metrics where available.

**Passes S4:**
> "Port Newark–Elizabeth handled 7.9 million TEUs in 2023, ranking #1 on the East Coast. Amazon operates 12 fulfillment centers across New Jersey, including the 1.2M-sq-ft Robbinsville facility (EWR4) dispatching 600+ trucks daily."

**Fails S4:**
> "The state is home to several major distribution centers and port facilities."

### S5: State-Specific Trucking Regulations Beyond Federal FMCSR

**Rule:** Cite at least **one state-level trucking regulation** that goes beyond the federal FMCSR baseline (weight limits, routing restrictions, hazmat rules, chain laws, toll requirements).

**Passes S5:**
> "California's CARB rule requires all trucks entering the state to meet 2010-or-newer emission standards (13 CCR § 2025). Oregon charges weight-mile taxes on trucks over 26,000 lbs instead of fuel taxes (ORS 825.474)."

**Fails S5:**
> "Trucking companies must follow federal and state regulations."

---

## City Page Rules: C1–C6

Every city page must satisfy all six rules. These ensure no two city pages are interchangeable.

### C1: County Courthouse Name + Address (State and Federal)

**Rule:** Name the **specific courthouse** (with street address) where a truck accident lawsuit would be filed, for both state and federal court.

**Passes C1:**
> "Truck accident lawsuits in Newark are filed at Essex County Superior Court, 465 Dr. Martin Luther King Jr. Boulevard. Federal claims go to the U.S. District Court for the District of New Jersey, Newark Vicinage, at 50 Walnut Street."

**Fails C1:**
> "You can file a lawsuit in the local state or federal court."

### C2: 2+ Named Local Hospitals / Trauma Centers

**Rule:** Name at least **two hospitals or trauma centers** that treat truck accident victims in the area, including **trauma level designation** where applicable.

**Passes C2:**
> "Level I trauma care is available at University Hospital (150 Bergen Street, Newark) and Hackensack University Medical Center. Helicopter transport from I-78 crash scenes typically routes to University Hospital's helipad."

**Fails C2:**
> "Several hospitals in the area can treat serious injuries from truck accidents."

### C3: Named Local Trucking Companies / Distribution Centers

**Rule:** Name at least **two trucking companies, carriers, or distribution centers** physically operating in or near the city.

**Passes C3:**
> "Edison's logistics corridor along I-287 includes Amazon's EWR9 fulfillment center (1 Applegate Drive, 500+ trucks daily), FedEx Ground's Kilmer Road sort facility, and XPO Logistics' cross-dock terminal."

**Fails C3:**
> "Many trucking companies operate in and around this city."

### C4: Highway Mile Markers Within City Limits

**Rule:** Reference **specific mile markers** for highways passing through the city, including entry/exit points and known danger zones.

**Passes C4:**
> "I-78 enters Newark at MM 52 and exits at MM 58. The weave section at MM 54–56, where three lanes narrow to two near the Garden State Parkway interchange, accounts for 40% of the city's truck crashes on this corridor."

**Fails C4:**
> "Major highways pass through the city with heavy truck traffic."

### C5: City-Specific FARS Fatality Data (Not State-Level)

**Rule:** Cite **city- or county-level** truck fatality data, not the state total. Include a comparison to the state average.

**Passes C5:**
> "Essex County recorded 27 truck-involved fatalities from 2019–2023 (FARS), a rate 2.3x the New Jersey state average per capita. The 2022 count of 8 was the highest in a decade."

**Fails C5:**
> "New Jersey had over 80 truck fatalities last year." *(This is state-level data on a city page.)*

**Data source:** FARS query filtered by county/city, state DOT crash databases.

### C6: Local Economic Drivers Generating Truck Traffic

**Rule:** Explain **why trucks are on these specific roads** by naming local industries, employers, or economic factors unique to this city.

**Passes C6:**
> "Newark's truck traffic is driven by Port Newark–Elizabeth Marine Terminal (3,500 truck trips daily), Newark Liberty Airport cargo operations (1.4M tons annually), and the Anheuser-Busch brewery on US-1/9 receiving grain shipments by truck."

**Fails C6:**
> "The city's growing economy means more trucks on the road every year."

---

## Accident Type Page Rules: A1–A5

Every accident type page (jackknife, underride, rollover, etc.) must satisfy all five rules.

### A1: Specific FMCSA Regulation Citation (49 CFR Section)

**Rule:** Cite at least **one specific 49 CFR section** relevant to this accident type, with the regulation's substance explained.

**Passes A1:**
> "Underride crashes are governed by 49 CFR § 393.86, which requires rear impact guards on trailers manufactured after January 1998. The guard must withstand a force of 50,000 lbs at the P1 test point. NHTSA proposed strengthening this rule in 2024 after IIHS crash tests showed 30% of guards fail at highway speeds."

**Fails A1:**
> "Federal regulations require safety equipment on trucks to prevent these types of accidents."

### A2: Physics/Mechanics of How the Accident Occurs

**Rule:** Explain the **physical mechanism** — forces, speeds, weight dynamics — that causes this specific accident type. Not just "what happens" but **why it happens**.

**Passes A2:**
> "A jackknife occurs when the drive axle tires lose traction, allowing the trailer to swing forward on the kingpin. At 55 mph, an 80,000-lb combination vehicle generates enough rotational momentum that once the trailer exceeds a 15° angle to the tractor, recovery is nearly impossible. The entire rig can sweep across three lanes in under 4 seconds."

**Fails A2:**
> "A jackknife accident happens when the trailer swings out to the side of the truck."

### A3: Vehicle-Specific Factors (Weight, Braking Distance, Blind Spots)

**Rule:** Include **quantified vehicle characteristics** specific to this accident type — braking distances, weight differentials, blind spot dimensions, or load factors.

**Passes A3:**
> "A fully loaded 18-wheeler at 80,000 lbs requires 525 feet to stop from 65 mph — nearly twice the distance of a passenger car. In rear-end collisions, this weight differential means the truck delivers 20–30x the kinetic energy of a car-to-car impact."

**Fails A3:**
> "Large trucks are much heavier than passenger vehicles, making accidents more dangerous."

### A4: Evidence Types Unique to This Accident (ELD, EDR, Dispatch Logs)

**Rule:** Identify **specific evidence sources** that are critical to proving liability in this accident type, beyond generic "gather evidence" advice.

**Passes A4:**
> "Jackknife cases require the truck's ECM (Engine Control Module) data showing speed, brake application, and ABS activation in the seconds before the event. The carrier's ELD records (mandated by 49 CFR § 395.8) reveal whether the driver was within HOS limits. Dispatch logs may show pressure to meet unrealistic delivery windows."

**Fails A4:**
> "Collect evidence from the scene and get a copy of the police report."

### A5: Settlement/Verdict Ranges by Injury Severity

**Rule:** Provide **realistic dollar ranges** broken down by injury severity tier, with a disclaimer that outcomes vary.

**Passes A5:**
> "Underride accident settlements typically range from $500K–$2M for survivors with disfigurement, $2M–$10M for traumatic brain injury or paralysis, and $3M–$15M+ for wrongful death. The 2023 Jimenez v. Werner Enterprises verdict in Texas ($14.8M) involved a rear underride where the guard failed on impact."

**Fails A5:**
> "Settlements for truck accidents can range from thousands to millions of dollars."

---

## Liability Party Rules: P1–P3

These rules apply to any page discussing liable parties in trucking accidents.

### P1: All Applicable Liable Parties Identified

**Rule:** Identify **all potentially liable parties** for the relevant accident type — not just "the truck driver." The standard set includes: driver, motor carrier, freight broker, shipper/loader, vehicle/parts manufacturer, maintenance contractor, and government entity (if road design is a factor).

**Passes P1:**
> "In a jackknife caused by brake failure, liable parties may include: (1) the driver for operating with known mechanical issues, (2) the carrier under respondeat superior and for negligent maintenance, (3) the maintenance contractor who last serviced the brakes, and (4) the brake component manufacturer if a defect contributed to failure."

**Fails P1:**
> "The truck driver and trucking company may be liable for the accident."

### P2: Basis for Each Party's Liability Explained

**Rule:** For each liable party identified in P1, state the **legal theory** supporting liability (negligence, vicarious liability, strict liability, breach of FMCSR, negligent hiring/retention).

**Passes P2:**
> "The carrier is liable under two theories: (1) respondeat superior — the driver was acting within the scope of employment, and (2) direct negligence — the carrier failed to conduct the pre-trip inspection required by 49 CFR § 396.13, which would have revealed the worn brake pads."

**Fails P2:**
> "Multiple parties can be held responsible under the law."

### P3: Insurance Layer Structure Explained

**Rule:** Explain the **insurance coverage layers** available in trucking cases — federal minimum ($750K for general freight under 49 CFR § 387.9), excess/umbrella policies, cargo insurance, and shipper/broker coverage.

**Passes P3:**
> "Federal law requires carriers hauling general freight to maintain at least $750,000 in liability coverage (49 CFR § 387.9). Hazmat carriers must carry $1M–$5M depending on cargo class. Major carriers like Werner and J.B. Hunt typically carry $50M–$100M in combined primary and excess coverage, creating multiple insurance layers available to victims."

**Fails P3:**
> "Trucking companies carry insurance that may cover your damages."

---

## FAQ Rules: F1–F3

These rules govern FAQ sections across all page types.

### F1: No Duplicate Questions Across Pages

**Rule:** The same FAQ question (or a trivially reworded version) must not appear on more than one page. Maintain a **FAQ registry** to track assignments.

**Passes F1:**
- State page: "What is the statute of limitations for truck accident lawsuits in Texas?" *(state-level framing)*
- City page: "Where do I file a truck accident lawsuit in Houston?" *(city-level framing, different question)*

**Fails F1:**
- State page: "How long do I have to file a truck accident lawsuit?"
- City page: "What is the deadline for filing a truck accident claim?" *(Same question, different words)*

### F2: Location-Specific Framing in Every Answer

**Rule:** Every FAQ answer must reference **location-specific details** — court names, statute citations, local facilities, or geographic features. No answer should be transplantable to another location.

**Passes F2:**
> "In Houston, truck accident lawsuits are typically filed in Harris County District Court at 201 Caroline Street. For cases involving out-of-state carriers, the U.S. District Court for the Southern District of Texas (Houston Division) at 515 Rusk Avenue is often preferred for faster dockets."

**Fails F2:**
> "You should file your lawsuit in the appropriate court in your area. An attorney can help you determine the right venue."

### F3: Legal Specificity with FMCSA Citations in Answers

**Rule:** FAQ answers involving regulations, liability, or evidence must cite **specific FMCSA regulations (49 CFR sections)** or **state statutes** — not generic "federal law" references.

**Passes F3:**
> "Under 49 CFR § 395.8, truck drivers must record their hours of service on an electronic logging device (ELD). This data is stored for 6 months and can prove a driver exceeded the 11-hour daily driving limit (49 CFR § 395.3)."

**Fails F3:**
> "Federal law requires truck drivers to keep records of their driving hours."

---

## Cross-Reference Rules: X1–X2

These rules prevent content silos and ensure proper internal linking.

### X1: State Pages Link to Relevant City and Accident Type Pages

**Rule:** Every state page must link to **5+ city pages** in that state and **3+ accident type pages** relevant to the state's common crash patterns.

**Passes X1:**
> Texas state page links to Houston, Dallas, San Antonio, Austin, El Paso city pages AND links to jackknife accidents (I-10 desert wind corridor), rollover accidents (Permian Basin oilfield roads), and hazmat spills (Gulf Coast refinery routes).

**Fails X1:**
> Texas state page contains zero links to city or accident type pages.

### X2: Accident Type Pages Link to States Where Most Common + "Where This Happens" Section

**Rule:** Every accident type page must include a **"Where This Happens"** section linking to **3+ state pages** where this accident type is particularly prevalent, with data explaining why.

**Passes X2:**
> Jackknife accidents page includes: "Jackknife crashes concentrate on mountain passes (Colorado I-70), icy corridors (Ohio I-90), and high-wind zones (Texas I-10 west of El Paso). Texas leads the nation with 142 jackknife incidents in 2022, followed by California (118) and Pennsylvania (97)."

**Fails X2:**
> Jackknife accidents page makes no reference to where these accidents are geographically concentrated.

---

## Validation Checklists

### State Page Checklist

| Rule | Check | Pass/Fail |
|------|-------|-----------|
| S1 | 4–5 corridors with AADT truck counts and mile markers? | |
| S2 | Negligence standard + statute citation + practical impact? | |
| S3 | FARS fatality data with year, national rank, and trend? | |
| S4 | 3+ named facilities (company + city + metric)? | |
| S5 | 1+ state trucking regulation beyond federal FMCSR? | |
| F1 | No FAQ questions duplicated from other pages? | |
| F2 | Every FAQ answer location-specific? | |
| F3 | FMCSA/statute citations in legal FAQ answers? | |
| X1 | 5+ city links and 3+ accident type links? | |
| **Swap Test** | Could any section work for a different state? | |

### City Page Checklist

| Rule | Check | Pass/Fail |
|------|-------|-----------|
| C1 | State + federal courthouse name and address? | |
| C2 | 2+ named hospitals/trauma centers? | |
| C3 | 2+ named local trucking companies/DCs? | |
| C4 | Highway mile markers within city limits? | |
| C5 | City/county FARS data (not state-level)? | |
| C6 | Local economic drivers generating truck traffic? | |
| F1 | No FAQ questions duplicated from other pages? | |
| F2 | Every FAQ answer location-specific? | |
| F3 | FMCSA/statute citations in legal FAQ answers? | |
| **Swap Test** | Could any section work for a different city? | |

### Accident Type Page Checklist

| Rule | Check | Pass/Fail |
|------|-------|-----------|
| A1 | Specific 49 CFR section cited and explained? | |
| A2 | Physics/mechanics of how accident occurs? | |
| A3 | Quantified vehicle factors (weight, braking, blind spots)? | |
| A4 | Evidence types unique to this accident? | |
| A5 | Settlement/verdict ranges by injury severity? | |
| P1 | All applicable liable parties identified? | |
| P2 | Legal theory for each party's liability? | |
| P3 | Insurance layer structure explained? | |
| F1 | No FAQ questions duplicated from other pages? | |
| X2 | "Where This Happens" section with 3+ state links? | |
| **Swap Test** | Could this content describe a different accident type? | |

---

## Examples: Differentiation in Practice

### State Differentiation: Texas vs. New Jersey

**Texas S1:**
> "I-35 carries 34,000 trucks daily through the San Antonio–Austin corridor (AADT at MM 210). I-10 west of El Paso traverses 150 miles of open desert where sustained 40+ mph crosswinds cause 60+ rollovers annually."

**New Jersey S1:**
> "The New Jersey Turnpike (I-95) carries 42,000 trucks daily near Exit 14, the highest truck volume of any interchange on the East Coast. The express/local merge zone at MM 78–82 sees 3x the crash rate of adjacent sections."

These are not interchangeable. Each names corridors, mile markers, and traffic counts unique to that state.

### Accident Type Differentiation: Jackknife vs. Underride

**Jackknife A2:**
> "When drive axle tires lose traction — from wet pavement, sudden braking, or oversteering — the trailer's momentum pushes it forward past the tractor. At 55 mph, the trailer can swing 90° in under 4 seconds, sweeping across three highway lanes."

**Underride A2:**
> "When a passenger vehicle strikes the rear or side of a trailer, it can slide beneath the trailer bed. The trailer floor sits 4 feet above the roadway — above a car's crumple zones and airbag sensors — causing the vehicle roof to shear off at the windshield line."

Different physics, different mechanisms, different injuries. Not swappable.

---

## Monitoring

### Monthly

- **Swap Test Audit:** Pick 5 random city pages. Attempt to swap city names between each pair. Any section that still reads correctly = violation flagged for rewrite.
- **FAQ Registry Check:** Scan for duplicate or near-duplicate questions across all pages. Deduplicate and reassign.

### Quarterly

- **Full Rule Compliance Audit:** Run all checklists (S1–S5, C1–C6, A1–A5, P1–P3, F1–F3, X1–X2) against 10% random sample of pages.
- **FARS Data Refresh:** Update fatality data when new FARS annual file is released (typically Q4 for prior year).
- **New Facility Check:** Verify named distribution centers, carriers, and hospitals are still operational. Update closures/openings.

### On Every Content Generation

- Run the page through the appropriate checklist (state/city/accident type) **before** publishing.
- Any rule failure = content returned for revision. No exceptions.
