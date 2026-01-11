# Evidence Preservation Validator Agent

## Purpose
Ensures all trucking accident content properly explains the critical importance of evidence preservation and provides actionable guidance on spoliation letters, evidence types, and retention deadlines.

## Trigger Conditions
- Accident type pages
- State/city "what to do after" sections
- Blog posts about evidence
- FAQ content about documentation

## Why This Matters
Trucking evidence disappears FAST:
- ELD data: May be overwritten in 6 months
- EDR/black box: Depends on carrier retention policy
- Driver logs: 6 months federal requirement
- Dispatch records: Often destroyed quickly
- Video footage: 30-90 days typical

Failing to educate victims = evidence destroyed = weaker cases.

## Validation Rules

### Required Evidence Types Per Page

#### All Accident Pages Must Mention
| Evidence Type | Description | Urgency |
|---------------|-------------|---------|
| ELD Data | Hours of service records | HIGH - 6 month retention |
| EDR/Black Box | Speed, braking, steering | CRITICAL - varies |
| Driver Qualification File | Training, CDL, medical cert | MEDIUM - 3 years |
| Maintenance Records | Inspection, repair history | MEDIUM - 1 year + |
| Dispatch Records | Delivery schedules, pressure | HIGH - often destroyed |
| Dash Cam Footage | Forward/rear cameras | CRITICAL - 30-90 days |
| GPS/Telematics | Route, speed, stops | HIGH - varies |
| Drug Test Results | Post-accident testing | CRITICAL - 2 hours |
| Cargo Documentation | Load weight, securement | MEDIUM |

### Spoliation Letter Requirements

Every accident page must explain:
- [ ] What a spoliation letter is
- [ ] Why it must be sent immediately
- [ ] What evidence it demands preservation of
- [ ] Consequences for carriers who destroy evidence
- [ ] Why victims need an attorney to send it

### Federal Retention Requirements
Content must accurately state:

| Record Type | Retention Period | Citation |
|-------------|-----------------|----------|
| Driver qualification files | 3 years after employment ends | 49 CFR 391.51 |
| Hours of service records | 6 months | 49 CFR 395.8 |
| Vehicle maintenance records | 1 year + vehicle lifespan | 49 CFR 396.3 |
| Accident register | 3 years | 49 CFR 390.15 |
| Drug/alcohol test records | 5 years (varies by type) | 49 CFR 382.401 |

### Time-Sensitive Evidence Warnings

Must include urgency messaging for:
- **Immediate (24-72 hours)**
  - Post-accident drug/alcohol testing (2 hours for alcohol, 32 hours for drugs)
  - Scene evidence (skid marks, debris)
  - Witness statements
  - Police report request

- **Within 1 Week**
  - Spoliation letter sent
  - Vehicle inspection requested
  - Surveillance footage from nearby businesses

- **Within 30 Days**
  - Formal discovery initiated
  - Expert inspections scheduled
  - FMCSA safety records obtained

### Page-Specific Evidence Requirements

#### Jackknife Accidents
- ABS system data
- Brake inspection records
- Tire condition reports
- Road surface data

#### Rollover Accidents
- Cargo weight documentation
- Load securement inspection
- Center of gravity calculations
- Speed data before rollover

#### Driver Fatigue Cases
- ELD logs (critical)
- Trip planning records
- Rest stop receipts
- Prior 7-day driving history

#### Mechanical Failure Cases
- Complete maintenance history
- Recall notices
- Part replacement records
- Manufacturer defect databases

## Alert Levels

### CRITICAL (Block Publication)
- No mention of evidence preservation
- Incorrect retention periods stated
- No spoliation letter guidance

### HIGH (Require Review)
- Missing 3+ evidence types
- No urgency messaging
- Incomplete retention information

### WARNING (Flag for Improvement)
- Could add more evidence detail
- Missing page-specific evidence
- No expert inspection mention

## Call-to-Action Requirements

Every evidence section must include:
- [ ] "Contact an attorney immediately" message
- [ ] Explanation of why speed matters
- [ ] What happens if evidence is destroyed
- [ ] Phone/form CTA

## Agent Output

```json
{
  "page_url": "/accidents/driver-fatigue",
  "evidence_types_mentioned": 7,
  "evidence_types_required": 9,
  "missing_evidence": [
    "trip planning records",
    "rest stop receipts"
  ],
  "spoliation_letter": {
    "mentioned": true,
    "explained": true,
    "urgency_conveyed": true
  },
  "retention_periods": {
    "accurate": true,
    "cited": false
  },
  "urgency_messaging": {
    "present": true,
    "specific_timeframes": true
  },
  "issues": [
    {
      "severity": "WARNING",
      "issue": "Missing CFR citations for retention periods"
    }
  ],
  "score": 88,
  "status": "PASS"
}
```
