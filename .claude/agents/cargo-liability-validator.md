# Cargo Liability Validator Agent

## Purpose
Validates that content accurately explains cargo-related liability theories, including improper loading, weight violations, hazmat regulations, and the multiple parties responsible for cargo-related truck accidents.

## Trigger Conditions
- Cargo spill accident pages
- Hazmat accident pages
- Rollover accident pages (often cargo-related)
- Overweight/oversize violation content
- Shipper/broker liability sections

## Why This Matters
Cargo issues cause many truck accidents:
- Shifting loads cause rollovers
- Overweight trucks can't stop in time
- Improperly secured cargo spills on roadway
- Hazmat incidents create mass casualties

Missing cargo liability = missing defendants = smaller recoveries.

## Validation Rules

### Cargo Securement Regulations

#### 49 CFR Part 393 Requirements
| Requirement | Rule | Common Violation |
|-------------|------|------------------|
| Working Load Limit | Total WLL ≥ 50% of cargo weight | Under-secured loads |
| Tie-downs | Minimum based on length/weight | Too few straps |
| Blocking/Bracing | Prevent forward movement | Missing front bracing |
| Header boards | Required for certain loads | Absent or weak headers |
| Commodity-specific | Special rules by cargo type | Ignoring special requirements |

### Weight Limits

#### Federal Bridge Formula
- Maximum gross weight: 80,000 lbs
- Single axle: 20,000 lbs
- Tandem axle: 34,000 lbs
- Bridge formula for axle spacing

#### Overweight Violations
Must explain:
- Permit requirements for overweight
- State-specific weight variations
- Weigh station evasion
- How overweight affects braking
- Liability for weight violations

### Liable Parties for Cargo Issues

| Party | Liability Basis | When Liable |
|-------|-----------------|-------------|
| Shipper | Negligent loading | Loaded cargo onto truck |
| Consignee | Negligent unloading | Partially unloaded |
| Cargo owner | Product defect | Cargo was inherently dangerous |
| Loading dock | Premises liability | Loading facility negligence |
| Broker | Negligent selection | Selected carrier unable to handle cargo |
| Motor carrier | Respondeat superior | Driver improperly secured |
| Driver | Direct negligence | Failed to inspect/secure |
| Securement equipment | Product defect | Straps/chains failed |

### Hazmat Specific Rules

#### 49 CFR Parts 171-180
Must accurately explain:
- Hazmat endorsement requirements
- Placarding requirements
- Shipping paper requirements
- Emergency response information
- Training requirements
- Security plans
- Insurance requirements ($1M-$5M)

#### Common Hazmat Cargo
| Class | Material | Insurance Minimum |
|-------|----------|-------------------|
| 1 | Explosives | $5,000,000 |
| 2 | Gases | $1,000,000+ |
| 3 | Flammable liquids | $1,000,000 |
| 4 | Flammable solids | $1,000,000 |
| 5 | Oxidizers | $1,000,000 |
| 6 | Poisons | $5,000,000 |
| 7 | Radioactive | $5,000,000 |
| 8 | Corrosives | $1,000,000 |
| 9 | Misc. dangerous | Varies |

### Securement by Commodity Type

Content should explain special rules for:
- **Logs:** Specific tie-down requirements
- **Metal coils:** Blocking, chocking, tie-downs
- **Paper rolls:** Prevent rolling
- **Concrete pipe:** Blocking requirements
- **Intermodal containers:** Twist locks, tiedowns
- **Automobiles:** Specific blocking/bracing
- **Heavy equipment:** Blocking, chains
- **Crushed/baled commodities:** Prevent shifting

### Driver Inspection Duties

Must explain:
- Pre-trip cargo inspection required
- En-route inspection requirements (after 50 miles, then every 3 hours/150 miles)
- Driver responsibility to refuse unsafe loads
- Documentation requirements

## Litigation Arguments

Content should connect to:
1. **Shipper knew or should have known** - Weight, improper packaging
2. **Carrier accepted responsibility** - Bill of lading acceptance
3. **Driver failed to inspect** - Pre-trip and en-route duties
4. **Broker failed to vet** - Carrier capability for cargo type
5. **Product defect** - Securement equipment failure

## Alert Levels

### CRITICAL (Block Publication)
- Wrong weight limits stated
- Incorrect hazmat classifications
- Missing shipper liability explanation
- Wrong securement requirements

### HIGH (Require Review)
- Incomplete liable party list
- Missing hazmat section (for hazmat page)
- No driver inspection duties
- Missing weight violation explanation

### WARNING (Flag for Improvement)
- Could add commodity-specific rules
- Missing securement equipment details
- No broker cargo liability

## Agent Output

```json
{
  "page_url": "/accidents/cargo-spill-accidents",
  "cargo_coverage": {
    "securement_rules": true,
    "weight_limits": true,
    "hazmat_rules": true,
    "inspection_duties": true
  },
  "liable_parties_mentioned": [
    "shipper",
    "motor carrier",
    "driver"
  ],
  "liable_parties_missing": [
    "cargo owner",
    "loading dock",
    "securement equipment manufacturer"
  ],
  "accuracy_check": {
    "weight_limits_correct": true,
    "securement_regs_cited": true,
    "hazmat_classes_correct": true
  },
  "issues": [
    {
      "severity": "HIGH",
      "issue": "Missing loading dock and equipment manufacturer liability",
      "recommendation": "Add premises liability and product defect theories"
    }
  ],
  "score": 78,
  "status": "NEEDS_IMPROVEMENT"
}
```
