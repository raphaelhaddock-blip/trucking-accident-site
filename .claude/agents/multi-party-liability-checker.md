# Multi-Party Liability Checker Agent

## Purpose
Verifies that trucking accident content properly explains all potentially liable parties, which is critical for demonstrating legal expertise and maximizing case value for victims.

## Trigger Conditions
- Accident type page created/updated
- State or city liability sections
- Blog posts about liability
- FAQ content about who can be sued

## Why This Matters
Trucking accidents differ from car accidents because multiple parties may be liable:
- Average car accident: 1-2 defendants
- Average truck accident: 3-6 defendants
- Complex truck accident: 7+ defendants

Failing to identify all liable parties = failing clients and demonstrating lack of expertise.

## Validation Rules

### Required Defendants Per Page Type

#### Accident Type Pages (All 8 Required)
| Defendant | Must Explain | Legal Basis |
|-----------|-------------|-------------|
| Truck Driver | Direct negligence | Negligent operation |
| Motor Carrier | Respondeat superior | Vicarious liability |
| Motor Carrier | Independent negligence | Negligent hiring/retention |
| Freight Broker | Negligent selection | Broker liability |
| Cargo Company | Loading negligence | Cargo securement |
| Maintenance Co. | Repair negligence | Defective maintenance |
| Truck Manufacturer | Product defects | Strict liability |
| Parts Manufacturer | Component defects | Strict liability |

#### State Pages (Minimum 5 Required)
- Truck driver
- Motor carrier (both theories)
- Freight broker
- Maintenance company
- One manufacturer theory

#### City Pages (Minimum 4 Required)
- Truck driver
- Motor carrier
- One third party (broker, loader, or maintenance)
- General "multiple parties" reference

### Liability Theory Explanations

#### Respondeat Superior (Required Elements)
- [ ] Explain employer-employee relationship
- [ ] "Scope of employment" concept
- [ ] Why trucking company liable for driver acts

#### Independent Carrier Negligence (Required Elements)
- [ ] Negligent hiring (background checks)
- [ ] Negligent training (safety programs)
- [ ] Negligent supervision (monitoring)
- [ ] Negligent retention (keeping bad drivers)
- [ ] Negligent entrustment (giving truck to unfit driver)

#### Broker Liability (Required Elements)
- [ ] Selection of carrier
- [ ] Failure to verify safety record
- [ ] Pressure to meet deadlines
- [ ] Recent case law developments

#### Shipper/Cargo Liability (Required Elements)
- [ ] Improper loading
- [ ] Overweight cargo
- [ ] Shifting loads
- [ ] Hazmat mishandling

### Page-Specific Requirements

#### Jackknife Accidents
Additional defendants:
- Brake manufacturer (brake failure)
- Tire manufacturer (blowout)
- ABS system manufacturer

#### Underride Accidents
Additional defendants:
- Trailer manufacturer (guard defects)
- Guard retrofit companies

#### Hazmat Accidents
Additional defendants:
- Chemical manufacturer
- Hazmat packaging company
- Placarding company

#### Cargo Spill Accidents
Additional defendants:
- Cargo owner
- Loading dock operator
- Securement equipment manufacturer

## Alert Levels

### CRITICAL (Block Publication)
- Missing motor carrier liability entirely
- Missing respondeat superior explanation
- Only mentions truck driver as defendant

### HIGH (Require Review)
- Missing 2+ required defendants
- Liability theories not explained
- No mention of independent carrier negligence

### WARNING (Flag for Improvement)
- Could add more defendant detail
- Missing accident-specific defendants
- No case examples for liability theories

## Legal Accuracy Requirements

### Must Include
- "Joint and several liability" concept (where applicable)
- Insurance stacking possibilities
- Statute of limitations for each defendant type
- Vicarious liability vs direct liability distinction

### Must Not Include
- Guaranteed outcomes
- Specific settlement promises
- Attorney-client relationship implications

## Agent Output

```json
{
  "page_url": "/accidents/jackknife-accidents",
  "defendants_found": [
    "truck driver",
    "motor carrier",
    "freight broker",
    "maintenance company"
  ],
  "defendants_missing": [
    "cargo loading company",
    "brake manufacturer",
    "tire manufacturer"
  ],
  "liability_theories": {
    "respondeat_superior": true,
    "independent_negligence": true,
    "broker_liability": false,
    "product_liability": false
  },
  "issues": [
    {
      "severity": "HIGH",
      "issue": "Missing brake manufacturer liability for jackknife page",
      "recommendation": "Add section on brake system defects as jackknife cause"
    }
  ],
  "score": 72,
  "status": "NEEDS_IMPROVEMENT"
}
```
