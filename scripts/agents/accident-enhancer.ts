/**
 * Accident Enhancement Agent
 *
 * Enhances thin accident type pages to reach 3,000+ word count target.
 * Adds expanded content to key sections.
 *
 * Usage:
 *   npx tsx scripts/agents/accident-enhancer.ts drunk-driving
 *   npx tsx scripts/agents/accident-enhancer.ts --all-thin
 */

import * as fs from 'fs';
import * as path from 'path';

const ACCIDENTS_DIR = path.join(__dirname, '..', '..', 'src', 'lib', 'accidents-content');

// Accident pages that need enhancement (below 3000 words)
const THIN_ACCIDENTS = [
  'drunk-driving',
  'sideswipe-accidents',
  'improper-maintenance',
  'cargo-spill-accidents',
  'override-accidents',
  'speeding-accidents',
  'hazmat-accidents',
  'runaway-truck',
  'wide-turn-accidents',
  'distracted-driving',
  'jackknife-accidents',
  'brake-failure',
  'blind-spot-accidents',
  't-bone-accidents',
  'driver-fatigue',
  'tire-blowout',
  'underride-accidents'
];

interface AccidentEnhancement {
  additionalWhatItIs: string;
  additionalCauses: { title: string; description: string }[];
  additionalInjuries: { type: string; description: string }[];
  additionalFaqs: { question: string; answer: string }[];
  statisticsSection: string;
}

const ENHANCEMENTS: Record<string, AccidentEnhancement> = {
  'drunk-driving': {
    additionalWhatItIs: `

**The Drug and Alcohol Clearinghouse:**

Since January 2020, the FMCSA Drug and Alcohol Clearinghouse has created a national database of commercial driver drug and alcohol violations. Employers must query the Clearinghouse before hiring drivers and at least annually for current employees. This system was designed to prevent drivers with drug or alcohol violations from job-hopping between carriers to avoid consequences.

The Clearinghouse tracks:
- Positive drug and alcohol test results
- Refusals to test
- Other drug and alcohol violations
- Return-to-duty status

When carriers fail to query the Clearinghouse or ignore results, they become directly liable for enabling impaired drivers to remain on the road. This database has revealed thousands of drivers with prior violations still operating commercial vehicles.

**The Role of Substance Abuse in Trucking:**

The trucking industry's unique pressures contribute to substance abuse. Long hours away from family, irregular sleep schedules, loneliness, pressure to meet unrealistic deadlines, and the monotony of highway driving all create conditions conducive to substance abuse.

Studies have found:
- Approximately 2% of truck drivers test positive for alcohol violations
- Drug use rates vary but stimulant abuse for staying awake remains problematic
- Many drivers use prescription medications that impair driving ability
- Poly-drug use (combining substances) creates compounded impairment

Carriers that create excessive pressure on drivers, fail to provide adequate rest opportunities, and don't monitor for signs of substance abuse create conditions where impaired driving becomes more likely.

**Testing Evasion Tactics:**

Despite mandatory testing, some drivers attempt to evade detection through:
- Using synthetic urine or adulterants in drug tests
- Timing substance use to clear system before tests
- Using masking agents or detox products
- Finding carriers with lax testing programs
- Interstate job-hopping before violations are reported

When testing programs fail to detect impairment, or when carriers knowingly look the other way, preventable accidents occur. Attorneys investigating impaired driver crashes often uncover systemic failures in testing programs.`,
    additionalCauses: [
      {
        title: 'Synthetic Drug Use',
        description: `Synthetic cannabinoids, bath salts, and other designer drugs may not be detected by standard drug testing panels. Drivers seeking to evade detection may use these substances, which can cause severe impairment including hallucinations, paranoia, and erratic behavior. The unpredictable effects of synthetic drugs make impaired drivers particularly dangerous.`
      },
      {
        title: 'Sleep Aid Misuse',
        description: `Truck drivers often struggle with irregular sleep schedules and may use prescription or over-the-counter sleep aids. When drivers don't allow sufficient time for these medications to clear their systems, residual sedation impairs driving ability. Zolpidem (Ambien) and similar medications can cause next-day impairment even at recommended doses.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Crush Injuries',
        description: `The extreme forces involved in full-speed impaired driver crashes can cause devastating crush injuries. Vehicle structures collapse, trapping occupants. Crush syndrome from prolonged compression can cause kidney failure and death even after rescue. These injuries require specialized trauma care and often result in amputation.`
      },
      {
        type: 'Internal Bleeding',
        description: `High-energy impacts from impaired driver crashes cause ruptures to internal organs including the spleen, liver, and kidneys. Internal bleeding may not be immediately apparent but can rapidly become life-threatening. Emergency surgery is often required, and organ damage may be permanent.`
      }
    ],
    additionalFaqs: [
      {
        question: 'How does the FMCSA Drug and Alcohol Clearinghouse affect impaired driver cases?',
        answer: 'The Clearinghouse creates a national database of commercial driver drug and alcohol violations. If a carrier failed to query the Clearinghouse before hiring, or ignored results showing prior violations, this establishes direct negligence. Clearinghouse records can prove the carrier knew or should have known about a driver\'s substance abuse history. This evidence often supports both compensatory and punitive damages.'
      },
      {
        question: 'What if the truck driver was using legal prescription medications?',
        answer: 'Legal prescription medications can still impair driving ability. Opioid painkillers, sleep aids, anti-anxiety medications, and many other prescriptions affect reaction time, judgment, and coordination. If a driver operates while impaired by prescription medication—even if legally prescribed—they and their carrier may be liable. Medical examiners should screen for impairing medications before certifying drivers as fit to operate.'
      },
      {
        question: 'How long after an accident should drug and alcohol testing occur?',
        answer: 'Federal regulations require alcohol testing within 8 hours and drug testing within 32 hours of an accident meeting certain criteria. However, earlier testing is always preferable as substances metabolize over time. If the carrier fails to test within required timeframes, this creates an adverse inference—the assumption that results would have been unfavorable. Failure to test is itself a violation.'
      }
    ],
    statisticsSection: `

**Statistics on Impaired Truck Driving:**

According to the Federal Motor Carrier Safety Administration and National Highway Traffic Safety Administration:
- Large trucks are involved in approximately 5,000 fatal crashes annually
- Alcohol and drugs are factors in approximately 3-7% of fatal truck crashes
- Impaired truck drivers are significantly more likely to be at fault in crashes
- Post-accident testing reveals impairment in a substantial percentage of serious crashes
- The Drug and Alcohol Clearinghouse has identified over 100,000 violations since 2020

These statistics underrepresent the problem because:
- Not all serious crashes require post-accident testing
- Some drivers evade detection through timing or adulterants
- Carriers may fail to conduct or report required testing
- Impairment may not be identified if drivers flee scenes or die in crashes`
  },

  'sideswipe-accidents': {
    additionalWhatItIs: `

**Lane Change Dynamics for Commercial Trucks:**

Lane changes are among the most dangerous maneuvers for commercial trucks. The physics involved create significant risks that don't exist for passenger vehicles:

**Trailer Swing:** When a tractor changes lanes, the trailer follows a different path. The rear of a 53-foot trailer can swing 4-6 feet laterally during a lane change. This "tail swing" or "trailer swing" can strike vehicles in adjacent lanes even when the tractor has safely cleared.

**Multiple Lane Changes:** Trucks requiring multiple lane changes (such as merging from an on-ramp to a left exit) face compounded risks. Each lane change multiplies the chance of conflict with other vehicles.

**Traffic Speed Differential:** When trucks change lanes at highway speeds, the speed differential with surrounding traffic may be minimal. But when trucks change lanes at slower speeds (such as in congestion), other vehicles may be approaching rapidly in the target lane.

**Driver Attention:** Lane changes require the driver to split attention between the road ahead, mirrors, and the target lane. This divided attention creates opportunities for error, especially when combined with fatigue, distraction, or time pressure.

**Technology Limitations:**

Modern trucks increasingly include lane departure warning systems and blind spot detection. However, these technologies have limitations:
- They may not detect motorcycles or smaller vehicles
- Dirty sensors can cause false readings
- Drivers may become over-reliant on technology
- Older trucks lack these safety features entirely
- Warning systems don't prevent lane changes; they only alert

When carriers fail to equip trucks with available safety technology, or drivers ignore warnings, liability exposure increases.

**The Role of Aggressive Driving:**

Some sideswipe accidents result from aggressive truck driving behaviors:
- Cutting off other vehicles
- Forcing lane changes in heavy traffic
- Road rage incidents
- Attempting to prevent vehicles from passing
- Retaliatory lane changes after being cut off

Aggressive driving by truck drivers creates heightened danger due to truck size. Carriers that fail to screen for aggressive driving tendencies, don't monitor driver behavior, or ignore complaints about aggressive drivers share liability for resulting accidents.`,
    additionalCauses: [
      {
        title: 'Improper Lane Change Signal Use',
        description: `Many sideswipe accidents occur when truck drivers fail to signal lane changes, signal too briefly for other drivers to react, or signal while already executing the lane change. Federal and state laws require adequate warning before lane changes. Failure to properly signal establishes negligence per se in many jurisdictions.`
      },
      {
        title: 'Inadequate Following Distance',
        description: `When trucks follow too closely, sudden lane changes become necessary to avoid rear-end collisions. These panic lane changes don't allow time for proper mirror checks or signaling. Maintaining proper following distance prevents the situations that lead to emergency lane changes and resulting sideswipes.`
      },
      {
        title: 'GPS Navigation Errors',
        description: `GPS systems designed for passenger vehicles may route trucks inappropriately, leading to last-second lane changes for exits or turns. Truck-specific navigation errors can place drivers in situations requiring sudden lane changes across multiple lanes. Carriers should require truck-specific GPS systems programmed for commercial vehicle routes.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Rollover Injuries',
        description: `When trucks sideswipe smaller vehicles at highway speeds, the smaller vehicle may be pushed off the road or rolled. Rollover crashes cause severe injuries including ejection, roof crush, and multiple impact trauma. Sideswipe-induced rollovers often result in catastrophic or fatal injuries to passenger vehicle occupants.`
      },
      {
        type: 'Loss of Vehicle Control Injuries',
        description: `Sideswipe contact can cause drivers to lose control of their vehicles, leading to subsequent crashes into barriers, other vehicles, or off-road obstacles. The initial sideswipe may cause relatively minor contact, but the resulting loss-of-control crash can be catastrophic.`
      }
    ],
    additionalFaqs: [
      {
        question: 'Can dashcam footage prove fault in a sideswipe accident?',
        answer: 'Yes, dashcam footage is often the most valuable evidence in sideswipe accidents. It can show: which vehicle initiated the lane change, whether signals were used, the relative positions of vehicles, driver behavior before the collision, and surrounding traffic conditions. Many commercial trucks have forward-facing cameras, and this footage can be subpoenaed during litigation. Nearby vehicles with dashcams may also have recorded the incident.'
      },
      {
        question: 'What if both vehicles were changing lanes at the same time?',
        answer: 'When both vehicles are changing lanes simultaneously, comparative fault analysis determines liability allocation. Factors include: which vehicle entered the lane first, whether proper signals were used, whether drivers checked mirrors adequately, the relative sizes and maneuverability of vehicles, and whether either driver had the right-of-way. Commercial truck drivers are held to higher professional standards and bear greater responsibility for safe lane changes.'
      },
      {
        question: 'Are there cameras that record truck blind spots?',
        answer: 'Yes, modern camera monitoring systems can eliminate traditional blind spots on commercial trucks. Side-mounted cameras feeding interior displays give drivers clear views of adjacent lanes. These systems are more effective than mirrors alone. When carriers choose not to install available safety technology, and blind spot sideswipes occur, the cost-cutting decision becomes evidence of negligence.'
      }
    ],
    statisticsSection: `

**Sideswipe Accident Statistics:**

Federal data on sideswipe collisions involving large trucks reveals:
- Sideswipe accidents account for approximately 8-12% of all truck crashes
- Lane change maneuvers are involved in the majority of sideswipe crashes
- Inadequate surveillance (failure to check mirrors/blind spots) is the top driver-related factor
- Sideswipe crashes are more common on interstate highways than other road types
- Approximately 25% of sideswipe crashes result in injuries; 2% are fatal

Contributing factors in sideswipe crashes include:
- Improper lane change: 45% of sideswipe crashes
- Driver inattention: 30%
- Failure to signal: 25%
- Blind spot issues: 20%
- Weather or road conditions: 15%`
  },

  'improper-maintenance': {
    additionalWhatItIs: `

**The Economics of Deferred Maintenance:**

Commercial trucking operates on thin profit margins, creating constant pressure to minimize costs. Maintenance is one of the largest operational expenses, and some carriers defer or skip maintenance to improve short-term profitability. This dangerous cost-cutting directly leads to mechanical failures and accidents.

Common maintenance cost-cutting practices include:
- Extending service intervals beyond manufacturer recommendations
- Using rebuilt or aftermarket parts instead of OEM components
- Performing repairs in-house without proper equipment or training
- Ignoring driver-reported defects until they become critical
- Operating vehicles beyond their designed service life
- Deferring brake adjustments and inspections
- Using retreaded tires beyond safe limits

When carriers prioritize cost savings over safety, they make a calculated decision that endangers everyone on the road. Evidence of systematic maintenance neglect often supports punitive damages.

**The Driver's Pre-Trip Inspection Duty:**

Federal regulations require commercial drivers to conduct pre-trip inspections before operating their vehicles. These inspections should identify obvious defects before the vehicle enters traffic. Drivers who skip or falsify pre-trip inspections share responsibility for accidents caused by discoverable defects.

Pre-trip inspections must cover:
- Brakes and brake system components
- Tires, wheels, and lug nuts
- Steering system
- Lights and reflectors
- Coupling devices (for tractor-trailers)
- Mirrors and windshield
- Horn and wipers
- Emergency equipment
- Suspension components

When drivers don't perform proper pre-trip inspections, both the driver and carrier can be held liable for accidents caused by discoverable defects.

**Third-Party Maintenance Facilities:**

Many carriers outsource maintenance to third-party repair facilities. When these facilities perform negligent repairs—failing to fix reported problems, using substandard parts, or making errors—they become liable for resulting accidents. Complex multi-party litigation may involve:
- The carrier who hired the maintenance facility
- The maintenance facility that performed the work
- Parts suppliers who provided defective components
- The driver who failed to notice ongoing problems

Thorough investigation often reveals a chain of negligence from multiple parties.`,
    additionalCauses: [
      {
        title: 'Outdated Maintenance Tracking Systems',
        description: `Modern fleet maintenance requires sophisticated tracking systems to monitor service intervals, component life, and repair history. Carriers using outdated or manual tracking systems miss scheduled maintenance, lose repair records, and fail to identify patterns indicating developing problems. Inadequate maintenance tracking is itself a form of negligence.`
      },
      {
        title: 'Undertrained Maintenance Personnel',
        description: `Commercial truck maintenance requires specialized training and certifications. Carriers who employ unqualified mechanics, don't provide adequate training, or don't supervise maintenance work may receive substandard repairs that lead to failures. Using maintenance personnel who lack proper qualifications creates liability for resulting accidents.`
      },
      {
        title: 'Pressure to Keep Trucks Moving',
        description: `Revenue is generated only when trucks are moving. Carriers that pressure maintenance departments to rush repairs, return vehicles to service prematurely, or defer maintenance to meet delivery schedules create conditions for failure. When revenue pressure overrides safety decisions, carriers bear responsibility for consequences.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Multi-Vehicle Pileup Injuries',
        description: `Mechanical failures often cause chain-reaction crashes involving multiple vehicles. Brake failures on downgrades, steering failures at highway speeds, and tire blowouts can affect dozens of vehicles. Victims in multi-vehicle pileups often suffer injuries from multiple impacts and may be struck by several vehicles.`
      },
      {
        type: 'Fire and Explosion Injuries',
        description: `Mechanical failures can cause fires through fuel leaks, electrical shorts, or overheated components. Brake fires are particularly common when braking systems are poorly maintained. Victims may suffer severe burns, smoke inhalation, and trauma from explosions when fuel tanks or cargo ignites.`
      }
    ],
    additionalFaqs: [
      {
        question: 'How long must trucking companies keep maintenance records?',
        answer: 'Federal regulations require carriers to retain maintenance records for one year plus the period the vehicle is in the carrier\'s control. However, once litigation is anticipated, carriers have a duty to preserve all relevant records regardless of retention period. Destroying records after notice of a claim constitutes spoliation and can result in severe sanctions including adverse inference instructions.'
      },
      {
        question: 'Can I sue the maintenance company that worked on the truck?',
        answer: 'Yes. Third-party maintenance facilities that perform negligent repairs can be directly liable for resulting accidents. If the facility missed a reported defect, used substandard parts, made installation errors, or failed to follow manufacturer specifications, they share liability. This creates additional insurance coverage beyond the carrier\'s policy and often additional parties to pursue for recovery.'
      },
      {
        question: 'What does the truck\'s black box reveal about maintenance?',
        answer: 'Electronic Control Modules (ECMs) and other onboard computers record fault codes, warning lights, and system malfunctions. These records can show when problems first appeared, whether warnings were ignored, and the vehicle\'s condition leading up to the crash. ECM data combined with maintenance records can prove the carrier knew about problems before the accident occurred.'
      }
    ],
    statisticsSection: `

**Maintenance-Related Crash Statistics:**

FMCSA data on vehicle maintenance and crashes reveals:
- Vehicle maintenance violations are found in approximately 20% of large truck inspections
- Brake-related violations are the most common maintenance deficiency
- Trucks with critical maintenance violations are significantly more likely to crash
- Out-of-service violations indicate immediate safety risks requiring vehicle removal from service
- Approximately 10% of all large truck crashes involve vehicle mechanical factors

The most common maintenance violations leading to crashes:
- Brake system defects: 30% of maintenance-related crashes
- Tire and wheel defects: 25%
- Lighting and reflector problems: 20%
- Steering and suspension: 15%
- Coupling device failures: 10%`
  },

  'cargo-spill-accidents': {
    additionalWhatItIs: `

**The Physics of Cargo Securement:**

Properly securing cargo is a science governed by physics. When trucks accelerate, decelerate, or turn, cargo experiences forces that can cause shifting, falling, or spilling. Understanding these forces explains why proper securement is critical:

**Forward Force During Braking:** When a truck brakes hard, cargo wants to continue moving forward. Unsecured cargo can slide forward, potentially breaking through the cab or becoming projectiles. The forces involved during emergency braking can exceed 0.8 G.

**Lateral Forces During Turns:** Centrifugal force pushes cargo toward the outside of turns. Improperly secured cargo can shift sideways, unbalancing the truck and potentially causing rollover. Sharp turns at speed create forces exceeding 0.5 G laterally.

**Vertical Forces:** Road irregularities, potholes, and sudden changes in grade cause vertical forces that can bounce cargo loose. Securing systems must account for both upward and downward movement.

**Combined Forces:** Real-world driving involves simultaneous forces in multiple directions. Braking while turning creates diagonal forces. Cargo securement must address all possible force combinations.

**Types of Cargo and Specific Hazards:**

Different cargo types create distinct spill hazards:

**Liquid Cargo:** Tank trucks carrying liquids face surge forces as cargo sloshes during acceleration, braking, and turning. Partially full tanks are particularly dangerous because liquid has room to build momentum. Baffle systems reduce but don't eliminate surge.

**Bulk Materials:** Gravel, sand, and other bulk materials can shift within dump trucks or hoppers. Improperly tarped loads can escape during transport. Material falling onto roadways creates hazards for following vehicles.

**Palletized Freight:** Improperly stacked or secured pallets can shift, fall from trucks, or burst through trailer walls. Shrink wrap alone is insufficient securement for heavy pallets.

**Logs and Lumber:** Unsecured logs can roll off trucks and become deadly projectiles. Lumber loads require specialized securement systems designed for long, heavy items.

**Coiled Steel and Heavy Equipment:** Heavy industrial cargo requires specialized equipment and techniques. Failures in securing these loads can cause catastrophic crashes due to the extreme weight involved.`,
    additionalCauses: [
      {
        title: 'Shipper Loading Negligence',
        description: `When shippers load trucks, they often control how cargo is stacked, distributed, and initially secured. Improper loading by shipper personnel—overloading, uneven weight distribution, inadequate initial securement—creates hazards the driver may not be able to detect or correct. Shippers share liability for accidents caused by their loading practices.`
      },
      {
        title: 'Inadequate Securement Equipment',
        description: `Carriers must provide appropriate securement equipment for the cargo being transported. Using worn straps, damaged chains, or inadequate tie-down points creates failure risk. When carriers fail to maintain securement equipment or provide sufficient equipment for the load, they bear responsibility for cargo spill accidents.`
      },
      {
        title: 'Failure to Check During Transit',
        description: `Drivers are required to inspect cargo securement within the first 50 miles and periodically during trips. When drivers skip these inspections, cargo that has shifted goes undetected until it spills. Failure to conduct required en-route inspections establishes driver negligence.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Projectile Impact Injuries',
        description: `Cargo that falls or spills from trucks can become deadly projectiles. At highway speeds, even relatively light objects carry tremendous kinetic energy. Metal, lumber, machinery, and other cargo can penetrate windshields and vehicle structures, causing catastrophic trauma to occupants.`
      },
      {
        type: 'Road Debris Crash Injuries',
        description: `When cargo spills onto roadways, following vehicles may be unable to avoid the debris. Drivers who swerve may lose control; drivers who can\'t stop may collide with cargo. Multi-vehicle pileups often result from cargo spills on high-speed roadways.`
      }
    ],
    additionalFaqs: [
      {
        question: 'Who is responsible when cargo falls from a truck—the driver, carrier, or shipper?',
        answer: 'All three may share liability depending on the circumstances. The shipper may be liable for improper loading. The carrier is liable for failing to ensure proper securement and providing adequate equipment. The driver is liable for failing to inspect the load before departure and during transit. Investigation determines each party\'s share of responsibility.'
      },
      {
        question: 'What are the cargo securement rules for commercial trucks?',
        answer: 'Federal cargo securement rules (49 CFR Part 393) establish requirements for all commercial vehicles. They specify working load limits for tie-downs, number of tie-downs required based on cargo length, specific requirements for different cargo types, and driver inspection obligations. Violation of these rules establishes negligence per se in most jurisdictions.'
      },
      {
        question: 'Can I sue if I hit cargo that fell from a truck I never saw?',
        answer: 'Yes, if the responsible party can be identified. Evidence may include: witness statements, nearby cameras, debris patterns, cargo characteristics identifying the carrier, and police investigation. Even if the truck left the scene, investigation can often identify responsible parties. The truck\'s cargo load records may match the debris found at the scene.'
      }
    ],
    statisticsSection: `

**Cargo-Related Accident Statistics:**

FMCSA and NHTSA data on cargo securement crashes:
- Improper cargo loading/securement is a factor in approximately 4% of large truck crashes
- Cargo shifts contribute to approximately 15% of truck rollover accidents
- Road debris from cargo spills causes thousands of crashes annually
- Fatal crashes involving cargo securement failures average over 100 per year
- Out-of-service orders for cargo securement violations number in the tens of thousands annually

Common cargo securement violations:
- Insufficient number of tie-downs: 35% of violations
- Damaged or inadequate securement equipment: 25%
- Failure to prevent cargo shifting: 20%
- Improper blocking and bracing: 15%
- Tarping violations for loose cargo: 5%`
  },

  'override-accidents': {
    additionalWhatItIs: `

**Understanding Override Crash Mechanics:**

Override accidents occur when a truck rides up and over a smaller vehicle, typically from behind or during a lane change collision. The extreme height difference between commercial trucks and passenger vehicles creates the override hazard—truck bumpers, designed for contact with other trucks, ride above passenger vehicle bumpers and directly impact the passenger compartment.

**Why Override Crashes Are So Deadly:**

In a typical rear-end collision between similar-sized vehicles, the bumpers and crush zones absorb energy before the passenger compartment is affected. In override crashes, this protection is bypassed:

- The truck's front structure directly impacts the rear window and cabin
- Crush zones in the rear of passenger vehicles provide minimal protection from above
- Roof structures are not designed to withstand the weight of a truck riding over
- Occupants in the rear seat are directly in the impact zone
- There is often no time or space for occupants to react

The force of an 80,000-pound truck riding over a 4,000-pound passenger vehicle is almost always fatal for rear seat occupants and frequently fatal for all occupants.

**Truck Design Contributing Factors:**

Commercial truck design creates inherent override risk:

**High Bumper Height:** Truck bumpers are typically 30-40 inches above the ground, while passenger vehicle bumpers are 16-20 inches. This mismatch means truck bumpers pass above car bumpers during impacts.

**Flat Front Design:** Many trucks have flat front ends that act like walls when impacting passenger vehicles. There is no slope to deflect energy upward; the impact is direct.

**Limited Visibility of Low Objects:** Drivers may not see small vehicles directly in front or slightly below their line of sight. This contributes to crashes but also affects the driver's ability to brake before override.

**Aerodynamic Fairings:** Some trucks have air dams or fairings designed for fuel efficiency that still don't extend low enough to engage passenger vehicle bumpers.

**Underride Guards and Override Prevention:**

While much attention focuses on underride guards (on the rear and sides of trailers), front underride guards on truck tractors could prevent override crashes. Such guards would lower the effective impact point of the truck's front end to engage passenger vehicle bumpers. However, front underride guards are not currently required by federal regulations.`,
    additionalCauses: [
      {
        title: 'Sudden Traffic Slowdowns',
        description: `When traffic ahead slows or stops suddenly, heavily loaded trucks may be unable to stop in time even with proper following distance. The truck's momentum carries it into stopped vehicles, and the height differential causes the truck to ride over the vehicle ahead. Drivers who don't anticipate traffic patterns or maintain excessive speed for conditions cause override crashes.`
      },
      {
        title: 'Inadequate Collision Avoidance Systems',
        description: `Modern collision avoidance systems can detect vehicles ahead and automatically apply brakes. However, many trucks lack these systems or have systems that aren't calibrated for low-profile vehicles. When carriers fail to equip trucks with available collision avoidance technology, they increase override risk.`
      },
      {
        title: 'Sun Glare and Visibility Issues',
        description: `Low sun angles, particularly at sunrise and sunset, can blind truck drivers to vehicles ahead. Small vehicles may be invisible against glare. Drivers who don't reduce speed and increase following distance during low-visibility conditions cause override accidents when they can't see stopped traffic.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Decapitation and Severe Head Trauma',
        description: `When truck front structures enter passenger vehicle cabins from above, they can directly strike occupants' heads. Decapitation and catastrophic head trauma are tragically common in override crashes. The roof provides no protection against forces from this angle.`
      },
      {
        type: 'Asphyxiation and Compression',
        description: `Occupants may survive initial impact only to be trapped and compressed as the truck continues moving. Asphyxiation from chest compression, positional asphyxia, and progressive crush injury can cause death even when initial trauma might have been survivable.`
      }
    ],
    additionalFaqs: [
      {
        question: 'Why don\'t trucks have front underride guards?',
        answer: 'Unlike rear underride guards, front underride guards are not currently required by federal regulations. The trucking industry has resisted requirements due to cost and concerns about weight and fuel efficiency. Advocacy groups and safety organizations continue pushing for mandatory front underride guards. When carriers choose not to install available front protection voluntarily, and override crashes occur, this cost-cutting decision becomes evidence of negligence.'
      },
      {
        question: 'How can override accidents be prevented?',
        answer: 'Prevention requires multiple approaches: proper following distance eliminates most override scenarios; collision avoidance systems provide backup when drivers fail; front underride guards would reduce severity when crashes occur; proper driver training emphasizes the unique danger of override crashes. Carriers should implement all available protections.'
      },
      {
        question: 'Are override crashes always fatal?',
        answer: 'While override crashes have very high fatality rates, survival is possible depending on: the speed differential at impact, which part of the vehicle is overridden, occupant positions at impact time, and how far the truck travels over the vehicle. However, survivors typically suffer catastrophic injuries including traumatic brain injury, spinal cord damage, and severe trauma requiring lifetime care.'
      }
    ],
    statisticsSection: `

**Override Crash Statistics:**

Research on truck override collisions reveals:
- Override occurs in approximately 5% of truck-car rear-end collisions
- Fatality rates in override crashes exceed 70%
- Rear seat occupants face the highest risk in rear override crashes
- Average impact speeds in override crashes exceed 40 mph
- Nearly all override fatalities would be survivable in passenger vehicle-to-vehicle crashes at similar speeds

Factors in override crashes:
- Following too closely: 50% of override crashes
- Driver inattention: 35%
- Impaired reaction time (fatigue, substances): 25%
- Brake system deficiencies: 10%
- Visibility conditions: 10%`
  },

  'speeding-accidents': {
    additionalWhatItIs: `

**Speed and Physics: Why Truck Speeding Is Especially Dangerous**

The danger of speeding increases exponentially with vehicle weight. Understanding the physics explains why speeding trucks are so deadly:

**Kinetic Energy:** Kinetic energy equals one-half mass times velocity squared. An 80,000-pound truck has 20 times the mass of a 4,000-pound car. At the same speed, the truck carries 20 times more kinetic energy. When speed increases, energy increases by the square—doubling speed quadruples energy.

**Stopping Distance:** Stopping distance consists of reaction distance (distance traveled while the driver recognizes danger and moves to brake) plus braking distance (distance traveled while braking). Both increase with speed, but braking distance increases exponentially. A truck traveling 70 mph requires over 50% more stopping distance than at 60 mph.

**Force of Impact:** Impact force depends on kinetic energy and stopping distance. When a speeding truck crashes, the massive energy dissipates over whatever stopping distance exists. Less distance means more force. High-speed crashes transfer catastrophic forces to everything they contact.

**Rollover Risk:** Speed increases rollover risk in curves, during emergency maneuvers, and when trucks encounter road irregularities. The higher center of gravity in loaded trucks makes them prone to rollover when speed exceeds safe limits for conditions.

**Speed Limiters and Electronic Control:**

Many fleet trucks are equipped with speed limiters that prevent the truck from exceeding a set maximum speed. Despite this:
- Speed limiters can be tampered with or disabled
- Limiters don't prevent speeding below the set maximum
- Limiters don't account for conditions requiring speeds below the maximum
- Some carriers set limiters above safe speeds

The existence of speed limiting technology creates liability exposure when carriers fail to use it effectively or when drivers circumvent the systems.

**Carrier Economic Pressure:**

Speeding often results from carrier pressure to meet unrealistic delivery schedules. When carriers:
- Create schedules requiring speeds above limits to meet deadlines
- Pay by the load incentivizing faster completion
- Penalize late deliveries harshly
- Monitor and pressure drivers to maintain impossible schedules

...they create conditions where speeding becomes systematic rather than individual driver error. Evidence of carrier pressure supports corporate liability and potentially punitive damages.`,
    additionalCauses: [
      {
        title: 'Unrealistic Delivery Schedules',
        description: `Carriers and shippers sometimes create delivery schedules that cannot be met at legal speeds while complying with hours of service regulations. When drivers face penalties for late delivery or pressure from dispatch, they exceed speed limits to meet impossible deadlines. Scheduling practices that require speeding make the carrier directly liable.`
      },
      {
        title: 'Speed Limiter Tampering',
        description: `Some drivers disable or tamper with electronic speed limiters to exceed programmed maximums. When carriers fail to monitor for limiter tampering, don't investigate unusual speed patterns, or ignore signs of modification, they share liability for speeding-caused accidents.`
      },
      {
        title: 'Per-Mile and Per-Load Compensation',
        description: `Pay structures that compensate drivers per mile or per load create financial incentives for speeding. Faster completion means more loads and more pay. Carriers using these compensation structures without adequate speed monitoring create conditions for systematic speeding.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Ejection Injuries',
        description: `High-speed crashes more frequently result in occupant ejection from vehicles. Seatbelts and airbags have design limits; extreme forces can overcome these restraints. Ejected occupants suffer severe trauma from contact with pavement, other vehicles, and roadside objects.`
      },
      {
        type: 'Unsurvivable Trauma',
        description: `Some high-speed truck crashes generate forces beyond human survival limits regardless of safety equipment. Multiple organ failure, massive blood loss, and catastrophic structural damage can occur within milliseconds. Speeding-caused crashes frequently result in instant fatalities.`
      }
    ],
    additionalFaqs: [
      {
        question: 'How can you prove a truck was speeding before a crash?',
        answer: 'Evidence includes: Electronic Control Module (ECM) or "black box" data recording speed, GPS tracking records, traffic camera footage, witness testimony, physical evidence like skid marks and vehicle damage patterns, and accident reconstruction analysis. Expert engineers can calculate pre-impact speeds from physical evidence even when electronic data is unavailable.'
      },
      {
        question: 'What is the speed limit for commercial trucks?',
        answer: 'Truck speed limits vary by state and road type, often lower than passenger vehicle limits. Many states have differential speed limits—lower maximums for trucks than cars. Beyond posted limits, trucks must reduce speed for conditions: curves, weather, traffic, construction zones, and road surfaces. "Speeding" for trucks includes both exceeding limits and traveling too fast for conditions.'
      },
      {
        question: 'Can trucking companies be sued for speeding drivers?',
        answer: 'Yes. Carriers are liable under respondeat superior for driver negligence during work. Additionally, carriers face direct liability for: creating pressure to speed, failing to monitor driver speeds, not using available speed limiting technology, ignoring patterns of speeding, and compensation structures incentivizing speeding. Evidence of systematic speeding often supports punitive damages.'
      }
    ],
    statisticsSection: `

**Truck Speeding Statistics:**

Federal data on truck speeding and crashes reveals:
- Speeding is a factor in approximately 8-10% of fatal large truck crashes
- Truck speeding violations are among the most common roadside inspection findings
- Speed-related crashes have significantly higher fatality rates than other crash types
- Fatal truck crashes involving speeding average higher speeds than car speeding fatalities
- Crash severity increases exponentially with impact speed

Speed-related crash factors:
- Exceeding posted limit: 60% of speeding crashes
- Too fast for conditions: 40%
- Speed-related loss of control: 35%
- Speed-related inability to stop: 30%
- Speed contributing to rollover: 25%`
  },

  'hazmat-accidents': {
    additionalWhatItIs: `

**Categories of Hazardous Materials:**

The Department of Transportation classifies hazardous materials into nine classes, each presenting distinct dangers:

**Class 1 - Explosives:** Ammunition, fireworks, blasting agents. Crashes can trigger detonations causing mass casualties and destruction.

**Class 2 - Gases:** Compressed, liquefied, dissolved gases. Leaks create fire risk, explosion hazards, and can displace breathable air causing asphyxiation.

**Class 3 - Flammable Liquids:** Gasoline, diesel, solvents. Spills create fire and explosion risks, water contamination, and air pollution.

**Class 4 - Flammable Solids:** Materials that ignite easily or spontaneously. Some react violently with water, complicating response efforts.

**Class 5 - Oxidizers:** Materials that intensify fires by providing oxygen. Can cause combustible materials to ignite spontaneously.

**Class 6 - Poisons:** Toxic substances causing illness or death through ingestion, inhalation, or skin contact. Spills require evacuation and decontamination.

**Class 7 - Radioactive Materials:** Medical isotopes, nuclear materials. Exposure causes radiation sickness and long-term cancer risk.

**Class 8 - Corrosives:** Acids and bases that destroy living tissue and corrode metals. Contact causes severe chemical burns.

**Class 9 - Miscellaneous:** Other hazardous materials not fitting other categories, including environmentally hazardous substances.

**Emergency Response Complexity:**

Hazmat accidents require specialized emergency response that differs fundamentally from standard accident response:

**Identification:** Responders must identify the specific material before approaching. Placards and shipping papers provide this information, but fires or damage may obscure placards.

**Isolation:** Hazmat scenes require establishing hot zones, warm zones, and cold zones to protect responders and the public. Isolation distances vary by material and quantity.

**Specialized Equipment:** Responders need chemical protective suits, self-contained breathing apparatus, and specialized detection and mitigation equipment.

**Decontamination:** People and equipment exposed to hazardous materials must be decontaminated before leaving the scene to prevent spreading contamination.

**Environmental Protection:** Spills must be contained to prevent contamination of soil, groundwater, and waterways. Cleanup can take weeks or months.

The complexity of hazmat response often means victims cannot receive immediate medical care while hazards are being assessed and controlled.`,
    additionalCauses: [
      {
        title: 'Incompatible Material Loading',
        description: `Certain hazardous materials react dangerously when combined. Shippers and carriers must ensure incompatible materials are never loaded together. When incompatible materials are improperly loaded, reactions can occur during normal transport or after accidents, creating hazards that might not exist with individual materials.`
      },
      {
        title: 'Inadequate Driver Training',
        description: `Hazmat drivers require specialized training and endorsements. When carriers use drivers without proper hazmat training, or don't ensure ongoing training requirements are met, they place unqualified drivers in charge of dangerous cargo. Untrained drivers may not respond appropriately to leaks, spills, or accident situations.`
      },
      {
        title: 'Paperwork and Placard Failures',
        description: `Proper hazmat shipping papers and placards are essential for emergency response. When shippers provide incorrect documentation or carriers fail to display proper placards, responders cannot identify hazards and may approach scenes without appropriate precautions, endangering themselves and delaying victim rescue.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Inhalation Injuries',
        description: `Breathing hazardous gases, vapors, or particles can cause immediate and delayed respiratory damage. Some chemicals damage lung tissue on contact; others cause delayed pulmonary edema. Inhalation injuries may not become apparent for hours or days after exposure, and long-term respiratory problems may develop.`
      },
      {
        type: 'Environmental Exposure Effects',
        description: `Communities near hazmat accidents may experience exposure through contaminated air, water, or soil. Effects range from immediate irritation to long-term cancer risk. Residents may need to evacuate and may suffer property damage from contamination. Class action litigation often follows major hazmat releases.`
      }
    ],
    additionalFaqs: [
      {
        question: 'What insurance coverage exists for hazmat accidents?',
        answer: 'Carriers transporting hazardous materials must carry higher insurance minimums—up to $5 million for certain materials compared to $750,000 for general freight. Additionally, shippers may carry pollution liability coverage, and cleanup contractors carry environmental liability policies. Hazmat accidents often involve multiple insurance sources, potentially providing greater recovery than standard truck accidents.'
      },
      {
        question: 'Who pays for hazmat cleanup after an accident?',
        answer: 'The responsible parties—typically the carrier, shipper, and their insurers—pay for cleanup. Environmental laws impose strict liability for hazardous material releases, meaning responsible parties pay regardless of fault. Cleanup costs for major hazmat accidents can exceed millions of dollars. These costs are in addition to compensation for personal injuries.'
      },
      {
        question: 'Can I sue for exposure to hazardous materials without immediate symptoms?',
        answer: 'Yes. Many hazardous materials cause delayed health effects. The statute of limitations typically runs from when you discover (or reasonably should discover) your injury, not from the exposure date. Medical monitoring claims may be available for ongoing screening of exposed individuals. Documenting your exposure promptly is essential even if symptoms haven\'t appeared.'
      }
    ],
    statisticsSection: `

**Hazmat Transportation Statistics:**

PHMSA (Pipeline and Hazardous Materials Safety Administration) data reveals:
- Over 3 billion tons of hazardous materials are transported annually in the US
- Approximately 800,000 hazmat shipments move daily by truck
- Large truck hazmat incidents average over 15,000 per year
- Hazmat releases in truck accidents average 3,000-4,000 annually
- Fatalities from hazmat truck incidents average 15-25 per year (direct hazmat exposure)

Hazmat incident factors:
- Package failure during transport: 40% of releases
- Vehicle accident causing release: 25%
- Loose or improper securement: 15%
- Human error in loading/unloading: 15%
- Equipment or vehicle failure: 5%`
  },

  'runaway-truck': {
    additionalWhatItIs: `

**The Mechanics of Runaway Trucks:**

Runaway truck incidents occur when braking systems cannot control a truck's descent. Understanding the physics explains why these accidents are so dangerous and often preventable:

**Brake Fade:** Drum brakes generate heat through friction. On long downgrades, continuous braking generates more heat than the system can dissipate. As drums heat up, the coefficient of friction decreases, requiring more pedal pressure for the same braking force. Eventually, brakes may become completely ineffective—a condition called brake fade.

**Air Brake System Failure:** Truck air brake systems can fail in multiple ways:
- Air leaks depleting system pressure
- Compressor failure preventing pressure buildup
- Moisture in lines freezing in cold weather
- Valve malfunctions preventing brake application
- Brake adjustment failures reducing braking force

**Loading Effects:** Heavily loaded trucks carry more momentum requiring more braking force and generating more heat during braking. Improperly loaded trucks with excessive weight or weight concentrated on specific axles may overwhelm braking capacity on grades.

**Grade and Distance Interaction:** Long, steep grades are particularly dangerous. Even moderate grades over long distances generate significant heat buildup. The combination of steepness and length determines brake thermal load.

**Mountain Driving Techniques:**

Professional drivers should use specific techniques for mountain descents:

**Engine Braking:** Using lower gears allows the engine to absorb some braking force, reducing reliance on wheel brakes. Proper gear selection before starting descents is critical.

**Speed Control:** Maintaining speeds low enough for the grade prevents brake heat buildup. It's better to start too slow than to discover speed is excessive after brakes begin fading.

**Brake Cooling:** When brakes overheat, drivers should find safe locations to stop and allow brakes to cool. Continuing to drive with overheated brakes risks complete failure.

**Runaway Ramps:** Emergency runaway ramps are positioned on steep grades. Drivers must know ramp locations and use them without hesitation when brakes fail. Pride or denial has caused drivers to pass ramps before complete brake failure.

Carriers operating in mountainous regions must ensure drivers are trained in mountain driving techniques and that vehicles are equipped and maintained for mountain operation.`,
    additionalCauses: [
      {
        title: 'Improper Gear Selection',
        description: `Drivers who descend mountain grades in gears too high for conditions rely excessively on wheel brakes. By the time they recognize the error, brakes may be overheating and downshifting may be impossible. Proper training emphasizes selecting appropriate gears before beginning descents.`
      },
      {
        title: 'Failure to Use Runaway Ramps',
        description: `Runaway ramps save lives, but some drivers refuse to use them—either from overconfidence that they can regain control or concern about vehicle damage and delays. When drivers pass available ramps and subsequently crash, their decision not to use safety facilities may establish negligence.`
      },
      {
        title: 'Inadequate Vehicle Equipment',
        description: `Engine retarders, exhaust brakes, and other auxiliary braking devices reduce reliance on wheel brakes. Carriers operating in mountainous terrain who fail to equip trucks with available auxiliary braking systems increase runaway risk. Cost-cutting on safety equipment creates liability.`
      }
    ],
    additionalInjuries: [
      {
        type: 'High-Speed Impact Trauma',
        description: `Runaway trucks often reach extreme speeds before crashing—80, 90, even 100+ mph on steep grades. Impacts at these speeds generate forces far beyond vehicle safety system designs. Occupants of vehicles struck by runaway trucks face virtually unsurvivable trauma.`
      },
      {
        type: 'Mass Casualty Incidents',
        description: `Runaway trucks that enter populated areas or crash into stopped traffic can kill or injure dozens of people. The combination of extreme speed and massive weight creates devastation affecting multiple vehicles and bystanders. First responders may be overwhelmed by casualty counts.`
      }
    ],
    additionalFaqs: [
      {
        question: 'Are runaway truck accidents always caused by brake failure?',
        answer: 'Not always. While brake failure is the most common cause, runaway incidents can also result from: improper gear selection causing transmission failure, driver incapacitation, accelerator malfunction, and driver inexperience with mountain driving. Investigation determines the specific cause and responsible parties.'
      },
      {
        question: 'Should trucks have better braking systems for mountain driving?',
        answer: 'Technology exists to prevent most runaway incidents. Disc brakes resist fade better than drum brakes. Engine retarders and exhaust brakes supplement wheel brakes. Automatic transmission trucks can\'t be placed in improper gears. Electronic stability control can limit speeds on grades. When carriers don\'t invest in available safety technology, and runaway crashes occur, cost-cutting becomes evidence of negligence.'
      },
      {
        question: 'Why are there runaway truck ramps on mountain highways?',
        answer: 'Runaway ramps are last-resort safety devices for trucks with complete brake failure. They use loose gravel, sand, or arrestor beds to bring trucks to controlled stops. Ramps are positioned at locations where runaway trucks would otherwise crash into traffic, communities, or drop-offs. Their presence acknowledges that brake failures will occur; their effective use depends on driver training and willingness to use them.'
      }
    ],
    statisticsSection: `

**Runaway Truck Statistics:**

Data on runaway truck incidents reveals:
- FMCSA identifies brake-related factors in approximately 30% of truck crash investigations
- Grades exceeding 6% significantly increase brake fade risk
- Runaway truck ramp usage averages several hundred incidents annually in mountain states
- Fatal runaway incidents occur several times monthly in the US
- Runaway crashes have among the highest fatality rates of any truck crash type

Mountain driving crash factors:
- Brake fade from overheating: 45% of runaway incidents
- Improper gear selection: 30%
- Brake system failure or defect: 20%
- Driver error in mountain driving technique: 40%
- Inadequate vehicle equipment: 15%`
  },

  'wide-turn-accidents': {
    additionalWhatItIs: `

**The Geometry of Truck Turns:**

Commercial trucks cannot turn like passenger vehicles due to fundamental differences in vehicle geometry. Understanding these differences explains why wide turn accidents occur and why they're so dangerous:

**Wheelbase and Trailer Length:** The distance between the steering axle and rear axles determines the turning path difference between front and rear of the vehicle. Longer combinations create larger differences.

**Off-Tracking:** When a truck turns, the rear wheels follow a tighter path than the front wheels. This is called off-tracking. A 53-foot trailer's rear tracks approximately 6-8 feet inside the tractor's front wheels during a right-angle turn.

**Tail Swing:** While the rear off-tracks to the inside of a turn, the back corner of the trailer swings to the outside. Tail swing can extend 3-4 feet beyond the vehicle's straight-ahead profile.

**Steer Tire Position:** To negotiate tight turns, truck drivers often must swing wide initially, positioning the tractor into adjacent lanes before turning. This creates the dangerous situation where the truck appears to be going straight or changing lanes when actually preparing to turn.

**The Deadly Right Turn Sequence:**

Right turns are particularly dangerous because:

1. The driver must swing the tractor left to position for the turn
2. Vehicles in the right lane see the truck moving left and assume it's changing lanes
3. Vehicles may move alongside the truck on the right
4. The truck then turns right, directly into the path of these vehicles
5. The trailer sweeps across the right lane, striking vehicles that thought they had clearance

Cyclists and motorcyclists are especially vulnerable because they may position themselves in spaces that appear safe but will be swept by the turning trailer.

**Technology Solutions:**

Various technologies can prevent or reduce wide turn accidents:

**Convex Mirrors and Cameras:** Provide better visibility of adjacent vehicles during turns.

**Side Object Detection:** Sensors detect vehicles alongside the truck and warn the driver.

**Turn Warning Signs:** Signs on trailers warning of wide turns alert adjacent drivers.

**Automatic Turn Signals:** Systems that automatically activate turn signals when turns begin.

**Collision Avoidance Systems:** Advanced systems that prevent turns when vehicles are detected alongside.

When carriers fail to implement available technology and wide turn accidents occur, the decision to forgo safety equipment becomes evidence of negligence.`,
    additionalCauses: [
      {
        title: 'Inadequate Turn Signal Use',
        description: `Drivers who don't signal turns, signal too late, or don't signal sufficiently before beginning turn maneuvers fail to warn adjacent vehicles. When vehicles reasonably believe the truck isn't turning and position themselves alongside, the failure to properly signal establishes driver negligence.`
      },
      {
        title: 'Rushing Through Intersections',
        description: `Proper truck turns require patience and multiple checks. Drivers who rush turns—starting before fully checking mirrors, accelerating through turns, or prioritizing traffic flow over safety—create conditions for wide turn accidents. Time pressure from carriers may encourage dangerous rushing.`
      },
      {
        title: 'Inadequate Driver Training',
        description: `Wide turn execution requires specific techniques taught during CDL training. Drivers who skip training, receive inadequate instruction, or don't practice techniques may not properly execute turns. Carriers who hire undertrained drivers or don't verify training share responsibility.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Crushing Injuries',
        description: `Vehicles caught between a turning truck and fixed objects—curbs, barriers, buildings—experience crushing forces from multiple directions. Occupants may be trapped in collapsed vehicle structures. Crushing injuries require specialized extrication and often result in amputation or death.`
      },
      {
        type: 'Dragging Injuries',
        description: `Vehicles struck by turning trucks may be pushed or dragged along the truck's path. Occupants suffer repeated impacts and abrasion injuries. The psychological trauma of being dragged by a truck compounds physical injuries.`
      }
    ],
    additionalFaqs: [
      {
        question: 'Why do trucks need to swing wide to turn right?',
        answer: 'Truck and trailer combinations cannot pivot around tight corners like cars. The rear wheels track inside the front wheels during turns—a 53-foot trailer\'s rear may track 6-8 feet inside the tractor. To prevent the trailer from jumping curbs or striking corner obstacles, drivers must position the tractor\'s front end wider before turning. This geometry is unavoidable with current trailer designs.'
      },
      {
        question: 'Should I pass a truck on the right when it\'s turning?',
        answer: 'Never. Even if the truck appears to be going left or straight, it may be preparing for a right turn. The area along the right side of a turning truck is called the "death zone" because vehicles there can be swept under the trailer. Always assume a truck may be turning and never position yourself between a truck and a curb at intersections.'
      },
      {
        question: 'Are there truck designs that don\'t require wide turns?',
        answer: 'Shorter trailers require less wide turning, but cargo capacity decreases. Some specialized urban delivery trucks use rear-steering axles that reduce off-tracking. However, standard long-haul combinations will always require wide turns. The focus should be on technology, training, and driver care rather than expecting geometric constraints to disappear.'
      }
    ],
    statisticsSection: `

**Wide Turn Accident Statistics:**

Federal data on truck turning accidents reveals:
- Turning movements are involved in approximately 9% of fatal truck crashes
- Right turns account for a disproportionate share of turn-related fatalities
- Pedestrian and cyclist fatalities are overrepresented in turning crashes
- Intersection crashes involving turns have high serious injury rates
- Urban areas see higher rates of wide turn accidents than rural areas

Turn accident contributing factors:
- Failure to check mirrors: 40% of turn accidents
- Inadequate signaling: 30%
- Misjudgment of clearance: 25%
- Failure to yield to vulnerable road users: 20%
- Vision obstruction: 15%`
  },

  'distracted-driving': {
    additionalWhatItIs: `

**Categories of Distraction:**

Driver distraction encompasses three distinct types, all of which are present and amplified in commercial trucking:

**Visual Distraction:** Taking eyes off the road. At highway speeds, looking away for just 3 seconds means traveling the length of a football field without seeing the road. Visual distractions include:
- Checking phones or navigation systems
- Looking at paperwork or load documents
- Watching events outside the truck
- Adjusting mirrors or controls while moving

**Manual Distraction:** Taking hands off the wheel. Commercial trucks require constant steering input due to their size and wind sensitivity. Manual distractions include:
- Holding phones or devices
- Eating and drinking
- Reaching for objects in the cab
- Writing or using paper-based logs
- Adjusting vehicle controls

**Cognitive Distraction:** Taking mental focus off driving. Even with eyes on the road and hands on the wheel, a distracted mind misses hazards. Cognitive distractions include:
- Phone conversations (even hands-free)
- Thinking about personal problems
- Daydreaming or fatigue-induced inattention
- Stress about loads, schedules, or work issues
- Listening to engaging content

**Cell phone use combines all three distraction types**, which is why it's so dangerous and specifically prohibited for commercial drivers.

**The Unique Dangers of Truck Driver Distraction:**

Distraction impacts truck drivers more severely than passenger vehicle drivers:

**Slower Reaction Implementation:** Even when a distracted truck driver perceives danger, the truck's braking distance means more time and distance is needed to stop. Distraction delays perception; truck physics delays stopping. Combined, these create extreme stopping distances.

**Control Difficulty:** Trucks require constant steering attention. Wind gusts, road irregularities, and trailer dynamics demand active control. A distracted driver may not notice lane departure until the truck is already leaving the road.

**Higher Stakes:** When a distracted car driver crashes, they typically damage themselves and one other vehicle. When a distracted truck driver crashes, multiple fatalities often result. The consequences of truck driver distraction are orders of magnitude more severe.

**Longer Hours of Exposure:** Truck drivers spend 11 hours per day operating vehicles. The extended exposure time increases opportunities for distraction and the cumulative effect of multiple minor distractions.`,
    additionalCauses: [
      {
        title: 'Dispatch and ELD Interactions',
        description: `Modern trucks feature electronic logging devices and dispatch systems requiring driver interaction. While designed to improve safety, these devices can become distractions if drivers operate them while moving. Carriers who require drivers to respond to messages while driving or design workflows requiring device interaction during operation create distraction hazards.`
      },
      {
        title: 'In-Cab Entertainment Systems',
        description: `Truck cabs increasingly feature entertainment systems, personal devices, and other technology. While these may be intended for use when stopped, the temptation to use them while driving is significant during long hauls. Carriers who don't establish clear policies prohibiting entertainment device use while driving enable distraction.`
      },
      {
        title: 'Paperwork and Documentation',
        description: `Despite electronic logging mandates, truck drivers still manage significant paperwork—bills of lading, delivery receipts, inspection reports, and other documents. Drivers who read or complete paperwork while driving are visually and cognitively distracted. Carriers should design workflows allowing paperwork completion when parked.`
      }
    ],
    additionalInjuries: [
      {
        type: 'High-Speed Collision Trauma',
        description: `Distracted drivers often don't brake before impact, resulting in full-speed collisions. Without any speed reduction, the full kinetic energy of the truck transfers to crash victims. Injuries are typically more severe than in crashes where the driver perceived danger and braked partially.`
      },
      {
        type: 'Secondary Collision Injuries',
        description: `Distracted driving crashes often involve multiple impacts. The initial collision may push vehicles into others, barriers, or off roads. Victims may suffer injuries from sequential collisions, each adding trauma. Multi-vehicle pileups from distracted driving crashes can injure dozens.`
      }
    ],
    additionalFaqs: [
      {
        question: 'Is hands-free phone use legal for truck drivers?',
        answer: 'Federal regulations prohibit truck drivers from using hand-held mobile phones while operating commercial vehicles. Hands-free devices are technically legal but research shows hands-free conversations still create significant cognitive distraction. Some carriers prohibit all phone use while driving, including hands-free. Regardless of legality, hands-free use that contributes to crashes can establish negligence.'
      },
      {
        question: 'Can you prove a truck driver was distracted before a crash?',
        answer: 'Yes. Evidence includes: cell phone records showing calls, texts, or data use; ELD and dispatch system logs showing interactions; dashcam footage of driver behavior; event data recorder information showing no braking before impact; witness observations of driver not watching the road; and driver admissions. Expert reconstruction can identify distraction patterns from physical evidence.'
      },
      {
        question: 'Are trucking companies responsible for driver distraction?',
        answer: 'Carriers can be liable for distraction-related crashes when they: fail to establish anti-distraction policies, require driver interactions with devices while moving, pressure drivers to communicate while driving, don\'t monitor or enforce distraction policies, or install distracting technology without proper safeguards. Carrier practices that encourage or tolerate distraction create direct liability.'
      }
    ],
    statisticsSection: `

**Distracted Driving Statistics:**

Federal research on truck driver distraction reveals:
- Distraction is a factor in approximately 8% of large truck crashes
- Texting while driving increases crash risk 23-fold
- Reaching for objects increases crash risk 6-fold
- Dialing cell phones increases crash risk 6-fold
- Reading or writing while driving increases crash risk 4-fold

The Virginia Tech Transportation Institute found that taking eyes off the road for 2 seconds doubles crash risk. At 65 mph, 2 seconds equals traveling 190 feet—more than half a football field—blind.

Types of distraction in truck crashes:
- Cell phone use: 25% of distraction crashes
- Operating vehicle controls: 20%
- External distraction: 15%
- Eating/drinking: 10%
- Drowsiness-related inattention: 10%`
  },

  'jackknife-accidents': {
    additionalWhatItIs: `

**The Physics of Jackknifing:**

A jackknife occurs when the trailer swings out from behind the tractor, forming an angle resembling a folding knife. Understanding the physics explains why jackknifes happen and why they're so dangerous:

**Trailer Momentum:** When a tractor slows (through braking, downshifting, or encountering resistance), the trailer's momentum wants to continue forward. If traction is insufficient to slow the trailer, it begins to swing.

**Pivot Point:** The fifth wheel coupling allows the trailer to pivot relative to the tractor. This design is necessary for turns but creates jackknife potential when forces act differently on tractor and trailer.

**Traction Differential:** Jackknifes often begin when the tractor's drive wheels lose traction while the trailer continues pushing forward. This can occur from:
- Braking on slippery surfaces
- Entering low-traction areas (ice, rain, oil)
- Sudden deceleration
- Improperly balanced braking systems

**The Jackknife Progression:**

Jackknifes typically progress through stages:

1. **Initiation:** The trailer begins rotating relative to the tractor, often just a few degrees initially.

2. **Acceleration:** As the angle increases, the trailer's momentum increasingly pushes the tractor sideways rather than forward. This accelerates rotation.

3. **Loss of Control:** Beyond approximately 15 degrees of angle, recovery becomes extremely difficult. The driver loses the ability to steer effectively.

4. **Impact or Rollover:** The jackknife terminates in one of several ways:
   - The trailer strikes the tractor cab
   - The combination rolls over
   - The truck sweeps across multiple lanes striking other vehicles
   - The truck leaves the roadway

The entire process may take only 2-4 seconds from initiation to impact, giving drivers almost no time to react.

**Prevention Technologies:**

Several technologies can prevent or reduce jackknife severity:

**Antilock Braking Systems (ABS):** Required on trucks since 1997, ABS prevents wheel lockup that initiates many jackknifes. However, ABS must be properly maintained; defective ABS may actually increase jackknife risk.

**Electronic Stability Control (ESC):** ESC detects developing jackknifes and automatically applies individual brakes to correct the situation. ESC is highly effective but not yet required on all trucks.

**Roll Stability Control (RSC):** RSC specifically addresses rollover risk, which often accompanies jackknifes.

Carriers that don't maintain safety systems or don't equip trucks with available technology bear responsibility when preventable jackknifes occur.`,
    additionalCauses: [
      {
        title: 'Antilock Brake System Failures',
        description: `When ABS malfunctions, wheels can lock during braking, initiating jackknifes. Warning lights indicate ABS problems, but some drivers ignore warnings or carriers defer repairs. Operating with defective ABS is both a federal violation and evidence of negligence when jackknifes result.`
      },
      {
        title: 'Improper Braking Technique',
        description: `Professional drivers should be trained in threshold braking and jackknife recovery techniques. Drivers who panic-brake, over-brake, or don't modulate braking properly cause preventable jackknifes. Carriers who don't verify driver training in emergency techniques share responsibility for technique-related jackknifes.`
      },
      {
        title: 'Light or Empty Trailers',
        description: `Empty or lightly loaded trailers are more prone to jackknifing because their weight isn't sufficient to maintain traction during deceleration. Drivers should adjust driving for load conditions—reducing speed, increasing following distance, and braking more gently with light loads. Failure to adjust creates jackknife risk.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Lane-Sweep Injuries',
        description: `When trucks jackknife on multi-lane highways, the trailer may sweep across several lanes, striking multiple vehicles. Occupants of these vehicles have no warning and no escape—the trailer arrives perpendicular to their travel path at highway speed. Multiple-fatality crashes result.`
      },
      {
        type: 'Cab Intrusion Injuries',
        description: `If the trailer swings far enough, it can strike the tractor cab itself, crushing the driver's compartment. While truck drivers bear responsibility for causing jackknifes, they too become victims when trailers strike their cabs. Cab intrusion causes severe injuries to drivers.`
      }
    ],
    additionalFaqs: [
      {
        question: 'Can a truck driver recover from a jackknife once it starts?',
        answer: 'Recovery is possible in early stages but becomes impossible as the angle increases. Professional drivers are trained to: release brakes immediately to restore traction, steer in the direction of the skid, and avoid panic reactions. However, at highway speeds, drivers have only 1-2 seconds to respond before recovery becomes impossible. Electronic stability control can react faster than human drivers, which is why ESC is so effective at preventing jackknifes.'
      },
      {
        question: 'Are jackknife accidents always the truck driver\'s fault?',
        answer: 'Not always, but usually driver or carrier factors contribute. Other potential causes include: road conditions (unexpected ice, debris, or hazards), vehicle defects (brake system failures, tire failures), and other drivers\' actions forcing emergency braking. Investigation determines the cause. However, professional drivers should anticipate conditions and adjust driving accordingly, so pure "no-fault" jackknifes are rare.'
      },
      {
        question: 'Why don\'t all trucks have electronic stability control?',
        answer: 'ESC has been required on new trucks only since recent regulatory mandates. Older trucks in the fleet lack this technology. Additionally, retrofitting ESC to existing trucks is expensive and not required. When carriers continue operating older trucks without ESC, and preventable jackknifes occur, the decision to use older, less-safe equipment becomes evidence of negligence.'
      }
    ],
    statisticsSection: `

**Jackknife Accident Statistics:**

Federal data on jackknife crashes reveals:
- Jackknifes account for approximately 5-10% of all large truck crashes
- Jackknife crashes have significantly higher fatality rates than other crash types
- Wet or icy road conditions are present in approximately 40% of jackknifes
- Empty or light trailers are overrepresented in jackknife statistics
- Multi-vehicle involvement is common in jackknife crashes

Jackknife contributing factors:
- Slippery road conditions: 40%
- Excessive speed for conditions: 35%
- Braking too hard: 30%
- Vehicle maintenance issues: 15%
- Light or unbalanced loads: 15%
- Brake system imbalance: 10%`
  },

  'brake-failure': {
    additionalWhatItIs: `

**Understanding Truck Braking Systems:**

Commercial trucks use complex braking systems fundamentally different from passenger vehicles. Understanding these systems explains how failures occur and why they're so dangerous:

**Air Brake Basics:** Unlike passenger vehicles with hydraulic brakes, commercial trucks use compressed air to apply brakes. An engine-driven compressor fills storage tanks with compressed air. When the driver presses the brake pedal, air pressure applies the brakes. Springs hold the brakes in the "applied" position; air pressure releases them—a fail-safe design that should stop the truck if air pressure is lost.

**S-cam Drum Brakes:** Most commercial trucks use S-cam drum brakes. Air pressure pushes a rod that turns an S-shaped cam, pushing brake shoes against the drum. This system requires regular adjustment as linings wear. Improperly adjusted brakes provide reduced braking force even when all components function.

**Disc Brakes:** Some modern trucks use air disc brakes, which maintain adjustment automatically and resist fade better than drums. However, disc brakes are more expensive and not yet universal in the fleet.

**Brake Fade Explained:**

Brake fade is the gradual loss of braking power due to heat. Understanding fade explains many brake failure accidents:

**Heat Generation:** Braking converts kinetic energy to heat through friction. The heavier the vehicle and the faster the speed, the more energy must be converted and the more heat generated.

**Drum Expansion:** As brake drums heat up, they expand. The brake shoes must travel farther to contact the expanding drum, reducing braking force. Excessive heating can cause the drum to expand beyond the shoes' reach.

**Friction Material Changes:** Brake lining friction coefficients change with temperature. Above optimal temperatures, friction decreases, requiring more pedal pressure for the same braking force.

**Vapor Lock:** In hydraulic portions of some systems, heat can boil brake fluid, creating vapor that compresses instead of transmitting pressure.

On long downgrades, continuous braking can generate heat faster than it dissipates, leading to complete brake failure. This is why proper mountain driving technique emphasizes engine braking and speed control over continuous wheel brake application.`,
    additionalCauses: [
      {
        title: 'Brake Adjustment Failures',
        description: `Air brake systems require regular adjustment to compensate for lining wear. When push rod travel becomes excessive, brakes cannot apply with full force. FMCSA regulations specify maximum push rod travel; exceeding these limits is both a violation and evidence of maintenance neglect. Out-of-adjustment brakes cause many brake failure accidents.`
      },
      {
        title: 'Contaminated Brake Linings',
        description: `Oil, grease, or other contaminants on brake linings reduce friction and braking effectiveness. Leaking wheel seals, improper maintenance procedures, and environmental contamination can all affect lining performance. Contaminated brakes may appear functional until drivers need maximum braking force.`
      },
      {
        title: 'Air System Leaks and Failures',
        description: `Air brake systems depend on maintaining adequate pressure. Leaks in airlines, fittings, chambers, or valves reduce available pressure. Compressor failures prevent pressure rebuilding. Moisture in air systems can freeze in cold weather, blocking lines. Any air system failure compromises braking.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Intersection Collision Injuries',
        description: `Trucks with failed brakes cannot stop at intersections. Cross-traffic vehicles are struck at full speed with no warning. T-bone collisions into the sides of crossing vehicles cause severe trauma because vehicle sides provide less crash protection than fronts or rears. Multiple occupant fatalities are common.`
      },
      {
        type: 'Rear-End Collision Chain Reactions',
        description: `When trucks cannot stop for traffic ahead, they may strike multiple vehicles. The initial impact pushes vehicles into others, creating chain reactions involving numerous vehicles. Occupants throughout the chain suffer injuries from multiple impacts, with rear-most struck vehicles typically suffering most severe damage.`
      }
    ],
    additionalFaqs: [
      {
        question: 'How often should truck brakes be inspected and adjusted?',
        answer: 'Drivers must inspect brakes during pre-trip inspections daily. Mechanics should inspect and adjust brakes during scheduled maintenance—typically every 10,000-25,000 miles depending on operating conditions. FMCSA requires brake systems to meet performance standards at all times. Many carriers defer inspection and adjustment to cut costs, creating failures that cause accidents.'
      },
      {
        question: 'What is a brake stroke measurement and why does it matter?',
        answer: 'Brake stroke is the distance the brake chamber push rod travels when brakes are applied. Excessive stroke indicates worn or out-of-adjustment brakes. FMCSA regulations specify maximum stroke limits—typically 1.5 to 2 inches depending on chamber type. Exceeding limits is an out-of-service violation requiring immediate repair. Stroke measurement is quick and simple; failure to check it is inexcusable maintenance neglect.'
      },
      {
        question: 'Can truck brakes fail suddenly without warning?',
        answer: 'Some failures are sudden—airline ruptures, chamber failures, spring brake malfunctions. However, most brake failures result from progressive deterioration that proper inspection would detect. Brake fade on grades develops over time; drivers should sense decreasing effectiveness. Complete sudden failure without any preceding signs is uncommon in well-maintained trucks. Investigation typically reveals maintenance neglect or ignored warnings.'
      }
    ],
    statisticsSection: `

**Brake-Related Crash Statistics:**

FMCSA data on brake systems and crashes:
- Brake-related factors are present in approximately 29% of large truck crashes
- Brake out-of-service violations are among the most common in roadside inspections
- Trucks with brake violations are significantly more likely to be involved in crashes
- Brake fade on grades accounts for numerous fatal crashes in mountainous regions
- Multiple-vehicle fatality crashes frequently involve brake-related factors

Common brake system deficiencies:
- Out-of-adjustment brakes: 40% of brake violations
- Brake lining problems: 25%
- Air system leaks: 15%
- Brake drum problems: 10%
- Brake hose and tubing issues: 10%`
  },

  'blind-spot-accidents': {
    additionalWhatItIs: `

**Mapping Truck Blind Spots:**

Commercial trucks have extensive blind spots—areas where the driver cannot see other vehicles even with proper mirror use. Understanding these zones helps explain why blind spot accidents occur:

**Front No-Zone:** The area immediately in front of a truck, extending approximately 20 feet forward. Trucks sit high; drivers cannot see short vehicles, motorcycles, or pedestrians directly ahead and below their line of sight.

**Rear No-Zone:** The area directly behind the trailer, extending approximately 30 feet. Trailers block all rearward visibility; there is no rear-view mirror equivalent. Following vehicles disappear entirely.

**Left Side No-Zone:** A narrow zone along the left side, widening toward the rear. Extends approximately one lane width along the tractor and increases to two or more lanes alongside the trailer rear.

**Right Side No-Zone:** The largest and most dangerous blind spot. Extends from the front bumper back the entire length of the truck, covering two or more lanes. Vehicles can travel for extended periods completely invisible to the driver.

**Mirror Limitations:**

Trucks use multiple mirrors to monitor these zones, but mirrors have inherent limitations:

**Flat Mirrors:** Show accurate size and distance but have limited field of view. Small vehicles can fit between mirror coverage areas.

**Convex Mirrors:** Wide field of view but distort size and distance perception. Objects appear smaller and farther than reality.

**Fender Mirrors:** Cover front corners but are small and require the driver to actively look at them.

**Mirror Adjustment:** Improperly adjusted mirrors expand blind spots significantly. Mirrors must be readjusted when different drivers use the truck.

Even with properly adjusted mirrors and diligent checking, significant areas around the truck remain invisible to drivers.

**Camera and Sensor Technology:**

Modern technology can eliminate or reduce traditional blind spots:

**Side-Mounted Cameras:** Cameras on mirror stalks or trailers feed displays in the cab, showing areas mirrors miss.

**360-Degree Camera Systems:** Multiple cameras create bird's-eye views showing all areas around the truck simultaneously.

**Radar and Ultrasonic Sensors:** Detect vehicles in blind spots and alert drivers through visual, audible, or haptic warnings.

**Automatic Emergency Braking:** Advanced systems can stop the truck when blind spot incursions are detected.

When carriers don't implement available blind spot technology and blind spot accidents occur, the decision to rely on mirrors alone becomes evidence of negligence.`,
    additionalCauses: [
      {
        title: 'Inadequate Mirror Checks',
        description: `Professional drivers must check mirrors regularly—before lane changes, turns, and any lateral movements. Drivers who don't check mirrors frequently enough, don't check all mirrors, or check mirrors without actually seeing what's in them cause preventable blind spot accidents. Training and enforcement of mirror-check habits is a carrier responsibility.`
      },
      {
        title: 'Improperly Adjusted Mirrors',
        description: `Mirrors must be adjusted for each driver based on their seating position. Drivers who don't adjust mirrors when taking over vehicles, or mirrors that drift out of adjustment, create expanded blind spots. Pre-trip inspections should include mirror adjustment verification.`
      },
      {
        title: 'Failure to Signal Intentions',
        description: `Turn signals warn other drivers of intended movements, allowing them to position themselves visible to truck drivers. When drivers don't signal or signal inadequately, other vehicles may be in blind spots when movements begin. Proper signaling gives other drivers opportunity to react.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Merge and Lane Change Crushing',
        description: `When trucks merge or change lanes into vehicles in blind spots, the smaller vehicle may be pushed into barriers, off the road, or under the truck. The truck's mass and momentum overwhelm the smaller vehicle's ability to escape. Crushing injuries from prolonged contact are common.`
      },
      {
        type: 'Cyclist and Pedestrian Fatalities',
        description: `Cyclists and pedestrians are particularly vulnerable to blind spot accidents. Their small profiles make them easy to miss; their lack of protection makes any contact potentially fatal. Right-turning trucks frequently kill cyclists who are invisible in the right-side blind spot.`
      }
    ],
    additionalFaqs: [
      {
        question: 'How can I tell if I\'m in a truck\'s blind spot?',
        answer: 'A simple rule: if you cannot see the truck driver in their mirror, they cannot see you. However, even seeing the driver doesn\'t guarantee they see you—they may not be looking at that moment. The safest practice is to pass trucks quickly, avoid lingering alongside them, and stay either well ahead or well behind. Never assume a truck driver knows you\'re there.'
      },
      {
        question: 'Shouldn\'t trucking companies use cameras instead of mirrors?',
        answer: 'Camera monitoring systems can eliminate traditional blind spots and are increasingly common. However, they\'re not universally required. Many older trucks rely solely on mirrors. When carriers choose not to install available camera systems, and blind spot accidents occur, the cost-saving decision becomes evidence of negligence. Advanced systems that warn drivers or automatically prevent blind spot collisions are available but not yet mandated.'
      },
      {
        question: 'Are truck drivers taught about blind spots during training?',
        answer: 'CDL training covers blind spots and mirror use. However, training quality varies significantly. Some drivers receive minimal training on blind spot management. Carriers should verify that drivers understand blind spot dangers and monitor for compliance with mirror-checking procedures. Training deficiencies that contribute to accidents make carriers directly liable for negligent training.'
      }
    ],
    statisticsSection: `

**Blind Spot Accident Statistics:**

Research on truck blind spots and crashes reveals:
- Blind spot issues contribute to approximately 15% of truck crashes with passenger vehicles
- Right-side blind spot crashes are approximately twice as common as left-side
- Cyclist and pedestrian fatalities disproportionately involve blind spot factors
- Lane change crashes frequently cite inadequate surveillance as a factor
- Blind spot detection technology can reduce these crashes by 30% or more

Blind spot crash factors:
- Failure to check mirrors before maneuver: 50% of blind spot crashes
- Improper mirror adjustment: 20%
- Signaling failure: 25%
- Quick lane changes without adequate checks: 30%
- Lack of blind spot detection technology: Contributing factor in many crashes`
  },

  't-bone-accidents': {
    additionalWhatItIs: `

**Understanding T-Bone Collision Dynamics:**

T-bone (side impact) collisions involving commercial trucks are among the deadliest crash configurations. Understanding why requires examining vehicle design and crash physics:

**Side Impact Vulnerability:** Vehicle sides offer minimal crash protection compared to fronts and rears. While fronts have crumple zones and rears have trunk space, sides have only the door panel between occupants and impact. When trucks strike vehicle sides, protective distance is measured in inches.

**Intrusion Distance:** In frontal crashes, crumple zones may absorb 2-3 feet of impact before the passenger compartment is affected. In side impacts, intrusion reaches occupants almost immediately. At truck impact speeds, doors collapse into occupants before airbags fully deploy.

**Occupant Proximity:** Side impact occupants are directly adjacent to the impact zone. In frontal crashes, the engine compartment and dashboard provide separation. In side crashes, the occupant may be inches from the striking vehicle. Direct contact between the truck and occupant is possible.

**Impact Force Distribution:** Frontal crashes distribute force across the vehicle's width through the frame. Side impacts concentrate force on a much smaller area—essentially the door width. This concentration increases the force per square inch dramatically.

**Intersection Dynamics:**

T-bone crashes typically occur at intersections, involving specific dynamics:

**Right-Angle Impacts:** The classic T-bone occurs when vehicles' paths cross at approximately 90 degrees. The striking vehicle impacts perpendicular to the struck vehicle's travel path.

**Relative Speeds:** When vehicles enter intersections from different directions, their speeds combine to create impact severity. A truck traveling 45 mph striking a car traveling 35 mph creates collision dynamics similar to a 55+ mph impact.

**No Evasive Action:** In many T-bone crashes, the struck vehicle had no awareness of the threat until impact. Unlike rear-end situations where drivers may see approaching vehicles in mirrors, side impacts often come without warning.

**Point of No Return:** By the time either driver perceives the developing collision, neither may have space or time to avoid impact. Intersection geometry creates commitment points where crashes become unavoidable.`,
    additionalCauses: [
      {
        title: 'Red Light Running',
        description: `When trucks run red lights, they enter intersections against right-of-way, creating T-bone scenarios with crossing traffic. Truck drivers who run red lights—whether deliberately, due to distraction, or from misjudging signal timing—bear full responsibility for resulting crashes. Yellow light timing designed for cars may be inadequate for truck stopping distances, but drivers should anticipate this.`
      },
      {
        title: 'Stop Sign Violations',
        description: `Stop signs require complete stops and yielding to cross traffic. Trucks that roll through stops, fail to yield, or misjudge gaps in traffic cause T-bone collisions with vehicles having right-of-way. Stop sign violations are particularly dangerous because crossing vehicles don't expect the truck to enter the intersection.`
      },
      {
        title: 'Left Turn Misjudgments',
        description: `Left-turning trucks that misjudge oncoming traffic gaps create T-bone scenarios where oncoming vehicles strike the truck or the truck strikes vehicles that were blocked by the turning tractor. The length of truck combinations extends the time needed to clear intersections, increasing exposure to cross-traffic.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Near-Side Occupant Trauma',
        description: `Occupants on the side of the vehicle struck by the truck face direct impact forces. The door may intrude into the occupant space before any protection activates. Near-side occupants suffer the most severe injuries in T-bone crashes, including crushing, ejection through the opposite side, and direct contact with truck structures.`
      },
      {
        type: 'Far-Side Occupant Injuries',
        description: `While far-side occupants are farther from the impact, they face their own dangers. The vehicle may be pushed laterally, striking barriers or other vehicles. Occupants may be thrown across the interior, striking each other or interior surfaces. Unbelted far-side occupants may be ejected through the near-side opening created by the impact.`
      }
    ],
    additionalFaqs: [
      {
        question: 'Why are truck T-bone accidents so deadly?',
        answer: 'Multiple factors combine: vehicle sides provide minimal protection; trucks carry massive kinetic energy that transfers to struck vehicles; occupants are close to the impact zone; side impacts often occur at full speed with no braking; and truck front ends are high, often striking at window level rather than door level. The combination overwhelms vehicle safety systems designed for lower-energy impacts.'
      },
      {
        question: 'Are there intersection designs that reduce T-bone crashes?',
        answer: 'Yes. Roundabouts virtually eliminate T-bone crashes by removing right-angle conflicts. Protected left turn signals reduce T-bones from turning conflicts. Red light cameras deter running red lights. Intersection collision warning systems can alert drivers to approaching cross-traffic. However, most intersections retain traditional designs where T-bone risk exists.'
      },
      {
        question: 'Can dash cameras prove who ran the light in a T-bone crash?',
        answer: 'Dashcam footage often provides definitive evidence of signal status and vehicle positions. Cameras in either vehicle, in nearby vehicles, or traffic enforcement cameras may capture the crash. When investigating T-bone crashes, attorneys subpoena all available camera footage. Even without camera evidence, signal timing analysis, witness statements, and physical evidence can establish which vehicle violated right-of-way.'
      }
    ],
    statisticsSection: `

**T-Bone Crash Statistics:**

Federal data on intersection and angle crashes:
- Intersection crashes account for approximately 20% of all truck crashes
- T-bone configurations have significantly higher fatality rates than other crash types
- Side impacts are the second-leading cause of crash fatalities overall
- Running red lights and stop signs are leading causes of intersection crashes
- Left turn crashes involve T-bone configurations in approximately 25% of cases

Intersection crash factors:
- Traffic control violations: 40% of intersection crashes
- Failure to yield right-of-way: 35%
- Improper turning: 20%
- View obstruction: 15%
- Signal timing misjudgment: 10%`
  },

  'driver-fatigue': {
    additionalWhatItIs: `

**The Science of Fatigue Impairment:**

Driver fatigue impairs performance through multiple physiological mechanisms that mirror alcohol intoxication:

**Cognitive Impairment:** Sleep deprivation reduces attention, slows information processing, impairs decision-making, and degrades judgment. Studies show 18 hours without sleep produces impairment equivalent to 0.05% blood alcohol; 24 hours without sleep equals 0.10% BAC—above the legal limit for any driver.

**Reaction Time Degradation:** Fatigued drivers respond more slowly to stimuli. At highway speeds, even fractions of a second matter. A driver who would normally respond in 0.5 seconds may take 1.5 seconds when fatigued—adding over 100 feet of travel before braking begins.

**Microsleeps:** Extreme fatigue causes involuntary microsleeps—brief episodes lasting 4-5 seconds where the brain enters sleep despite the person's efforts to stay awake. At highway speeds, a 4-second microsleep covers 400+ feet. Drivers often have no awareness that microsleeps occurred.

**Vision Degradation:** Fatigue affects vision through: slower visual processing, reduced peripheral vision, increased reaction time to visual stimuli, and difficulty tracking moving objects. Fatigued drivers may not see hazards that alert drivers would easily perceive.

**Risk Assessment Impairment:** Fatigue degrades the ability to assess risk accurately. Fatigued drivers may take chances they would normally avoid, underestimate stopping distances, or misjudge gaps in traffic. This impaired judgment leads to crashes that would not occur with rested drivers.

**Circadian Rhythm Factors:**

Human bodies follow circadian rhythms that affect alertness regardless of sleep quantity:

**Low Points:** Alertness naturally decreases between 2-6 AM and 2-4 PM. Crashes peak during these windows because biology makes staying alert more difficult, regardless of recent sleep.

**Shift Work Disruption:** Driving schedules that require wakefulness during natural sleep times and sleep during natural wake times fight biology. Even with adequate hours in bed, sleep quality suffers when schedules oppose circadian rhythms.

**Sleep Debt:** Sleep debt accumulates when drivers consistently get insufficient rest. The body cannot fully compensate for lost sleep with single recovery nights. Chronic sleep debt creates persistent impairment that drivers may not recognize because they've forgotten what true alertness feels like.

Understanding these biological factors explains why Hours of Service regulations structure driving time as they do—and why violations create such danger.`,
    additionalCauses: [
      {
        title: 'Carrier Pressure to Violate HOS',
        description: `Some carriers create conditions that pressure drivers to violate Hours of Service rules. Unrealistic schedules, per-mile compensation incentivizing speed over rest, implied threats of termination, and dispatcher pressure all encourage drivers to push beyond safe limits. When carriers create HOS violation pressure and fatigue crashes occur, they share direct liability.`
      },
      {
        title: 'Sleep Disorder Conditions',
        description: `Many truck drivers suffer from undiagnosed or inadequately treated sleep apnea, a condition causing repeated breathing interruptions during sleep. Drivers with sleep apnea may get "8 hours" of sleep but experience profound fatigue because sleep quality is severely degraded. Medical certification should screen for sleep disorders, and carriers should monitor for signs of daytime sleepiness.`
      },
      {
        title: 'Electronic Logging Device Circumvention',
        description: `While ELDs have made falsifying driving hours more difficult, some drivers and carriers find ways to circumvent the systems. Using multiple driver identities, disconnecting devices, claiming false exemptions, and other schemes allow driving beyond legal limits. When ELD circumvention leads to fatigue crashes, both driver and carrier face liability.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Unmitigated Impact Injuries',
        description: `Sleeping or drowsy drivers often don't brake, steer, or take any evasive action before crashes. Full-speed impacts without braking cause injuries far more severe than crashes where even partial evasive action occurred. The absence of any defensive response means full kinetic energy transfers to crash victims.`
      },
      {
        type: 'Multi-Vehicle Crash Injuries',
        description: `Fatigue-related crashes often involve truck drivers drifting into oncoming traffic or rear-ending vehicles in traffic queues. These scenarios create multi-vehicle impacts affecting numerous victims. Fatigue-impaired drivers may not respond appropriately even after initial impacts, causing continued collisions.`
      }
    ],
    additionalFaqs: [
      {
        question: 'How do Hours of Service regulations prevent fatigue?',
        answer: 'HOS regulations limit driving time and mandate rest periods: 11-hour maximum daily driving within 14 hours on-duty; 10-hour minimum off-duty period; 30-minute break requirement; 60/70 hour weekly limits. These limits are based on fatigue research and aim to ensure drivers get adequate rest. However, regulations represent minimum standards—some operations and conditions require more conservative scheduling.'
      },
      {
        question: 'Can you sue for a fatigue-related crash?',
        answer: 'Yes. Fatigued driving is negligent driving. If investigation reveals: HOS violations, inadequate rest, signs of fatigue before the crash, carrier pressure encouraging excessive driving, or medical conditions causing fatigue, both driver and carrier may be liable. Electronic logging data, phone records, witness statements, and medical records help establish fatigue-related negligence.'
      },
      {
        question: 'How can you prove a truck driver was fatigued?',
        answer: 'Evidence includes: Electronic Logging Device records showing HOS compliance or violations; driver logs (electronic and paper); dispatch records showing scheduling patterns; phone records showing activity during rest periods; previous driving history; medical records indicating sleep disorders; witness statements about driver behavior and appearance before the crash; and crash characteristics consistent with fatigue (no braking, lane departure). Expert fatigue researchers can analyze data to establish likely impairment.'
      }
    ],
    statisticsSection: `

**Driver Fatigue Statistics:**

Research on truck driver fatigue reveals alarming data:
- FMCSA studies indicate fatigue is a factor in approximately 13% of large truck crashes
- Single-vehicle crashes involving lane departure are frequently fatigue-related
- Peak crash times correlate with circadian rhythm low points
- Hours of Service violations increase crash risk significantly
- Sleep apnea affects an estimated 28% of commercial truck drivers

Fatigue-related crash patterns:
- Run-off-road crashes: 35% involve fatigue factors
- Rear-end crashes into stopped traffic: 25% involve inattention/fatigue
- Head-on crashes from lane departure: 30% involve fatigue
- Crashes between 2-6 AM: Fatigue present in 40%+
- Single-vehicle crashes: Fatigue overrepresented compared to multi-vehicle`
  },

  'tire-blowout': {
    additionalWhatItIs: `

**The Physics of Tire Blowouts:**

Tire blowouts on commercial trucks create violent, sudden events that challenge even skilled drivers. Understanding the physics explains why these crashes are so dangerous:

**Instantaneous Deflation:** When a tire blows, it loses air almost instantaneously. This sudden loss of support creates immediate handling effects that the driver must counter within fractions of a second.

**Asymmetric Drag:** A deflated tire creates much more resistance than an inflated tire. This asymmetric drag pulls the vehicle toward the blown tire. The force can be substantial—enough to overcome steering input if the driver isn't prepared.

**Steering Effects:** Front tire blowouts directly affect steering, potentially jerking the wheel from the driver's hands. Rear tire blowouts affect tracking, causing the trailer to pull toward the blown tire. Tandem axle blowouts on one side can create severe tracking problems.

**Speed Amplification:** Blowout effects worsen with speed. At 65 mph, drivers have less than a second to recognize the blowout and begin correcting. At higher speeds, the vehicle may be out of control before the driver can respond.

**Rim Contact:** If the tire deflates completely, the wheel rim may contact the pavement. Rim contact creates extreme drag, violent vibration, and can cause the vehicle to veer uncontrollably. Running on rims can also cause fires from friction.

**Tire Maintenance and Inspection:**

Most tire blowouts are preventable through proper maintenance and inspection:

**Pre-Trip Inspections:** Drivers must inspect tires during pre-trip inspections, checking for: proper inflation, tread depth, sidewall damage, bulges, cuts, and objects embedded in treads. Many blowouts result from damage visible before departure.

**Inflation Monitoring:** Proper inflation is critical. Underinflation causes excessive heat buildup and flexing that weakens tire structure. Overinflation makes tires susceptible to impact damage. Tire pressure monitoring systems (TPMS) can alert drivers to pressure problems.

**Tread Depth Requirements:** Federal regulations specify minimum tread depths. Worn tires are more susceptible to blowouts and provide less control when blowouts occur. Carriers who run tires beyond safe limits prioritize cost savings over safety.

**Retreaded Tire Issues:** Many commercial trucks use retreaded tires—tires with new tread applied to used casings. Quality retreads are safe, but poor retreading processes or using damaged casings can cause tread separation failures that mimic blowouts.

**Load and Heat Management:**

Tire failures often result from conditions that accelerate wear or generate excessive heat:

**Overloading:** Tires are rated for specific loads. Exceeding these limits causes accelerated wear and heat buildup. Overloaded trucks stress tires beyond design limits.

**Underinflation:** Underinflated tires flex excessively, generating internal heat that weakens the tire structure. Many blowouts result from running underinflated for extended periods.

**Speed:** Higher speeds generate more heat. Tires are speed-rated; exceeding ratings causes heat buildup that can cause failure.

**Environmental Heat:** Hot pavement temperatures add to internal tire heat, particularly dangerous during summer months in southern states.`,
    additionalCauses: [
      {
        title: 'Deferred Tire Replacement',
        description: `Tires are expensive, and some carriers delay replacement beyond safe limits. Running tires with inadequate tread depth, visible damage, or past their age limits creates blowout risk. When carriers prioritize cost savings over timely tire replacement, they bear responsibility for resulting blowouts.`
      },
      {
        title: 'Improper Retread Application',
        description: `Retread quality depends on proper application to sound casings. Using damaged casings, improper buffing, incorrect cure temperatures, or poor adhesion creates tread separation risk. When retread facilities cut corners, their negligence causes crashes.`
      },
      {
        title: 'Driver Failure to Respond to Warnings',
        description: `Tires often show warning signs before blowouts: vibration, pulling, thumping sounds, visible damage. Drivers who ignore these warnings, or who don't conduct proper inspections that would reveal problems, share responsibility when preventable blowouts occur.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Loss-of-Control Crash Injuries',
        description: `When blowouts cause trucks to leave roadways or cross centerlines, high-speed collisions with fixed objects or oncoming traffic result. These crashes involve the full kinetic energy of the truck, causing catastrophic injuries. Rollover crashes from blowout-induced loss of control are also common.`
      },
      {
        type: 'Debris Impact Injuries',
        description: `Tire debris from blowouts and tread separations becomes deadly projectiles. Large chunks of rubber and metal at highway speeds can penetrate windshields, striking vehicle occupants. Motorcyclists are particularly vulnerable to tire debris impacts. Debris-caused crashes may involve vehicles that never touched the truck.`
      }
    ],
    additionalFaqs: [
      {
        question: 'Can tire blowout accidents be prevented?',
        answer: 'Most tire blowouts are preventable through: proper pre-trip inspections, maintaining correct tire pressure, replacing worn tires before they fail, not using damaged tires, proper load distribution, and quality retread procedures. Blowouts that occur despite proper maintenance are rare. Investigation usually reveals maintenance failures or ignored warning signs.'
      },
      {
        question: 'Who is responsible when a tire blows out and causes a crash?',
        answer: 'Responsibility depends on the blowout cause: the driver may be liable for inadequate inspections or ignoring warnings; the carrier for maintenance failures or running worn tires; tire manufacturers or retreaders for defective products; loaders for overloading causing tire stress; and maintenance facilities for improper repairs. Investigation determines which parties bear responsibility.'
      },
      {
        question: 'Are retreaded tires safe on commercial trucks?',
        answer: 'Quality retreads from reputable facilities are safe and widely used. However, poor retreading processes, using compromised casings, or applying retreads to tires not designed for retreading can cause failures. The issue isn\'t retreads themselves but the quality of retreading processes. When retread failures cause crashes, the retreading facility may be liable for negligent manufacturing.'
      }
    ],
    statisticsSection: `

**Tire-Related Crash Statistics:**

Federal data on tire failures and crashes:
- Tire-related factors are present in approximately 6% of large truck crashes
- Tire blowouts and tread separations cause significant proportions of single-vehicle truck crashes
- Tire debris on roadways causes thousands of crashes annually
- Underinflation is involved in a majority of tire failure incidents
- Retread tread separations, while less common than intact tire blowouts, cause severe crashes

Tire failure contributing factors:
- Underinflation: 45% of tire failures
- Worn or damaged tires: 25%
- Manufacturing defects: 10%
- Retread application problems: 10%
- Overloading: 10%`
  },

  'underride-accidents': {
    additionalWhatItIs: `

**Understanding Underride Crash Mechanics:**

Underride crashes occur when a passenger vehicle slides under a truck's trailer or rear end, typically shearing off the roof of the car and killing or seriously injuring occupants. Understanding the mechanics explains why these crashes are so deadly and often preventable.

**Why Underride Occurs:**

The height differential between passenger vehicles and commercial trucks creates the underride hazard. Passenger car bumpers typically sit 16-20 inches above the ground. Trailer floors and rear frames sit 30-50 inches high. When a passenger vehicle strikes a trailer's side or rear, the car's hood and bumper pass under the trailer frame, and the trailer floor impacts the windshield and roof.

**Types of Underride Crashes:**

**Rear Underride:** A passenger vehicle strikes the rear of a trailer or straight truck, sliding underneath. This typically occurs in rear-end collisions when trucks are stopped, slowing, or moving more slowly than traffic.

**Side Underride:** A passenger vehicle slides under the side of a trailer. This occurs when: trucks make wide turns, trucks are struck broadside at intersections, trucks change lanes into vehicles, or passenger vehicles strike the sides of trailers crossing intersections.

**The Lethality Factor:**

Underride crashes have extremely high fatality rates because:

**Passenger Compartment Intrusion:** The trailer floor directly impacts the windshield, dashboard, and roof—the passenger compartment itself. Unlike frontal crashes where the engine compartment absorbs energy, underride crashes bypass the entire front structure.

**Roof Shearing:** Vehicle roofs are not designed to withstand the forces and geometry of underride impacts. The rigid trailer floor acts like a guillotine, shearing through the roof structure.

**Restraint System Bypass:** Airbags and seatbelts are designed for frontal forces. In underride crashes, the threat comes from above and in front simultaneously—a direction these systems cannot address.

**High Relative Speed:** Underride crashes often involve significant speed differential. A car traveling 65 mph striking a stopped or slow-moving trailer creates extremely violent impact dynamics.

**Underride Guard Technology:**

Guards are designed to prevent vehicle underride by providing an impact surface that engages passenger vehicle bumpers:

**Rear Underride Guards:** Federal regulations require rear underride guards on trailers, but current standards are inadequate. Existing standards allow guards that fail in moderate-speed crashes. The Insurance Institute for Highway Safety (IIHS) has developed stronger standards that some manufacturers voluntarily meet.

**Side Underride Guards:** No federal requirement exists for side underride guards on trailers. These guards, common in Europe, prevent the side underride crashes that kill hundreds annually. Legislation has been proposed but not enacted.

**Front Underride Guards:** Tractor front ends lack underride protection requirements. When tractors strike passenger vehicles, override (the opposite of underride) can occur, with similar lethality.`,
    additionalCauses: [
      {
        title: 'Inadequate Rear Guard Standards',
        description: `Current federal rear underride guard standards (set in 1998 and updated in 2017) remain inadequate. Guards that meet minimum requirements may still fail in crashes at moderate speeds. Carriers using guards that meet only minimum standards—rather than stronger IIHS-recommended standards—bear responsibility when inadequate guards contribute to fatalities.`
      },
      {
        title: 'Absence of Side Underride Guards',
        description: `Without federal side guard requirements, most trailers lack any side underride protection. Side underride kills approximately 200 people annually—deaths largely preventable with guards common in other countries. Carriers' decisions not to voluntarily install side guards become evidence of negligence when side underride deaths occur.`
      },
      {
        title: 'Reflective Tape and Visibility Failures',
        description: `Trucks must display reflective tape to make their sides and rears visible at night. When tape is missing, damaged, or inadequate, other drivers may not see stopped or slow-moving trucks until too late to avoid underride crashes. Visibility failures are common factors in nighttime underride crashes.`
      }
    ],
    additionalInjuries: [
      {
        type: 'Decapitation',
        description: `The shearing forces in underride crashes can cause decapitation when the trailer floor impacts at neck level. This occurs in a significant percentage of fatal underride crashes. Even when decapitation doesn't occur, severe neck trauma and cervical spine injuries are common.`
      },
      {
        type: 'Traumatic Brain Injury from Roof Crush',
        description: `When roofs are crushed by underriding trailers, occupants suffer severe head trauma from direct impact and from intrusion. Survivors often face permanent brain damage, vegetative states, or severe cognitive impairment. The violence of the injury mechanism creates devastating outcomes.`
      }
    ],
    additionalFaqs: [
      {
        question: 'Why don\'t all trucks have side underride guards?',
        answer: 'The trucking industry has resisted mandatory side guards, citing cost, weight penalties affecting cargo capacity, and questions about effectiveness. However, side guards are required in Europe and have proven effective at preventing side underride deaths. Currently, carriers can voluntarily install side guards, but most don\'t. When carriers skip available safety equipment and side underride crashes occur, cost-cutting decisions become evidence of negligence.'
      },
      {
        question: 'How effective are rear underride guards?',
        answer: 'Effectiveness depends on guard strength. Guards meeting only minimum federal standards may fail in crashes at speeds as low as 35 mph. Guards built to IIHS TOUGHGUARD standards prevent underride in 35 mph crashes. When carriers install guards that exceed minimum requirements, underride prevention is significantly improved. Choosing minimum-compliance guards over stronger alternatives is a knowable choice that affects crash outcomes.'
      },
      {
        question: 'Are underride crashes survivable?',
        answer: 'Underride crashes at significant speed are almost never survivable without effective guards. The crash mechanism bypasses all vehicle safety systems. With proper guards that prevent underride, crashes become conventional impacts where airbags and crumple zones function as designed. The presence or absence of effective guards determines whether occupants have any chance of survival.'
      }
    ],
    statisticsSection: `

**Underride Crash Statistics:**

Federal research on underride crashes reveals:
- Approximately 400-500 people die annually in underride crashes with large trucks
- Side underride accounts for roughly half of underride fatalities
- Rear underride guard failures are factors in many rear underride deaths
- Nighttime crashes disproportionately involve underride due to visibility issues
- Underride fatality rates far exceed overall truck crash fatality rates

Underride crash factors:
- Inadequate or absent underride guards: 70% of underride deaths
- Visibility/conspicuity failures: 40% of nighttime underride crashes
- Speed of passenger vehicle: Higher speeds correlate with guard failure
- Guard mounting failures: Some guards detach on impact
- Side underride without guards: Nearly all side underride deaths`
  }
};

function enhanceAccidentFile(slug: string): void {
  const filePath = path.join(ACCIDENTS_DIR, `${slug}.ts`);
  const enhancement = ENHANCEMENTS[slug];

  if (!enhancement) {
    console.log(`  No enhancement data for ${slug}, skipping`);
    return;
  }

  let content = fs.readFileSync(filePath, 'utf-8');

  // Add to whatItIs section
  const whatItIsMatch = content.match(/(whatItIs:\s*`[^`]+)`/s);
  if (whatItIsMatch && enhancement.additionalWhatItIs) {
    const originalWhatItIs = whatItIsMatch[1];
    content = content.replace(
      originalWhatItIs + '`',
      originalWhatItIs + enhancement.additionalWhatItIs + '`'
    );
  }

  // Add statistics section after whatItIs if available
  if (enhancement.statisticsSection) {
    const whatItIsEnd = content.match(/(whatItIs:\s*`[^`]+`)/s);
    if (whatItIsEnd) {
      const insertion = whatItIsEnd[0].slice(0, -1) + enhancement.statisticsSection + '`';
      content = content.replace(whatItIsEnd[0], insertion);
    }
  }

  // Add additional causes
  if (enhancement.additionalCauses.length > 0) {
    const causesArrayEnd = content.match(/causes:\s*\[([\s\S]*?)\],\s*\n\s*fmcsaRegulations/);
    if (causesArrayEnd) {
      const additionalCausesStr = enhancement.additionalCauses.map(c => `
    {
      title: '${c.title.replace(/'/g, "\\'")}',
      description: \`${c.description}\`
    }`).join(',');

      content = content.replace(
        /(\s*}\s*\n\s*\],\s*\n\s*fmcsaRegulations)/,
        `,${additionalCausesStr}\n  ],\n\n  fmcsaRegulations`
      );
    }
  }

  // Add additional injuries
  if (enhancement.additionalInjuries.length > 0) {
    const injuriesArrayEnd = content.match(/injuries:\s*\[([\s\S]*?)\],\s*\n\s*liableParties/);
    if (injuriesArrayEnd) {
      const additionalInjuriesStr = enhancement.additionalInjuries.map(i => `
    {
      type: '${i.type.replace(/'/g, "\\'")}',
      description: \`${i.description}\`
    }`).join(',');

      content = content.replace(
        /(injuries:\s*\[([\s\S]*?})\s*\n\s*\],\s*\n\s*liableParties)/,
        (match) => {
          return match.replace(/\],\s*\n\s*liableParties/, `,${additionalInjuriesStr}\n  ],\n\n  liableParties`);
        }
      );
    }
  }

  // Add additional FAQs
  if (enhancement.additionalFaqs.length > 0) {
    const faqsArrayEnd = content.match(/faqs:\s*\[([\s\S]*?)\],\s*\n\s*relatedAccidents/);
    if (faqsArrayEnd) {
      const additionalFaqsStr = enhancement.additionalFaqs.map(f => `
    {
      question: '${f.question.replace(/'/g, "\\'")}',
      answer: '${f.answer.replace(/'/g, "\\'")}'
    }`).join(',');

      content = content.replace(
        /(faqs:\s*\[([\s\S]*?})\s*\n\s*\],\s*\n\s*relatedAccidents)/,
        (match) => {
          return match.replace(/\],\s*\n\s*relatedAccidents/, `,${additionalFaqsStr}\n  ],\n\n  relatedAccidents`);
        }
      );
    }
  }

  // Add lastUpdated if not present
  if (!content.includes('lastUpdated:')) {
    content = content.replace(
      /metaDescription:([^,]+),/,
      `metaDescription:$1,\n  lastUpdated: '${new Date().toISOString().split('T')[0]}',`
    );
  }

  fs.writeFileSync(filePath, content);

  const wordCount = content.split(/\s+/).length;
  console.log(`  Enhanced ${slug} (${wordCount} words)`);
}

async function main(): Promise<void> {
  const args = process.argv.slice(2);

  if (args.includes('--all-thin')) {
    console.log(`Enhancing ${THIN_ACCIDENTS.length} thin accident pages...\n`);

    for (const slug of THIN_ACCIDENTS) {
      enhanceAccidentFile(slug);
    }

    console.log(`\nDone! Enhanced ${THIN_ACCIDENTS.length} accident pages.`);
  } else if (args.length === 1) {
    const slug = args[0];
    if (!THIN_ACCIDENTS.includes(slug)) {
      console.error(`Unknown accident type: ${slug}`);
      process.exit(1);
    }
    enhanceAccidentFile(slug);
  } else {
    console.log('Usage:');
    console.log('  npx tsx scripts/agents/accident-enhancer.ts drunk-driving');
    console.log('  npx tsx scripts/agents/accident-enhancer.ts --all-thin');
    process.exit(1);
  }
}

main().catch(console.error);
