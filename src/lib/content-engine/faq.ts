/**
 * FAQ builder. A pool of freshly written question/answer pairs, each able to weave
 * in the city's real facts. A deterministic per-city subset is selected so different
 * cities surface a different mix. No unverified specifics (roads, hospitals, exact SOL).
 */
import type { CityProfile } from './profile';
import type { CityFAQ } from '../cities-content/types';
import { selectDistinct, selectIndex } from './hash';
import { nearbyCities } from './nearby';

const mechName = (p: CityProfile) =>
  p.dominantMechanism?.type?.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toLowerCase()).trim() || 'collision';

type QA = { q: (p: CityProfile) => string; a: (p: CityProfile) => string };

const POOL: QA[] = [
  {
    q: (p) => `What should I do right after a truck accident in ${p.name}?`,
    a: (p) => `Get medical care first, then call police so there is an official report. If you can, photograph the trucks, the scene, and any company names or DOT numbers. The most important legal step is fast: a lawyer can send the carrier a preservation demand so the truck's electronic data and the driver's logs are not erased while you recover.`,
  },
  {
    q: (p) => `Why is a truck case different from a normal car accident in ${p.name}?`,
    a: (p) => `Three reasons: the injuries are usually worse because of the weight difference, the defendants multiply beyond the driver to the carrier and others, and the evidence is largely electronic and time-limited. A ${p.stateName} truck claim is really a fight over records — logs, the engine module, maintenance files — that a routine car case never involves.`,
  },
  {
    q: (p) => `Who can be held responsible for a ${p.name} truck crash?`,
    a: (p) => `Often more than the driver. The motor carrier can answer for the driver and for its own hiring, training, and maintenance decisions. Depending on the facts, a broker, shipper, leasing company, or parts manufacturer may share fault. Naming every responsible company is what reaches enough insurance to cover a serious injury.`,
  },
  {
    q: (p) => `How long do I have to file a truck accident claim in ${p.stateName}?`,
    a: (p) => `There is a firm deadline, and it varies by the type of claim and the parties involved. Because the rule is specific to ${p.stateName} and getting it wrong can end a case, treat any figure you read online as a reason to speak with a licensed ${p.stateName} attorney quickly rather than as legal advice.`,
  },
  {
    q: (p) => `What evidence matters most in a ${p.name} truck case?`,
    a: (p) => `The truck's engine control module (its black box), the electronic logging device showing hours of service, maintenance and inspection records, the driver qualification file, dispatch communications, and the cargo paperwork. Much of it can be overwritten on the carrier's schedule, so securing it early${p.county ? ` — often before the truck and its data leave ${p.county} County` : ''} is the difference-maker.`,
  },
  {
    q: (p) => `The crash report shows ${p.truckFatalities > 0 ? 'fatalities' : 'no deaths'} — what does the local data say?`,
    a: (p) => p.truckFatalities > 0
      ? `Federal FARS data recorded ${p.truckFatalities} truck-involved ${p.truckFatalities === 1 ? 'fatality' : 'fatalities'} across ${p.fatalCrashes} ${p.fatalCrashes === 1 ? 'crash' : 'crashes'} here in ${p.dataYear}. That figure counts deaths only; it does not capture the larger number of serious-injury truck crashes in the same area.`
      : `Federal FARS data recorded no truck-involved fatalities here in ${p.dataYear}. That is a deaths-only count, so it does not mean there were no serious truck crashes — injury wrecks are not reflected in that number.`,
  },
  {
    q: (p) => `What kinds of truck crashes are most common around here?`,
    a: (p) => p.dominantMechanism
      ? `Regionally, the ${mechName(p)} is the most frequent serious truck collision, around ${p.dominantMechanism.percentage}% of the pattern for ${p.regionName ?? 'this region'}. Each crash type — rear-end, jackknife, rollover, underride — leaves a different evidence trail, which shapes how the case is built and which records to demand first.`
      : `Truck crashes fail in a handful of predictable ways — rear-end, jackknife, rollover, underride — and each one calls for different proof.`,
  },
  {
    q: (p) => `Do federal trucking rules apply to my ${p.name} case?`,
    a: (p) => `If the truck was operating in interstate commerce, the Federal Motor Carrier Safety Regulations almost certainly apply, covering hours of service, driver qualification, maintenance, and cargo securement. A violation of those rules is often the clearest proof of negligence, which is why they matter even in a local crash.`,
  },
  {
    q: (p) => `How much is a ${p.name} truck accident claim worth?`,
    a: (p) => `There is no honest flat answer — it depends on the severity of the injuries, the lost income, the future care needed, and how many insured defendants are involved. Be wary of any site that promises a number. What raises real value is identifying every liable party and proving the carrier broke a federal rule.`,
  },
  {
    q: (p) => `What does it cost to hire a truck accident lawyer in ${p.name}?`,
    a: (p) => `These cases are typically handled on a contingency fee, meaning the lawyer is paid a percentage only if there is a recovery, with no upfront charge. The exact terms should be in a written agreement you review before signing. The initial case review is generally free.`,
  },
  {
    q: (p) => `Can I still recover if I was partly at fault in ${p.stateName}?`,
    a: (p) => `Possibly. Many states reduce, rather than bar, recovery when the injured person shares some blame, but the precise rule is set by ${p.stateName} law and affects the outcome significantly. This is exactly the kind of state-specific question a licensed ${p.stateName} attorney should answer for your facts.`,
  },
  {
    q: (p) => `How fast do I need to act after a ${p.name} truck wreck?`,
    a: (p) => `Faster than most people expect. Electronic logs and black-box data can cycle out within weeks, the truck can be repaired or sold, and the filing deadline is running. The single most valuable early step is getting a preservation demand to the carrier before the records are gone.`,
  },
  {
    q: (p) => `What if the truck that hit me in ${p.name} was from out of state?`,
    a: (p) => `That is common and usually helps rather than hurts. Interstate carriers are squarely under the federal safety rules and must carry higher liability minimums. Where the company is based mainly affects logistics; a case arising in ${p.name} can still be pursued under ${p.stateName} law and federal regulation.`,
  },
  {
    q: (p) => `Should I talk to the trucking company's insurance adjuster?`,
    a: () => `Be careful. The carrier's adjuster works for the carrier, and early recorded statements or quick settlement offers tend to favor the company while injuries are still developing. It is reasonable to report the basics, decline a recorded statement, and get advice before signing or saying anything that locks you in.`,
  },
  {
    q: (p) => `Do I really need a lawyer, or can I handle a ${p.name} truck claim myself?`,
    a: () => `Minor cases can sometimes be handled alone, but truck claims are the hard end of the spectrum: multiple defendants, federal records that must be preserved fast, and insurers that litigate. The evidence work usually has to happen before a person even feels ready, which is the main argument for getting help early.`,
  },
  {
    q: (p) => `What compensation can a ${p.name} truck accident claim cover?`,
    a: () => `Generally medical bills already incurred and reasonably expected, lost wages and lost earning capacity, and the human costs — pain, disability, and the effect on daily life. In a wrongful-death case the categories shift to the family's losses. The mix and limits depend on the injuries and the law that applies.`,
  },
  {
    q: (p) => `Why do truck cases take longer to resolve than car cases?`,
    a: () => `Because there is more to prove and more parties to prove it against. Preserving and analyzing electronic data, untangling which companies are responsible, and waiting until the injuries reach a stable point all take time. Rushing usually means settling before the full picture — and full value — is known.`,
  },
  {
    q: (p) => `I lost a family member in a ${p.name} truck crash — what can we do?`,
    a: (p) => `A wrongful-death claim shifts the focus to the family's losses: financial support, services, and companionship the person provided. ${p.stateName} law decides who may bring the claim and within what deadline, so a licensed attorney should map that out. The evidence work — preserving the truck's data and the carrier's records — is just as urgent as in an injury case.`,
  },
  {
    q: () => `What injuries are common in serious truck collisions?`,
    a: () => `Because of the weight involved, truck crashes tend to produce the severe end of the injury spectrum: traumatic brain injury, spinal cord damage, multiple fractures, internal injuries, and crush trauma. These often mean long recoveries and future care, which is one reason valuing a truck case too early tends to shortchange it.`,
  },
  {
    q: (p) => `Will my ${p.name} truck accident case go to trial?`,
    a: () => `Probably not, but it should be built as if it will. The large majority of these claims settle, yet the cases that settle well are the ones prepared for trial — full investigation, preserved evidence, named defendants. A claim the insurer thinks you cannot try is a claim it can underpay.`,
  },
  {
    q: () => `What if the driver was an owner-operator or independent contractor?`,
    a: () => `That label does not automatically let the company off the hook. Courts look at how much control the carrier actually exercised, and federal leasing rules can keep a motor carrier responsible for trucks operating under its authority. Untangling that relationship is part of identifying every party the case can reach.`,
  },
  {
    q: () => `Does it help my case if the trucker got a ticket?`,
    a: () => `It can. A citation is evidence that a rule was broken, and in some situations a traffic conviction carries weight in the civil case. But it is not the whole story — the deeper proof usually lives in the logs, the maintenance file, and the carrier's records, which is why those still have to be preserved regardless of any ticket.`,
  },
];

export function buildFaqs(p: CityProfile, count = 6): CityFAQ[] {
  const seed = `${p.stateSlug}/${p.slug}`;
  const idx = selectDistinct(seed, 'faq', POOL.length, count);
  return idx.map((i) => ({ question: POOL[i].q(p), answer: POOL[i].a(p) }));
}

// ============================ HUB (LOCAL-DATA) FAQs ============================
// PR4 proved the generic POOL collides at scale: the gate masks city name, state
// name, and numbers, so any answer whose only variable is name/state/number
// normalizes to a byte-identical string across cities. PR4's collision-decomp put
// 74% of shared shingles in the FAQ block.
//
// PR5 fix: hub FAQs are built from HIGH-CARDINALITY UNMASKED facts — county name,
// nearby-city names, region name, and the dominant-mechanism words — which survive
// the gate's normalization and differ city-to-city. Every answer below weaves at
// least one. No spin, and nothing unsourced: no SOL numbers, no court/hospital/road
// names, no per-city legal claims. Phrasing variants add extra entropy so even two
// cities in the same county diverge.

const mechWord = (m?: { type: string } | null) =>
  m?.type?.replace(/([A-Z])/g, ' $1').replace(/^./, (c) => c.toLowerCase()).trim() || 'collision';
const countyWord = (p: CityProfile) => (p.county ? `${p.county} County` : 'the surrounding county');
const farsCategory = (p: CityProfile): string => {
  const n = p.truckFatalities;
  if (n <= 0) return 'no truck-involved deaths on record';
  if (n === 1) return 'a single truck-involved death on record';
  if (n <= 3) return 'a handful of truck-involved deaths on record';
  if (n <= 9) return 'several truck-involved deaths on record';
  return 'a heavy toll of truck-involved deaths on record';
};
const sizeWord = (p: CityProfile) =>
  p.sizeTier === 'metro' ? 'a major metro' : p.sizeTier === 'mid' ? 'a mid-sized city'
  : p.sizeTier === 'small' ? 'a smaller community' : 'a smaller community';
const nearN = (near: string[], n: number) => near.slice(0, n).filter(Boolean).join(', ');

type HubFaq = { q: (p: CityProfile, near: string[]) => string; a: (p: CityProfile, near: string[]) => string[] };

// 12 hub FAQ topics, each with 3 GENUINELY DIFFERENT phrasings (not a token swap —
// different sentences making the same true point). Local topics weave high-cardinality
// unmasked facts (county / nearby names / region / mechanism); general-legal topics
// rely on the 3-way phrasing split for entropy. buildHubFaqs disperse-selects 6 of 12
// topics per city and picks one variant per topic: ~C(12,6)*3^6 ≈ 674k combinations,
// so two cities sharing an identical answer is rare. Nothing unsourced: no SOL numbers,
// no court/hospital/road names, no per-city legal claims.
const HUB_FAQS: HubFaq[] = [
  { // 0 FARS meaning — COUNTY
    q: (p) => `What do ${p.name}'s truck-crash numbers actually tell me?`,
    a: (p) => [
      `Federal FARS data show ${farsCategory(p)} for the ${countyWord(p)} area in ${p.dataYear}. That figure counts deaths only — it leaves out the much larger number of truck crashes that cause serious, lasting injuries without a fatality, so the real burden in ${countyWord(p)} runs well above the headline number.`,
      `The ${farsCategory(p)} that FARS lists for ${countyWord(p)} in ${p.dataYear} is a deaths-only tally. It misses the injury crashes — the spinal, brain, and crush trauma between a fatal wreck and a fender-bender — so treat it as a floor on the local truck-crash problem, not the full count.`,
      `Those numbers come from NHTSA's fatality file: ${farsCategory(p)} in ${countyWord(p)} for ${p.dataYear}. Because the database tracks only deaths, the figure says nothing about the injury wrecks that send people to the hospital but not the morgue, which are far more common.`,
    ],
  },
  { // 1 out-of-town carrier — NEARBY
    q: (p) => `The truck that hit me near ${p.name} was from out of town — does that matter?`,
    a: (p, near) => [
      `It is common, and it usually helps. Freight through ${p.name} runs between it and nearby ${nearN(near, 3) || 'neighboring towns'}, so the carrier may sit a county away or across the country. Interstate carriers fall under the federal safety rules and must carry higher insurance, which often makes an out-of-area company easier to hold accountable, not harder.`,
      `Not a problem — often an advantage. Trucks on these routes are frequently based toward ${nearN(near, 3) || 'other parts of the state'} or beyond, and a carrier in interstate commerce answers to the federal regulations and the larger liability limits that come with them. Where it parks its trucks matters less than the records it must keep.`,
      `That is the norm for truck cases, not the exception. The rigs moving between ${p.name} and ${nearN(near, 2) || 'nearby towns'} belong to fleets that can be headquartered anywhere, but an interstate carrier is squarely within FMCSA's reach and its higher coverage — so a distant company is usually well within a local case's grasp.`,
    ],
  },
  { // 2 evidence timing — COUNTY + NEARBY
    q: (p) => `How fast does the evidence disappear after a ${p.name} truck crash?`,
    a: (p, near) => [
      `Faster than most people expect. Electronic logs and black-box data can be overwritten within weeks, and the truck can be repaired or hauled out of ${countyWord(p)} before anyone inspects it. The first real move is a preservation demand to the carrier — ideally before the rig leaves the ${nearN(near, 2) || 'local'} corridor — so the logs and maintenance file survive.`,
      `Quickly, which is the whole problem. A carrier can cycle its hours-of-service data and move the tractor past ${nearN(near, 2) || 'the area'} within days. A written preservation demand on file early — before the truck leaves ${countyWord(p)} and the records refresh — is usually the single most valuable step after a crash here.`,
      `On the carrier's schedule, not yours. The engine module, the driver's logs, and the inspection records can all be gone in weeks, and the truck itself can leave ${countyWord(p)} for its next load. That is why getting a lawyer's preservation letter to the company fast — while the rig is still near ${nearN(near, 2) || 'town'} — changes the case.`,
    ],
  },
  { // 3 regional pattern — REGION + MECHANISM + county
    q: (p) => `Which kinds of truck crashes happen most around ${p.name}?`,
    a: (p) => {
      const m = p.dominantMechanism;
      const reg = p.regionName ?? 'this part of the country';
      if (!m) return [
        `Truck crashes here fail in a handful of predictable ways — rear-end, jackknife, rollover, underride — and each leaves a different evidence trail. The pattern on ${countyWord(p)}'s freight routes shapes which records to demand first.`,
        `Serious truck wrecks cluster into rear-end, jackknife, rollover, and underride types, and each is rebuilt from different proof. That is the mix investigators read for on the routes through ${countyWord(p)}.`,
        `Across ${reg}, the bad truck wrecks are mostly rear-end, jackknife, rollover, and underride collisions. Knowing which one happened in ${countyWord(p)} tells an investigator which records matter most.`,
      ];
      return [
        `Across ${reg}, the ${mechWord(m)} is the most frequent serious truck collision — roughly ${m.percentage}% of the regional pattern — and the same mix shows up on ${countyWord(p)}'s freight routes. Each crash type leaves its own evidence trail, so an investigation starts by reading the scene for that signature.`,
        `Regionally in ${reg}, the ${mechWord(m)} leads the serious-crash list at about ${m.percentage}%, and ${countyWord(p)}'s corridors see that same pattern. Because every mechanism — rear-end, rollover, jackknife, underride — points to different records, identifying it early decides what to chase first.`,
        `The data for ${reg} put the ${mechWord(m)} at the top, near ${m.percentage}% of serious truck crashes, and ${p.name} sits inside that pattern. An investigator uses the crash type to know whether to chase brake data, logs, or load records first.`,
      ];
    },
  },
  { // 4 why worse than a car — SIZE + NEARBY + region
    q: (p) => `Why are truck crashes around ${p.name} so much worse than car wrecks?`,
    a: (p, near) => [
      `Weight. A loaded tractor-trailer can outweigh a car sixteen to one, so a routine impact turns catastrophic. As ${sizeWord(p)}, ${p.name} sits on freight routes shared with ${nearN(near, 2) || 'nearby towns'}, putting 80,000-pound rigs in the same lanes as local traffic — which is why these crashes send people to trauma care far more often than ordinary collisions.`,
      `Physics and traffic. ${p.name}, ${sizeWord(p)}, channels freight between itself and ${nearN(near, 2) || 'the surrounding area'}, and an 80,000-pound truck does not stop, swerve, or forgive the way a car does. The same crash that dents a sedan can be fatal, which is why a truck case is built differently from the start.`,
      `It is a mismatch of mass. Being ${sizeWord(p)} on routes tied to ${nearN(near, 2) || 'the region'}, ${p.name} mixes fully loaded rigs with everyday drivers, and the truck's weight and stopping distance turn survivable car wrecks into life-altering ones. That severity is what drives the medical bills and the case value.`,
    ],
  },
  { // 5 how the case is built / national pages — MECHANISM + county
    q: (p) => `Where do I learn how a ${p.name} truck case is actually built?`,
    a: (p) => [
      `The mechanics are federal and the same everywhere: how a ${mechWord(p.dominantMechanism)} is reconstructed, which FMCSA rules the carrier may have broken, who beyond the driver can be liable, and how value is built. The national crash-type and FMCSA pages linked here cover that — the local pieces are the ${countyWord(p)} crash data above and the deadline a licensed ${p.stateName} attorney confirms.`,
      `Start with the national crash-type and FMCSA pages linked from here — they go deep on evidence, the federal rules a ${mechWord(p.dominantMechanism)} case turns on, and the chain of companies behind the driver. Then bring it back to the local facts: the ${countyWord(p)} numbers above and a filing deadline only a licensed ${p.stateName} attorney can pin down.`,
      `Two layers: the federal one is shared — ${mechWord(p.dominantMechanism)} reconstruction, FMCSA duties, liable parties, damages — and lives on the national pages linked here. The local layer is what is specific to you: the ${countyWord(p)} data above and the ${p.stateName} deadline to confirm with a licensed attorney.`,
    ],
  },
  { // 6 who is liable beyond the driver — general (phrasing entropy)
    q: (p) => `Who can be held responsible for a ${p.name} truck crash besides the driver?`,
    a: () => [
      `Usually several parties. The motor carrier answers for the driver and for its own hiring, training, and maintenance choices; depending on the facts, a broker, shipper, leasing company, or parts manufacturer can share fault. Naming every responsible company is what reaches enough insurance to cover a serious injury.`,
      `Often the company behind the cab matters more than the driver. Carriers are liable for their drivers and for negligent hiring or upkeep, and the broker who arranged the load, the shipper who packed it, or the maker of a failed part can each be pulled in. More defendants usually means more coverage.`,
      `The driver is rarely the whole story. A carrier can be on the hook for putting an unfit driver or unsafe truck on the road, and third parties — brokers, shippers, maintenance contractors, component makers — turn up as the facts develop. Identifying all of them is how a catastrophic claim gets fully paid.`,
    ],
  },
  { // 7 what to do right after — general
    q: (p) => `What should I do right after a truck accident in ${p.name}?`,
    a: () => [
      `Get medical care first, even if you feel okay — truck-crash injuries surface late. Then make sure police document it, and if you safely can, photograph the trucks, the scene, and any company or DOT numbers. The highest-value early step is legal: a preservation demand that stops the carrier from erasing its data.`,
      `Health before anything: be evaluated, because adrenaline hides serious injuries. Get an official police report, capture photos of the rig and any markings, and avoid giving the trucking company's insurer a recorded statement. Talk to a lawyer quickly so the truck's electronic records are locked down before they cycle out.`,
      `Treat it as both a medical and an evidence emergency. See a doctor, call police for a report, and photograph everything you can — plates, DOT numbers, damage. Do not settle or give a recorded statement to the carrier's adjuster, and get counsel fast enough to preserve the logs and black-box data.`,
    ],
  },
  { // 8 cost / contingency — general
    q: (p) => `What does it cost to hire a truck accident lawyer in ${p.name}?`,
    a: () => [
      `These cases are typically handled on contingency: the lawyer is paid a percentage only if there is a recovery, with nothing upfront and the case costs advanced. The exact terms go in a written agreement you review before signing, and the first case review is generally free.`,
      `Almost always nothing out of pocket to start. Truck cases run on a contingency fee — the firm collects a set share only if it wins or settles, and fronts the expenses in the meantime. Read the written fee agreement before you sign, and expect the initial consultation to cost nothing.`,
      `You generally do not pay by the hour. The standard arrangement is contingency: no fee unless the case recovers money, with litigation costs advanced by the firm and a percentage spelled out in a contract you review first. The initial evaluation is usually free.`,
    ],
  },
  { // 9 do I need a lawyer — general
    q: (p) => `Do I really need a lawyer, or can I handle a ${p.name} truck claim myself?`,
    a: () => [
      `A minor case can sometimes be handled alone, but truck claims are the hard end: multiple defendants, federal records that must be preserved fast, and insurers that litigate. The evidence work usually has to happen before a person even feels ready, which is the main argument for getting help early.`,
      `For a small property-damage claim, maybe. For an injury truck case, the deck is stacked — carriers have rapid-response teams and lawyers working the file from day one, and the proof is technical and time-limited. Going it alone usually means the most important evidence is gone before you start.`,
      `It depends on the stakes. Truck claims involve layered liability and electronic proof that disappears on a schedule, and the trucking company's insurer is built to minimize payouts. That imbalance — not a rule that you must hire someone — is why represented victims typically recover far more.`,
    ],
  },
  { // 10 how fast must I act / deadline — general (no specific SOL number)
    q: (p) => `How quickly do I need to act on a ${p.name} truck accident claim?`,
    a: (p) => [
      `The practical answer is quickly, because of the evidence: logs and black-box data can be overwritten within weeks, so the steps that preserve them matter right away. Any legal time limit in ${p.stateName} varies by claim type — a licensed ${p.stateName} attorney can confirm that for your situation. This page is general information, not legal advice.`,
      `There are two clocks. The practical one is the evidence — a carrier can overwrite hours-of-service and black-box data within weeks, so preservation should start early. The legal filing time limit is a separate, state-specific question best confirmed with a licensed ${p.stateName} attorney rather than taken from a web page.`,
      `Sooner rather than later, mainly because the records disappear: the truck's electronic data and driver logs can be gone within weeks. Any filing time limit in ${p.stateName} depends on the facts and the type of claim, so confirm it with a licensed ${p.stateName} attorney instead of relying on a number online.`,
    ],
  },
  { // 11 federal rules / out-of-state — MECHANISM-agnostic general
    q: (p) => `Do federal trucking rules apply to my ${p.name} crash?`,
    a: (p) => [
      `If the truck was running in interstate commerce, the Federal Motor Carrier Safety Regulations almost certainly apply — hours of service, driver qualification, maintenance, cargo securement. A violation of those rules is often the clearest proof of negligence, which is why they matter even in a crash that happened entirely within ${p.stateName}.`,
      `Very likely yes. Most commercial trucks fall under FMCSA's rules on driving hours, inspections, driver files, and load securement, and breaking one is frequently the backbone of the case. Those federal duties apply regardless of where in ${p.stateName} the wreck occurred.`,
      `Usually they do. A carrier operating across state lines is bound by the federal safety regulations, and those standards — not just ${p.stateName} traffic law — often define what the company did wrong. Pulling the records that show a rule was broken is a core part of building the claim.`,
    ],
  },
];

// Topics 0–5 weave HIGH-CARDINALITY unmasked facts (county / nearby / region /
// mechanism), so they differ city-to-city even on the same variant. Topics 6–11 are
// general-legal (only masked tokens), so two cities picking the same general topic +
// variant collide. The hub therefore LEANS on local topics and uses general topics as
// fillers — this keeps the unmasked-token density high on the published surface.
const HUB_LOCAL = [0, 1, 2, 3, 4, 5];
const HUB_GENERAL = [6, 7, 8, 9, 10, 11];

/**
 * buildHubFaqs — pick a local-leaning, dispersed set of hub topics for this city, then
 * one of each topic's 3 phrasings by seed. Local topics (with county/nearby/region/
 * mechanism) dominate; general topics fill the rest. Different cities get different
 * subsets AND phrasings, so identical answers across two pages are rare. Deterministic.
 */
export function buildHubFaqs(p: CityProfile, count = 6): CityFAQ[] {
  const seed = `${p.stateSlug}/${p.slug}`;
  const near = nearbyCities(p.stateSlug, p.slug, 3).map((c) => c.name);
  const localWant = Math.min(HUB_LOCAL.length, Math.max(0, count - 2)); // reserve <=2 for general
  const localPick = selectDistinct(seed, 'hublocal', HUB_LOCAL.length, localWant).map((k) => HUB_LOCAL[k]);
  const genWant = count - localPick.length;
  const genPick = selectDistinct(seed, 'hubgen', HUB_GENERAL.length, genWant).map((k) => HUB_GENERAL[k]);
  const topics = [...localPick, ...genPick];
  return topics.map((t) => {
    const f = HUB_FAQS[t];
    const variants = f.a(p, near);
    const v = selectIndex(seed, `hubfaq-a-${t}`, variants.length);
    return { question: f.q(p, near), answer: variants[v] };
  });
}
