# ELD & Black Box Content Checker Agent

## Purpose
Validates that content accurately explains Electronic Logging Devices (ELDs), Event Data Recorders (EDRs/black boxes), and other electronic evidence critical to truck accident litigation.

## Trigger Conditions
- Accident type pages (all)
- Evidence preservation sections
- Blog posts about truck data
- FAQ about electronic evidence
- "What to do after" content

## Why This Matters
Electronic evidence is often the most powerful proof in truck cases:
- ELD shows exact hours driven (HOS violations)
- EDR captures final seconds before crash (speed, braking, etc.)
- GPS shows route, stops, speed history
- Telematics can prove unsafe driving patterns

Attorneys who don't understand this evidence lose cases.

## Validation Rules

### ELD Content Requirements

#### What ELD Records (Must Explain)
| Data Type | Description | Litigation Value |
|-----------|-------------|-----------------|
| Driving time | Hours behind wheel | HOS violations |
| On-duty time | Total work hours | 14-hour window |
| Off-duty time | Rest periods | Fatigue analysis |
| Sleeper berth | Split sleeper use | Rest compliance |
| Location | GPS coordinates | Route verification |
| Engine hours | Total engine operation | Cross-reference |
| Miles driven | Odometer data | Distance verification |

#### ELD Mandate Details
- **Effective Date:** December 18, 2017 (full compliance)
- **Who Must Use:** Most interstate commercial motor vehicles
- **Exemptions:** Pre-2000 model year, short-haul, drive-away/tow-away
- **Registration:** Must be on FMCSA registered device list

#### ELD Tampering/Fraud
Must explain:
- Illegal to tamper with ELD
- Penalties for falsification
- How tampering is detected
- Common fraud schemes (unplugging, using exemptions)

### EDR/Black Box Content Requirements

#### What EDR Records (Must Explain)
| Data Type | Description | Timeframe |
|-----------|-------------|-----------|
| Speed | Vehicle speed | 5-30 seconds pre-crash |
| Brake application | Brake pedal use | Pre-crash |
| Throttle position | Accelerator use | Pre-crash |
| Steering input | Wheel position | Pre-crash |
| Seatbelt status | Buckled/unbuckled | At crash |
| Airbag deployment | Timing/force | At crash |
| ABS activation | Anti-lock engagement | Pre-crash |
| Engine RPM | Engine speed | Pre-crash |
| Delta-V | Change in velocity | At crash |

#### EDR vs ELD Distinction
Must clearly explain:
- **ELD:** Hours of service compliance device
- **EDR:** Crash event recorder (like airplane black box)
- **Different purposes, different data**
- **Both are critical evidence**

#### EDR Preservation Warning
- Not automatically preserved
- May be overwritten by subsequent events
- Carrier may retrieve and control data
- Spoliation letter critical

### Telematics/GPS Data

Must explain:
- Real-time vehicle tracking
- Speed monitoring
- Hard braking events
- Rapid acceleration
- Route deviation
- Idle time
- Fuel consumption

### Camera Systems

#### Dashcam Types
- Forward-facing (road view)
- Driver-facing (driver behavior)
- Side cameras (blind spots)
- Rear cameras (trailer)

#### Footage Retention
- Typically 30-90 days unless saved
- Triggered by hard braking/collision
- May be remotely accessible by carrier
- Critical to preserve immediately

## Alert Levels

### CRITICAL (Block Publication)
- Wrong ELD mandate date
- Confusing ELD with EDR
- Incorrect data types recorded
- Wrong preservation timeframes

### HIGH (Require Review)
- Missing EDR explanation
- Incomplete ELD data description
- No preservation urgency
- Missing camera/GPS evidence

### WARNING (Flag for Improvement)
- Could add more technical detail
- Missing telematics explanation
- No tampering/fraud discussion

## Technical Accuracy Requirements

### Must Be Correct
- ELD mandate: December 18, 2017
- EDR captures: 5-30 seconds typically
- ELD retention: 6 months minimum
- GPS accuracy: Within meters

### Must Not Claim
- All trucks have black boxes (not all do)
- All data survives crashes (can be damaged)
- ELD prevents all fraud (workarounds exist)

## Agent Output

```json
{
  "page_url": "/accidents/rear-end-collisions",
  "electronic_evidence_coverage": {
    "eld_explained": true,
    "eld_data_types": 5,
    "edr_explained": true,
    "edr_data_types": 8,
    "distinction_clear": true,
    "gps_telematics": true,
    "cameras": false
  },
  "accuracy_issues": [],
  "preservation_urgency": {
    "mentioned": true,
    "specific_timeframes": true,
    "spoliation_letter": true
  },
  "missing_elements": [
    "dashcam/camera system explanation"
  ],
  "score": 85,
  "status": "PASS"
}
```
