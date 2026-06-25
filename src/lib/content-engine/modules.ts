/**
 * Slot-based prose modules. Each section is composed from several slots; each slot
 * has a pool of distinct, freshly written sentences. A city's hash picks one sentence
 * per slot (different salt per slot), and real facts are injected into the sentence.
 *
 * Why slots: N slots x M options = N^M combinations from a small amount of prose, so
 * curated pages rarely collide on every slot. Real-fact injection (county, FARS counts,
 * nearest cities, region, size tier) pushes same-tier pages apart further.
 *
 * Rules honored: no invented local facts. Only county (verified), FARS counts, region
 * pattern, population/rank, nearest cities (verified coords), and size tier are woven in.
 * Roads/hospitals/courts/SOL are never asserted. Federal/FMCSA content is GENERAL,
 * written fresh, not copied from the old template.
 */
import type { CityProfile } from './profile';
import { selectIndex } from './hash';
import { nearbyCities } from './nearby';

type Slot = (p: CityProfile, ctx: Ctx) => string;
interface Ctx { n1: string | null; n2: string | null; n3: string | null }

// Real nearby-city phrase (verified coords). High-entropy, survives normalization.
const nearList = (c: Ctx): string =>
  [c.n1, c.n2, c.n3].filter(Boolean).join(', ');

function compose(p: CityProfile, ctx: Ctx, seed: string, slots: { salt: string; pool: Slot[] }[]): string {
  return slots.map(({ salt, pool }) => pool[selectIndex(seed, salt, pool.length)](p, ctx)).filter(Boolean).join(' ');
}

const countyPhrase = (p: CityProfile) => (p.county ? `${p.county} County` : `the surrounding county`);
const placePhrase = (p: CityProfile) => `${p.name}, ${p.stateName}`;
const sizePhrase = (p: CityProfile) =>
  p.sizeTier === 'metro' ? 'a major population center'
  : p.sizeTier === 'mid' ? 'a mid-sized city'
  : 'a smaller community';
const mech = (p: CityProfile) =>
  p.dominantMechanism?.type?.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toLowerCase()).trim() || 'collision';
const farsClause = (p: CityProfile) =>
  p.truckFatalities > 0
    ? `${p.truckFatalities} ${p.truckFatalities === 1 ? 'person was' : 'people were'} killed in ${p.fatalCrashes} truck-involved ${p.fatalCrashes === 1 ? 'crash' : 'crashes'} here in ${p.dataYear}`
    : `no truck-involved fatalities were recorded here in ${p.dataYear}, though serious injury crashes are not captured in that figure`;

// ================= HERO =================
const heroSlots: { salt: string; pool: Slot[] }[] = [
  { salt: 'h-open', pool: [
    (p, c) => `If a tractor-trailer hurt you in ${placePhrase(p)}, the clock on the evidence starts the moment the wreck ends${c.n1 ? `, whether the truck was bound for ${c.n1} or just passing through` : ''}.`,
    (p) => `A truck crash in ${placePhrase(p)} is not a bigger car crash — it is a different kind of case, with different rules and different defendants spread across ${countyPhrase(p)}.`,
    (p, c) => `When an 18-wheeler causes injuries in ${placePhrase(p)}, the carrier's insurer is already working the file${c.n1 ? `, from ${c.n1} to the courthouse` : ''}; an injured person should not be the last to start.`,
    (p) => `Surviving a collision with a loaded truck in ${placePhrase(p)} is the beginning of a fight over records most people in ${countyPhrase(p)} never knew existed.`,
    (p, c) => `A wreck with a commercial truck on the routes through ${placePhrase(p)}${c.n1 ? ` and ${c.n1}` : ''} can change a life in seconds, then turn into a months-long contest over proof.`,
  ]},
  { salt: 'h-fact', pool: [
    (p) => `Federal data show ${farsClause(p)} in ${countyPhrase(p)}, according to NHTSA's FARS file.`,
    (p) => `Per NHTSA's crash records, ${farsClause(p)} across ${countyPhrase(p)}.`,
    (p) => `The most recent federal count shows ${farsClause(p)} in the ${countyPhrase(p)} area.`,
    (p) => `NHTSA's fatality records note that ${farsClause(p)} in ${countyPhrase(p)}.`,
  ]},
  { salt: 'h-close', pool: [
    (p) => `This page explains what to do, why these cases differ, what proof matters, and who can be held responsible — grounded in ${countyPhrase(p)} and federal trucking law.`,
    (p, c) => `Below: the first steps, the evidence that decides these claims, and the parties who may owe you${c.n1 ? `, from local fleets to carriers based near ${c.n1}` : ''}.`,
    (p) => `Read on for the practical answers — immediate steps, the records that win or lose these cases, and how ${p.regionName ?? 'the regional'} crash pattern shapes the investigation in ${countyPhrase(p)}.`,
    (p) => `What follows is the honest version: the urgent moves, the electronic proof, the defendants beyond the driver, and where ${p.stateName} law takes over across ${countyPhrase(p)}.`,
  ]},
];

// ================= WHY DANGEROUS =================
const whyDangerousSlots: { salt: string; pool: Slot[] }[] = [
  { salt: 'w-frame', pool: [
    (p) => `As ${sizePhrase(p)} in ${p.regionName ?? 'the region'}, ${p.name} sees freight move through it, and freight moving at highway weights leaves little room for error.`,
    (p) => `${p.name} sits in ${p.regionName ?? 'a freight corridor region'}, where commercial trucks share the same roads as everyone's commute.`,
    (p) => `Truck risk in ${p.name} tracks the region it belongs to: ${p.regionName ?? 'this part of the country'} carries its own mix of crash types.`,
    (p) => `Whatever its size, ${p.name} is a place where loaded trucks and ordinary traffic occupy the same lanes, and that overlap is where people get hurt.`,
  ]},
  { salt: 'w-mech', pool: [
    (p) => p.dominantMechanism ? `Across ${p.regionName ?? 'this region'}, the ${mech(p)} is the most common serious truck collision — about ${p.dominantMechanism.percentage}% of the regional pattern — and it leaves its own kind of evidence trail.` : `Heavy vehicles fail in predictable ways, and each failure mode calls for different proof.`,
    (p) => p.dominantMechanism ? `The collision type that shows up most for ${p.name} drivers is the ${mech(p)}, which runs near ${p.dominantMechanism.percentage}% of crashes regionally and shapes how a claim gets built.` : `The way a truck crash happens shapes the whole case.`,
    (p) => p.dominantMechanism ? `Regionally, ${mech(p)} crashes dominate the serious-injury picture at roughly ${p.dominantMechanism.percentage}%, and knowing that shapes which records to chase first.` : `Each failure mode points to different proof.`,
    (p) => p.dominantMechanism ? `In this part of the country the ${mech(p)} accounts for the largest share of bad truck wrecks — near ${p.dominantMechanism.percentage}% — so the investigation starts by reading the scene for its signature.` : `How a truck fails dictates what to look for first.`,
    (p) => p.dominantMechanism ? `For ${p.name}, the regional data put the ${mech(p)} at the top of the serious-crash list, around ${p.dominantMechanism.percentage}%, which tells an investigator where to look before the evidence moves.` : `The mechanism of a crash drives the entire investigation.`,
  ]},
  { salt: 'w-physics', pool: [
    () => `A fully loaded combination vehicle can weigh sixteen times what a sedan does, so the same impact that dents a car can be fatal to the people inside it.`,
    () => `Stopping distance is the quiet killer: a loaded rig needs far more room to halt than the car ahead of it, and physics does not negotiate.`,
    () => `Trucks carry their weight high and long, which is why a sudden lane change or panic stop can turn into a rollover or a jackknife.`,
    () => `Eighty thousand pounds does not stop, swerve, or forgive the way a passenger car does, and that mismatch decides who walks away.`,
  ]},
  { salt: 'w-cause', pool: [
    () => `Most of these wrecks trace back to pressure on the schedule — hours pushed past the limit, maintenance deferred, a driver hired without a hard look at the record.`,
    () => `Behind a lot of truck crashes is a business decision: a tight delivery window, a skipped inspection, a load that was not secured the way the rules require.`,
    () => `Fatigue, speed for conditions, and equipment that was overdue for service show up again and again when these crashes are investigated.`,
    () => `When investigators dig in, the cause is often something the company could have controlled — rest, repairs, screening — rather than a freak event.`,
  ]},
  { salt: 'w-local', pool: [
    (p, c) => c.n1 ? `Freight does not respect city limits: trucks serving ${p.name} also move between nearby ${c.n1}${c.n2 ? ` and ${c.n2}` : ''}, so a local crash can involve a carrier from down the road or across the country.` : `Trucks serving ${p.name} often originate elsewhere, so a local crash can pull in an out-of-area company.`,
    (p, c) => c.n1 ? `Because ${p.name} shares its road network with ${c.n1}${c.n2 ? `, ${c.n2},` : ''} and other neighbors, the truck that hit you may belong to a fleet based far outside ${countyPhrase(p)}.` : `The truck that hit you may belong to a fleet based well outside ${countyPhrase(p)}.`,
  ]},
];

// ================= LIABILITY =================
const liabilitySlots: { salt: string; pool: Slot[] }[] = [
  { salt: 'l-open', pool: [
    (p) => `Figuring out who owes you after a truck crash in ${p.name} usually means looking past the driver.`,
    (p) => `A ${p.name} truck case rarely has a single defendant, and that is often where the real recovery is.`,
    (p) => `The driver is the obvious party in a ${p.name} crash; the company behind them is frequently the responsible one.`,
    (p) => `Liability in a ${p.name} truck wreck tends to branch outward from the cab to a chain of businesses.`,
  ]},
  { salt: 'l-carrier', pool: [
    () => `The motor carrier that employed the driver can be on the hook both for the driver's conduct and for its own choices — who it hired, how it trained, whether it ignored a pattern of violations.`,
    () => `Trucking companies answer for their drivers under long-standing employer-liability rules, and separately for negligent hiring, supervision, or retention when the record warranted a different call.`,
    () => `A carrier's own paperwork often tells on it: a driver kept on despite failed inspections, or a safety rating the company knew was slipping.`,
    () => `Beyond the driver's mistakes, the carrier can be liable for putting an unfit driver or an unsafe truck on the road in the first place.`,
  ]},
  { salt: 'l-third', pool: [
    () => `Others can share fault too — the broker that arranged the load, the shipper that packed it, a maintenance contractor, or the maker of a defective brake or tire.`,
    () => `Cargo that was loaded wrong, a part that failed, or a separate company that controlled the trip can each pull another insurance policy into the case.`,
    () => `Brokers, shippers, leasing companies, and parts manufacturers all turn up as defendants when the facts point their way.`,
    () => `Sometimes the decisive negligence belongs to a company you never see on the road — the one that hired the carrier, or built the failed component.`,
  ]},
  { salt: 'l-insurance', pool: [
    () => `Because interstate carriers must carry large federal liability minimums, identifying every responsible company is what unlocks enough coverage to make a catastrophic injury whole.`,
    () => `The layers of insurance behind a commercial truck are deep, but only for the defendants you actually name and prove — which is why the investigation matters as much as the crash.`,
    () => `Each additional liable party can mean another policy, and serious truck injuries routinely exhaust more than one.`,
    () => `Finding all the responsible businesses is not about spreading blame; it is about reaching the coverage a serious injury actually requires.`,
  ]},
  { salt: 'l-state', pool: [
    (p) => `How shared fault is handled is set by ${p.stateName} law, and the specific rule and filing deadline should be confirmed with a licensed ${p.stateName} attorney rather than assumed.`,
    (p) => `${p.stateName}'s rules on comparative fault and time limits control the outcome; those specifics are state law and warrant a lawyer's confirmation, not a guess from a web page.`,
    (p) => `Whether partial fault reduces or bars recovery depends on ${p.stateName} law — a question for a licensed attorney, not a template.`,
  ]},
];

// ================= EVIDENCE =================
const evidenceSlots: { salt: string; pool: Slot[] }[] = [
  { salt: 'e-open', pool: [
    (p) => `The proof that decides a ${p.name} truck case starts disappearing within days, sometimes hours.`,
    (p) => `Unlike a fender-bender, a truck crash in ${p.name} generates electronic records that can be overwritten on a schedule the carrier controls.`,
    (p) => `Winning a ${p.name} truck claim is mostly about securing records before they are gone.`,
    (p) => `In a ${p.name} truck case, the evidence is half physical and half digital, and the digital half has an expiration date.`,
  ]},
  { salt: 'e-eld', pool: [
    () => `Electronic logging devices show how long the driver had been working and whether the federal rest rules were broken; that data can roll off after a set retention window.`,
    () => `The driver's hours-of-service logs are now electronic, and they reveal fatigue violations — but only if they are preserved before the system cycles them out.`,
    () => `Hours-of-service data sits in the truck's logging device and in the carrier's back office, and both copies have expiration dates unless someone demands they be kept.`,
    () => `The logging device is where a fatigued-driving case is proven or lost, and its memory is not kept forever.`,
  ]},
  { salt: 'e-ecm', pool: [
    () => `The engine control module — the truck's black box — captures speed, braking, and throttle in the seconds before impact, and a repair or a sale can wipe it.`,
    () => `Onboard control modules record what the driver did right before the crash, which is why getting the truck impounded before it is fixed can make or break the case.`,
    () => `Speed and brake-application data live in the truck's computer, and that hardware can be cleared the moment the rig goes back into service.`,
    () => `What the truck itself recorded in the final seconds is often the most objective witness, and also the easiest to erase.`,
  ]},
  { salt: 'e-docs', pool: [
    () => `Maintenance files, the driver qualification file, dispatch messages, and the bill of lading all fill in the story, and federal rules only require carriers to keep them so long.`,
    () => `Inspection reports, training records, and trip paperwork show whether the company cut corners — records that quietly age out of mandatory retention.`,
    () => `The carrier's own files — repairs, hiring, dispatch, cargo — are often the strongest evidence and the least likely to survive without a preservation demand.`,
    () => `Paper and email tell you what the company knew and when: maintenance it skipped, warnings it ignored, hours it tolerated.`,
  ]},
  { salt: 'e-spoliation', pool: [
    () => `A prompt spoliation letter puts the carrier on legal notice to preserve all of it; skip that step and the most important proof can vanish lawfully.`,
    () => `Sending a written hold notice fast creates a duty to preserve and real consequences for destruction — the single most time-sensitive move after a serious crash.`,
    () => `Once a formal preservation letter goes out, routine deletion stops being an excuse; sending it early is everything.`,
    () => `The first job of a truck-crash lawyer is usually a letter, not a lawsuit: a demand that every record be frozen in place.`,
  ]},
  { salt: 'e-scene', pool: [
    () => `On the human side, the police report, scene photos, dashcam or nearby surveillance, and prompt medical documentation lock down facts that memories blur.`,
    () => `Witness accounts fade and skid marks wash away, so the official report, photographs, and any video should be gathered while they still exist.`,
    () => `Medical records that connect the injuries to the crash, plus photos and any camera footage, anchor the parts of the case that are not electronic.`,
  ]},
];

// ================= FMCSA (general/federal) =================
const fmcsaSlots: { salt: string; pool: Slot[] }[] = [
  { salt: 'f-open', pool: [
    () => `Interstate trucks run under the Federal Motor Carrier Safety Regulations, and a violation is often the clearest evidence of negligence.`,
    () => `The federal rulebook for commercial trucking sets floors that, when broken, frequently explain how a crash happened.`,
    () => `Most large trucks are governed by federal safety rules, and those rules give an injured person a concrete standard to hold the company to.`,
    () => `Commercial carriers operate inside a detailed federal scheme, and gaps between the rule and the conduct are where these cases are won.`,
    () => `A web of federal regulations sits behind every interstate truck, and each requirement is a place the company can be measured against its own conduct.`,
    () => `When a commercial truck crashes, the federal safety code is the yardstick, and proving the carrier fell short of it is often the heart of the claim.`,
  ]},
  { salt: 'f-hos', pool: [
    () => `Hours-of-service limits cap driving time and force rest breaks to fight fatigue; logging-device data is where those limits are proven or disproven.`,
    () => `Federal rest rules restrict how long a driver may be behind the wheel, and the electronic logs show whether the schedule respected them.`,
    () => `The fatigue rules are specific — daily and weekly driving caps, mandatory breaks — and the truck's own logs reveal whether they held.`,
    () => `A driver may only be on the road so many hours before a required break, and the device that tracks it does not forget what the driver was told to do.`,
    () => `Federal limits on driving hours exist precisely because tired drivers crash, and the logging record is the proof of whether those limits were honored.`,
  ]},
  { salt: 'f-driver', pool: [
    () => `Carriers must vet drivers, keep a qualification file, and pull them from duty when medical or licensing standards lapse — duties that are easy to document and easy to skip.`,
    () => `The rules require driver screening, ongoing fitness checks, and a maintained personnel file, all of which become evidence when something goes wrong.`,
    () => `A motor carrier is supposed to confirm a driver is licensed, medically fit, and trained, and to keep the proof; missing proof is its own kind of admission.`,
    () => `Before a driver is trusted with eighty thousand pounds, the carrier owes a real vetting — background, medical, qualification — and the file shows whether it bothered.`,
    () => `Federal rules make the company responsible for who it puts behind the wheel, from the initial screening to yanking a driver whose medical card has lapsed.`,
  ]},
  { salt: 'f-maint', pool: [
    () => `Inspection, repair, and cargo-securement standards round out the federal scheme, and gaps in those records often line up with the cause of the wreck.`,
    () => `Maintenance and load-securing rules leave a paper trail, and missing or sloppy records tend to point straight at the failure.`,
    () => `The regulations also govern upkeep and how freight is secured, so a brake out of adjustment or a shifted load can be both the cause and the violation.`,
    () => `Federal standards dictate how trucks are inspected, repaired, and loaded, and a maintenance log with holes in it tends to tell on the company.`,
    () => `From brake adjustment to tie-down strength, the rules cover the mechanical side, and the records either show diligence or show neglect.`,
  ]},
];

// ================= TRUCKING INDUSTRY (county/region framing, no invented companies) =================
const truckingIndustrySlots: { salt: string; pool: Slot[] }[] = [
  { salt: 't-open', pool: [
    (p) => `Freight reaches ${p.name} the way it reaches most of ${countyPhrase(p)}: by truck, day and night.`,
    (p) => `Commercial trucking in and around ${p.name} is part of the regional freight network rather than a single local hub.`,
    (p) => `The trucks on ${p.name}'s roads are mostly passing through or serving ${countyPhrase(p)}'s businesses.`,
    (p) => `Trucking around ${p.name} is less a local industry than a slice of a national supply chain rolling through ${countyPhrase(p)}.`,
  ]},
  { salt: 't-mix', pool: [
    (p) => p.sizeTier === 'metro'
      ? `In a market the size of ${countyPhrase(p)}, long-haul carriers, regional fleets, and a growing wave of delivery vans all crowd the same corridors.`
      : `Even outside the big metros, interstate carriers and regional haulers pass through ${countyPhrase(p)}, which is why local crashes can involve out-of-state companies.`,
    (p, c) => p.sizeTier === 'metro'
      ? `A metro this large pulls constant freight through ${countyPhrase(p)} — national fleets, last-mile delivery, everything between — onto roads not built for the volume.`
      : `Smaller communities like ${p.name} still sit on freight routes${c.n1 ? ` linking ${c.n1} and beyond` : ''}, so the trucks in local wrecks often answer to companies headquartered elsewhere.`,
    (p, c) => `The mix runs from owner-operators to national fleets moving between ${nearList(c) || countyPhrase(p)}, and the responsible company is not always the name painted on the trailer.`,
  ]},
  { salt: 't-note', pool: [
    (p) => `Specific ${countyPhrase(p)} terminals, distribution centers, and carrier names are not listed here because reliable, current local sourcing was not available — a gap worth filling before relying on it.`,
    (p) => `We do not name particular ${countyPhrase(p)} facilities or companies without a verified source; doing so accurately requires data this page does not yet have.`,
    (p) => `Rather than guess at the names of depots or fleets operating across ${countyPhrase(p)}, this page leaves that detail out until it can be sourced and checked.`,
    (p) => `Naming the ${countyPhrase(p)} hubs and carriers would take verified records we do not yet have, so the page stays honest about that gap instead of inventing specifics.`,
  ]},
  { salt: 't-local', pool: [
    (p, c) => nearList(c) ? `The same freight routes tie ${p.name} to nearby ${nearList(c)}, so a crash here can involve a truck that was loading or unloading a county or two away.` : `Freight here connects to the wider regional network, so a local crash can involve a truck based well outside town.`,
    (p, c) => nearList(c) ? `A truck-injury claim in ${p.name} often reaches into ${nearList(c)} and the rest of the corridor, because the carriers and witnesses are rarely all in one town.` : `Truck claims here often reach across the corridor, because the carriers and witnesses are rarely all local.`,
    (p, c) => nearList(c) ? `Drivers running through ${p.name} are usually moving between it and places like ${nearList(c)}, which is why these cases tend to pull in records from more than one location.` : `Drivers here are usually moving through, which is why these cases pull records from more than one place.`,
  ]},
];

// ================= LEGAL INFO (venue name only; SOL deliberately not asserted) =================
const legalInfoSlots: { salt: string; pool: Slot[] }[] = [
  { salt: 'g-venue', pool: [
    (p) => p.county ? `A truck-injury claim arising in ${p.name} would generally be handled in the ${p.stateName} courts that cover ${p.county} County.` : `A truck-injury claim arising in ${p.name} would generally be handled in the ${p.stateName} courts covering that area.`,
    (p) => p.county ? `Venue for a ${p.name} crash typically falls to the ${p.stateName} trial court for ${p.county} County.` : `Venue for a ${p.name} crash typically falls to the local ${p.stateName} trial court.`,
    (p) => p.county ? `A case from ${p.name} would ordinarily be filed in the ${p.stateName} court serving ${p.county} County.` : `A case from ${p.name} would ordinarily be filed in the local ${p.stateName} court.`,
  ]},
  { salt: 'g-sol', pool: [
    (p) => `${p.stateName} sets the deadline to file and the rule for shared fault, and both are specific enough that they should be confirmed with a licensed attorney rather than taken from a web page.`,
    (p) => `The filing deadline in ${p.stateName} is a hard cutoff that varies by claim type; treat any number you read online as a prompt to call a lawyer, not as legal advice.`,
    (p) => `Time limits and fault rules in ${p.stateName} are strict and fact-dependent, which is exactly why a licensed attorney should confirm them for your situation.`,
    (p) => `Miss the ${p.stateName} deadline and the strongest case in the world is over, so the date — which depends on the facts — is something to nail down with a lawyer early.`,
    (p) => `How ${p.stateName} treats partial fault and how long you have to file are not details to guess at; they decide whether and how much you recover.`,
  ]},
  { salt: 'g-process', pool: [
    () => `Most cases open with an investigation and evidence-preservation phase, move into a demand once the injuries are understood, and resolve in settlement far more often than in trial.`,
    () => `The usual path runs from investigation to a demand on the carrier's insurer to negotiation, with trial held in reserve.`,
    () => `Expect an early evidence push, then medical treatment to a stable point, then a demand and negotiation — with court as the backstop, not the default.`,
    () => `These claims tend to move in stages: lock down the proof, let the injuries declare themselves, then press the carrier's insurer, filing suit only if the number stays unfair.`,
    () => `The arc is investigation first, recovery second, and resolution third, and the cases that end well are the ones where the evidence work happened up front.`,
  ]},
];

export const buildModules = (p: CityProfile) => {
  const seed = `${p.stateSlug}/${p.slug}`;
  const near = nearbyCities(p.stateSlug, p.slug, 3);
  const ctx: Ctx = { n1: near[0]?.name ?? null, n2: near[1]?.name ?? null, n3: near[2]?.name ?? null };
  return {
    heroText: compose(p, ctx, seed, heroSlots),
    whyDangerous: compose(p, ctx, seed, whyDangerousSlots),
    liabilityExplanation: compose(p, ctx, seed, liabilitySlots),
    evidencePreservation: compose(p, ctx, seed, evidenceSlots),
    fmcsaRegulations: compose(p, ctx, seed, fmcsaSlots),
    truckingIndustry: compose(p, ctx, seed, truckingIndustrySlots),
    legalInfo: compose(p, ctx, seed, legalInfoSlots),
  };
};
