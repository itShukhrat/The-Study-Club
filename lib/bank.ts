/**
 * Practice question bank. Source-of-truth for the practice/drill engine.
 * Imported from the official SAT Suite "Words in Context" topical set
 * (deduped by College Board questionId). Append new items to the arrays;
 * the catalog and PracticeRoom read whatever the selector returns, so adding
 * questions or whole skills never needs code changes elsewhere.
 *
 * Sub-archetypes (see docs/PRACTICE_BANK_AUDIT.md):
 *   completion -> "Which choice completes the text..."  (stem has a ____ blank)
 *   meaning    -> "As used in the text, what does X most nearly mean?" (has passage)
 */

export type BankChoice = { id: "A" | "B" | "C" | "D"; text: string };
export type BankDifficulty = "easy" | "medium" | "hard";

export type BankQuestion = {
  id: string;
  section: "rw" | "math";
  skill: string; // matches lib/sat-topics topic id, e.g. "words-in-context"
  type: "completion" | "meaning";
  difficulty: BankDifficulty;
  passageHtml?: string; // literary excerpt (meaning items)
  stem: string;         // completion: sentence with a ____ blank | meaning: the prompt
  choices: BankChoice[];
  correct: "A" | "B" | "C" | "D";
  explanation: string;  // concise why-correct (Durden elaborates on request)
};

const WIC: BankQuestion[] = [
  { id:"84b5125b", section:"rw", skill:"words-in-context", type:"completion", difficulty:"easy",
    stem:`Artist Marilyn Dingle's intricate, coiled baskets are ____ sweetgrass and palmetto palm. Following a Gullah technique that originated in West Africa, Dingle skillfully winds a thin palm frond around a bunch of sweetgrass to create the basket's signature look that no factory can reproduce.`,
    choices:[{id:"A",text:"indicated by"},{id:"B",text:"handmade from"},{id:"C",text:"represented by"},{id:"D",text:"collected with"}], correct:"B",
    explanation:`"Handmade from" fits: Dingle makes the baskets herself, by hand, from those plants — the text stresses a hand technique "no factory can reproduce." Indicated/represented/collected don't match how she uses the plants.` },

  { id:"d4a8f7cb", section:"rw", skill:"words-in-context", type:"completion", difficulty:"easy",
    stem:`Dance choreographer Jawole Willa Jo Zollar aims to give people the opportunity to be ____ her creative process. For example, live performances of her dance HairStories featured videos of people talking about their hair and audience members sharing pictures of their hairstyles.`,
    choices:[{id:"A",text:"nervous about"},{id:"B",text:"completed by"},{id:"C",text:"delayed by"},{id:"D",text:"involved in"}], correct:"D",
    explanation:`"Involved in" = playing an active role in. The examples show Zollar pulling the audience into the work, not making them nervous, complete, or delayed.` },

  { id:"9cdcd902", section:"rw", skill:"words-in-context", type:"completion", difficulty:"easy",
    stem:`Charles "Teenie" Harris took over 70,000 photographs documenting everyday life in Pittsburgh's Black communities. The Carnegie Museum of Art maintains thousands of his photographs, carefully ____ them so that audiences can continue to view them well into the future.`,
    choices:[{id:"A",text:"replacing"},{id:"B",text:"inventing"},{id:"C",text:"preserving"},{id:"D",text:"counting"}], correct:"C",
    explanation:`"Preserving" = keeping in good condition so they last. Replacing/inventing/counting wouldn't let audiences keep viewing the originals.` },

  { id:"ca47273b", section:"rw", skill:"words-in-context", type:"completion", difficulty:"easy",
    stem:`Biologist Jane Edgeloe and colleagues located what may be the largest individual plant in the world. The plant is a type of seagrass called Posidonia australis, and it ____ approximately 200 square kilometers.`,
    choices:[{id:"A",text:"acknowledges"},{id:"B",text:"produces"},{id:"C",text:"spans"},{id:"D",text:"advances"}], correct:"C",
    explanation:`"Spans" = extends over a distance. A plant can't acknowledge, produce, or advance a distance — but it can span one.` },

  { id:"637d0878", section:"rw", skill:"words-in-context", type:"completion", difficulty:"easy",
    stem:`Much of the 2,000-mile Appalachian Trail passes through wilderness areas. In order to ____ those areas, the United States Congress passed the National Trails System Act in 1968, ensuring the trail would not be sold or commercially developed.`,
    choices:[{id:"A",text:"borrow"},{id:"B",text:"postpone"},{id:"C",text:"protect"},{id:"D",text:"decorate"}], correct:"C",
    explanation:`"Protect" = keep safe. Stopping sale/development protects the wilderness; borrow/postpone/decorate don't fit.` },

  { id:"a2835734", section:"rw", skill:"words-in-context", type:"completion", difficulty:"easy",
    stem:`Visual artist Gabriela Alemán says the bold colors of comics, pop art, and Latinx culture have always fascinated her. This passion for the rich colors of her community translates into the ____ artworks she produces.`,
    choices:[{id:"A",text:"vivid"},{id:"B",text:"unknown"},{id:"C",text:"definite"},{id:"D",text:"reserved"}], correct:"A",
    explanation:`"Vivid" = bright, colorful — matches a passion for bold color. Unknown/definite/reserved don't.` },

  { id:"0d402146", section:"rw", skill:"words-in-context", type:"completion", difficulty:"easy",
    stem:`US traffic signals didn't always contain the familiar three lights. Traffic lights only ____ red and green lights until the three-light signal was developed in the 1920s.`,
    choices:[{id:"A",text:"avoided"},{id:"B",text:"featured"},{id:"C",text:"appreciated"},{id:"D",text:"disregarded"}], correct:"B",
    explanation:`"Featured" = had as a part. Before the 1920s signals had only red and green; lifeless signals can't avoid, appreciate, or disregard.` },

  { id:"a4f50d30", section:"rw", skill:"words-in-context", type:"completion", difficulty:"easy",
    stem:`Scientists once thought all electric eels were a single species, but a team led by zoologist C. David de Santana proved this wrong by ____ that there are in fact three distinct species of electric eels.`,
    choices:[{id:"A",text:"pretending"},{id:"B",text:"complaining"},{id:"C",text:"requiring"},{id:"D",text:"demonstrating"}], correct:"D",
    explanation:`"Demonstrating" = showing. You disprove a belief by showing evidence, not by pretending, complaining, or requiring.` },
];
const WIC2: BankQuestion[] = [
  { id:"0f040c50", section:"rw", skill:"words-in-context", type:"meaning", difficulty:"easy",
    passageHtml:`<p>The following text is from Yann Martel's 2001 novel <em>Life of Pi</em>. The narrator's family owned a zoo when he was a child.</p><p>It was a huge zoo, <u>spread</u> over numberless acres, big enough to require a train to explore it, though it seemed to get smaller as I grew older, train included.</p>`,
    stem:`As used in the text, what does the word "spread" most nearly mean?`,
    choices:[{id:"A",text:"Hidden"},{id:"B",text:"Discussed"},{id:"C",text:"Extended"},{id:"D",text:"Coated"}], correct:"C",
    explanation:`The zoo is "huge," covers "numberless acres," and needs a train — so "spread" = extended/stretched over a large area.` },

  { id:"45a109a3", section:"rw", skill:"words-in-context", type:"meaning", difficulty:"easy",
    passageHtml:`<p>The following text is from Bram Stoker's 1897 novel <em>Dracula</em>. The narrator is being driven through a remote region at night.</p><p>The baying of the wolves sounded nearer and nearer... I grew dreadfully afraid, and the horses shared my fear. The driver, however, was not in the least <u>disturbed</u>; he kept turning his head to left and right.</p>`,
    stem:`As used in the text, what does the word "disturbed" most nearly mean?`,
    choices:[{id:"A",text:"Disorganized"},{id:"B",text:"Alarmed"},{id:"C",text:"Offended"},{id:"D",text:"Interrupted"}], correct:"B",
    explanation:`The narrator and horses are "dreadfully afraid"; the driver is "not in the least disturbed" — i.e., not alarmed by the wolves.` },

  { id:"aa7ae735", section:"rw", skill:"words-in-context", type:"meaning", difficulty:"easy",
    passageHtml:`<p>The following text is adapted from Mohsin Hamid's 2017 novel <em>Exit West</em>.</p><p>...the family would take turns to look up at objects whose light, often, had been emitted before any of these three viewers had been born — light from other centuries, only now <u>reaching</u> Earth.</p>`,
    stem:`As used in the text, what does the word "reaching" most nearly mean?`,
    choices:[{id:"A",text:"Arriving at"},{id:"B",text:"Consulting with"},{id:"C",text:"Running to"},{id:"D",text:"Clinging to"}], correct:"A",
    explanation:`The light had been traveling across space and is "only now" arriving at Earth. Light can't consult, run, or cling.` },

  { id:"82b7c3b2", section:"rw", skill:"words-in-context", type:"meaning", difficulty:"easy",
    passageHtml:`<p>The following text is from Booth Tarkington's 1921 novel <em>Alice Adams</em>.</p><p>...every year her husband's Christmas present to her was a vase of one sort or another — whatever the clerk showed him, <u>marked</u> at about twelve or fourteen dollars.</p>`,
    stem:`As used in the text, what does the word "marked" most nearly mean?`,
    choices:[{id:"A",text:"Staged"},{id:"B",text:"Priced"},{id:"C",text:"Stained"},{id:"D",text:"Watched"}], correct:"B",
    explanation:`A vase "marked at about twelve or fourteen dollars" was priced at that amount.` },

  { id:"9671d61d", section:"rw", skill:"words-in-context", type:"meaning", difficulty:"easy",
    passageHtml:`<p>The following text is from Claude McKay's 1922 poem "Morning Joy." The speaker is looking out a window at night.</p><p>...Dark was the night save for the snow's weird light. I <u>drew</u> the shades far down, crept into bed...</p>`,
    stem:`As used in the text, what does the word "drew" most nearly mean?`,
    choices:[{id:"A",text:"Pulled"},{id:"B",text:"Drained"},{id:"C",text:"Inspired"},{id:"D",text:"Sketched"}], correct:"A",
    explanation:`The speaker "drew the shades far down" before bed — pulled/lowered them.` },

  { id:"359902ae", section:"rw", skill:"words-in-context", type:"meaning", difficulty:"medium",
    passageHtml:`<p>The following text is adapted from Nathaniel Hawthorne's 1837 story "Dr. Heidegger's Experiment." A physician is rehydrating a dried flower.</p><p>...Soon, however, <u>a singular</u> change began to be visible. The crushed and dried petals stirred and assumed a deepening tinge of crimson, as if the flower were reviving from a deathlike slumber.</p>`,
    stem:`As used in the text, what does the phrase "a singular" most nearly mean?`,
    choices:[{id:"A",text:"A lonely"},{id:"B",text:"A disagreeable"},{id:"C",text:"An acceptable"},{id:"D",text:"An extraordinary"}], correct:"D",
    explanation:`The dried flower revives "from a deathlike slumber" — an exceptional, extraordinary change, not lonely/disagreeable/merely acceptable.` },

  { id:"9aa44886", section:"rw", skill:"words-in-context", type:"meaning", difficulty:"medium",
    passageHtml:`<p>The following text is from F. Scott Fitzgerald's 1925 novel <em>The Great Gatsby</em>.</p><p>[Jay Gatsby] was balancing himself on the dashboard of his car with that resourcefulness of movement that is so peculiarly American... This <u>quality</u> was continually breaking through his punctilious manner in the shape of restlessness.</p>`,
    stem:`As used in the text, what does the word "quality" most nearly mean?`,
    choices:[{id:"A",text:"Standard"},{id:"B",text:"Prestige"},{id:"C",text:"Characteristic"},{id:"D",text:"Accomplishment"}], correct:"C",
    explanation:`"This quality" points back to Gatsby's "resourcefulness of movement" — a characteristic/trait, not a standard, prestige, or accomplishment.` },

  { id:"e459076b", section:"rw", skill:"words-in-context", type:"meaning", difficulty:"hard",
    passageHtml:`<p>The following text is adapted from George Eliot's 1871-72 novel <em>Middlemarch</em>.</p><p>[Mr. Brooke] had travelled in his younger years, and was held in this part of the country to have <u>contracted</u> a too rambling habit of mind. Mr. Brooke's conclusions were as difficult to predict as the weather.</p>`,
    stem:`As used in the text, what does the word "contracted" most nearly mean?`,
    choices:[{id:"A",text:"Restricted"},{id:"B",text:"Described"},{id:"C",text:"Developed"},{id:"D",text:"Settled"}], correct:"C",
    explanation:`The "rambling habit of mind" is likened to a disease he "contracted" — i.e., acquired/developed. He still draws rambling conclusions, so it wasn't restricted or settled.` },

  { id:"3566120b", section:"rw", skill:"words-in-context", type:"meaning", difficulty:"hard",
    passageHtml:`<p>The following text is adapted from Oscar Wilde's 1895 play <em>The Importance of Being Earnest</em>.</p><p>CECILY: The absence of old friends one can <u>endure</u> with equanimity. But even a momentary separation from anyone to whom one has just been introduced is almost unbearable.</p>`,
    stem:`As used in the text, what does the word "endure" most nearly mean?`,
    choices:[{id:"A",text:"Regret"},{id:"B",text:"Persist"},{id:"C",text:"Tolerate"},{id:"D",text:"Encourage"}], correct:"C",
    explanation:`Ironic contrast: one can calmly "endure" (tolerate) old friends' absence, but a new acquaintance's absence is "unbearable." You tolerate an absence; you can't persist it.` },
];
const WIC3: BankQuestion[] = [
  { id:"5a278f24", section:"rw", skill:"words-in-context", type:"completion", difficulty:"medium",
    stem:`The work of molecular biophysicist Enrique M. De La Cruz is known for ____ traditional boundaries between academic disciplines. The lab he runs includes engineers, biologists, chemists, and physicists, and its research uses insights and techniques from all those fields.`,
    choices:[{id:"A",text:"epitomizing"},{id:"B",text:"transcending"},{id:"C",text:"anticipating"},{id:"D",text:"reinforcing"}], correct:"B",
    explanation:`"Transcending" = going beyond. Drawing on all fields means crossing the boundaries; epitomizing/reinforcing would keep them separate, and anticipating doesn't fit.` },

  { id:"e8c26398", section:"rw", skill:"words-in-context", type:"completion", difficulty:"medium",
    stem:`To develop a method for measuring snow depth with lasers, NASA physicist Yongxiang Hu relied on ____; identifying broad similarities between two seemingly different phenomena, Hu used how ants move in colonies to calculate how light particles travel through snow.`,
    choices:[{id:"A",text:"a collaboration"},{id:"B",text:"an accessory"},{id:"C",text:"a contradiction"},{id:"D",text:"an analogy"}], correct:"D",
    explanation:`He found "broad similarities between two seemingly different phenomena" — that's an analogy. Not collaboration, accessory, or contradiction.` },

  { id:"8b46bb51", section:"rw", skill:"words-in-context", type:"completion", difficulty:"medium",
    stem:`Lady Elizabeth Rigby Eastlake did not hesitate to publish reviews that went against popular opinion. In one divisive essay, Eastlake ____ that the value of photographs was informational rather than creative.`,
    choices:[{id:"A",text:"exposed"},{id:"B",text:"asserted"},{id:"C",text:"discovered"},{id:"D",text:"doubted"}], correct:"B",
    explanation:`"Asserted" = stated confidently. She didn't hesitate to share opinions; she was stating one, not uncovering a truth (exposed/discovered) or disbelieving it (doubted).` },

  { id:"d3ca5d59", section:"rw", skill:"words-in-context", type:"completion", difficulty:"medium",
    stem:`Stephen Hannock's luminous landscapes appeal to viewers but have drawn little commentary from critics — perhaps because the paintings seem so ____. Many critics focus on art that is cryptic or overtly challenging.`,
    choices:[{id:"A",text:"innovative"},{id:"B",text:"subversive"},{id:"C",text:"profound"},{id:"D",text:"accessible"}], correct:"D",
    explanation:`Contrast with "cryptic or challenging": the paintings are "accessible" (easy to understand). Innovative/subversive/profound would attract critics, not deter them.` },

  { id:"fce80a36", section:"rw", skill:"words-in-context", type:"completion", difficulty:"medium",
    stem:`A complete set of ancient pessoi was found beneath a paving stone in Israel. Some experts suggest the set was buried intentionally; however, without clear evidence, archaeologists are left to ____ what happened.`,
    choices:[{id:"A",text:"speculate about"},{id:"B",text:"dismiss"},{id:"C",text:"expand on"},{id:"D",text:"catalog"}], correct:"A",
    explanation:`"Speculate" = guess without firm evidence — which is exactly the situation ("without clear evidence"). They wouldn't dismiss, and there's nothing to expand on or catalog.` },

  { id:"d8d1ecaa", section:"rw", skill:"words-in-context", type:"completion", difficulty:"medium",
    stem:`Researchers found that remote video meetings may be less conducive to brainstorming. They suspect participants stare at the speaker and don't let their eyes or mind wander as much, which may ultimately ____ creativity.`,
    choices:[{id:"A",text:"recommend"},{id:"B",text:"criticize"},{id:"C",text:"impede"},{id:"D",text:"construct"}], correct:"C",
    explanation:`Video meetings are "less conducive to" brainstorming, so the focus is bad for creativity. "Impede" = hinder. Recommend/construct are too positive; criticize doesn't fit an action on creativity.` },

  { id:"22a41819", section:"rw", skill:"words-in-context", type:"completion", difficulty:"hard",
    stem:`Rejecting the idea that the magazine Ebony and Topaz should present a unified vision of Black American identity, editor Charles S. Johnson fostered diverse perspectives. His self-effacement diverged from the editorial stances of W.E.B. Du Bois and Alain Locke, whose decisions for their publications were more ____.`,
    choices:[{id:"A",text:"proficient"},{id:"B",text:"dogmatic"},{id:"C",text:"ambiguous"},{id:"D",text:"unpretentious"}], correct:"B",
    explanation:`"Dogmatic" = firmly insisting on one's views. Du Bois and Locke prioritized a "unified vision" over diverse perspectives. Proficient/unpretentious aren't implied; ambiguous is the opposite of a unified vision.` },

  { id:"5e57efec", section:"rw", skill:"words-in-context", type:"completion", difficulty:"hard",
    stem:`Charities can offset nuisance costs by compensating donors, but those costs, though variable, are largely ____ donation size, so charities that compensate donors will likely favor a few large donors over many small donors.`,
    choices:[{id:"A",text:"supplemental to"},{id:"B",text:"predictive of"},{id:"C",text:"independent of"},{id:"D",text:"subsumed in"}], correct:"C",
    explanation:`Favoring a few large donors makes sense only if nuisance cost isn't tied to gift size — i.e., "independent of" it. The other options imply a link that wouldn't drive that preference.` },

  { id:"54804e10", section:"rw", skill:"words-in-context", type:"completion", difficulty:"hard",
    stem:`Direct evidence of influence between Mesoamerican cities is hard to find. However, excavations at Tikal unearthed a citadel that shows ____ Teotihuacan architecture — including a near replica of a famed Teotihuacan temple — giving tangible evidence of outside influence.`,
    choices:[{id:"A",text:"refinements of"},{id:"B",text:"precursors of"},{id:"C",text:"commonalities with"},{id:"D",text:"animosities toward"}], correct:"C",
    explanation:`A near-replica shows similarities — "commonalities with." "Precursors of" reverses the timeline; nothing shows refinements or animosities.` },

  { id:"c14daa3c", section:"rw", skill:"words-in-context", type:"completion", difficulty:"hard",
    stem:`Close analysis of Girl with a Flute, long attributed to Vermeer, reveals deviations from his signature techniques, suggesting the work may be a student's — potentially ____ our understanding of Vermeer as a solitary artist.`,
    choices:[{id:"A",text:"negating"},{id:"B",text:"prefiguring"},{id:"C",text:"entrenching"},{id:"D",text:"substantiating"}], correct:"A",
    explanation:`Proving Vermeer had a student would reverse ("negate") the view of him as solitary. Prefiguring/entrenching/substantiating would support that view, not overturn it.` },

  { id:"3d658a5a", section:"rw", skill:"words-in-context", type:"completion", difficulty:"hard",
    stem:`Some models predict bees travel less as floral density rises, but Jha and Kremen showed bees' behavior breaks this prediction if flowers in dense patches are ____: bees will forage beyond patches of low species richness to get multiple resource types.`,
    choices:[{id:"A",text:"depleted"},{id:"B",text:"homogeneous"},{id:"C",text:"immature"},{id:"D",text:"dispersed"}], correct:"B",
    explanation:`"Low species richness" = flowers mostly the same kind = "homogeneous," which sends bees farther for variety. Depleted/immature/dispersed aren't what the text specifies.` },

  { id:"e8fb0744", section:"rw", skill:"words-in-context", type:"completion", difficulty:"hard",
    stem:`Jennifer C. Chen contributed to a study challenging the accepted view that among prehistoric peoples, female participation in hunting was ____. The team found that, in fact, as many as half of the hunters in those populations were female.`,
    choices:[{id:"A",text:"inevitable"},{id:"B",text:"satisfactory"},{id:"C",text:"negligible"},{id:"D",text:"commonplace"}], correct:"C",
    explanation:`"In fact, as many as half" contrasts with the accepted view — so that view must be that female participation was "negligible" (insignificant). Inevitable/satisfactory/commonplace don't set up the contrast.` },
];

/** Everything in the bank, deduped by id (later arrays win on collision). */
const ALL: BankQuestion[] = [...WIC, ...WIC2, ...WIC3].filter(
  (q, i, arr) => arr.findIndex((x) => x.id === q.id) === i,
);

export type DiffFilter = "easy" | "difficult" | "all";

function matchesDiff(q: BankQuestion, f: DiffFilter): boolean {
  if (f === "all") return true;
  if (f === "easy") return q.difficulty === "easy";
  return q.difficulty === "medium" || q.difficulty === "hard"; // "difficult" = medium U hard
}

function shuffle<T>(arr: T[], seed = Date.now()): T[] {
  const a = [...arr];
  let s = seed % 2147483647;
  const rnd = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** How many questions exist for a skill (optionally by difficulty filter). */
export function bankCount(skill: string, diff: DiffFilter = "all"): number {
  return ALL.filter((q) => q.skill === skill && matchesDiff(q, diff)).length;
}

/** Distinct skill ids that currently have at least one question. */
export function liveSkills(): string[] {
  return [...new Set(ALL.map((q) => q.skill))];
}

/**
 * Select questions for a drill.
 * - skill omitted -> mixed across every live skill in the section.
 * - shuffle -> deterministic-but-mixed order; limit caps the set.
 */
export function getBankQuestions(opts: {
  skill?: string;
  section?: "rw" | "math";
  diff?: DiffFilter;
  shuffle?: boolean;
  limit?: number;
  seed?: number;
} = {}): BankQuestion[] {
  let pool = ALL.filter((q) => {
    if (opts.section && q.section !== opts.section) return false;
    if (opts.skill && q.skill !== opts.skill) return false;
    return matchesDiff(q, opts.diff ?? "all");
  });
  if (opts.shuffle) pool = shuffle(pool, opts.seed ?? Date.now());
  if (opts.limit && opts.limit > 0) pool = pool.slice(0, opts.limit);
  return pool;
}