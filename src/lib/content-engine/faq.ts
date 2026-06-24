/**
 * FAQ builder. A pool of freshly written question/answer pairs, each able to weave
 * in the city's real facts. A deterministic per-city subset is selected so different
 * cities surface a different mix. No unverified specifics (roads, hospitals, exact SOL).
 */
import type { CityProfile } from './profile';
import type { CityFAQ } from '../cities-content/types';
import { selectDistinct } from './hash';

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
    a: (p) => `The truck's engine control module (its black box), the electronic logging device showing hours of service, maintenance and inspection records, the driver qualification file, dispatch communications, and the cargo paperwork. Much of it can be overwritten on the carrier's schedule, so securing it early is the difference-maker.`,
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
