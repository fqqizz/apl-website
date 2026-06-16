import { CONTACT_PHONE, LEAGUE, RULEBOOK_URL, SITE_URL } from "@/lib/apl-constants";

const FEE = LEAGUE.playerRegistrationFeeInr;
const FRANCHISES = LEAGUE.franchises;
const PLAYERS = LEAGUE.players;
const MATCHES = 83;
const PRIZE_POOL = "INR 5 lakh";
const AWARDS = [
  "Champions Trophy",
  "Runner-Up Trophy",
  "Golden Boot",
  "Golden Glove",
  "Player of the Tournament",
  "Young Player Award",
  "Best Defender",
  "Best Midfielder",
  "Best Forward",
  "Best Coach",
  "Goal of the Season",
  "Fans' Player of the Season",
  "Fair Play Award",
  "Most Improved Player",
  "83 Man of the Match Awards"
];

export function getKnowledgeReply(question: string): string | null {
  const q = question.toLowerCase().trim().replace(/[^\w\s?']/g, " ");

  if (/^(hi|hello|hey|yo|salam|assalam|good morning|good evening)\b/.test(q)) {
    return "Hello. Welcome to Apex Premier League. I can help with player registration, franchise ownership, application status, the season format, awards, fees, Player IDs, rules, refunds, sponsors, and APL's vision.";
  }

  if (/thank|thanks|shukriya/.test(q)) {
    return "You're welcome. If you need anything else about APL, registration, franchises, awards, or your application, just ask.";
  }

  if (/what is apl|what's apl|tell me about apl|about apex|who is apl/.test(q)) {
    return `Apex Premier League (APL) is a franchise-based football league designed to create a professional football ecosystem through ${FRANCHISES} franchises and ${PLAYERS} player registrations. The league gives footballers structure, visibility, and a serious competitive stage. Season One is the inaugural chapter, based in ${LEAGUE.location}.`;
  }

  if (/register.*player|player registration|how.*register/.test(q) && !/franchise/.test(q)) {
    return `Register at ${SITE_URL}/register/player: submit your details, upload your photo and ID, pay INR ${FEE} securely, and receive your Player ID after payment confirmation. Your application then enters APL committee review.`;
  }

  if (/registration fee|player fee|how much|cost|price|fee/.test(q) && !/franchise fee|owner fee/.test(q)) {
    return `The official player registration fee for Season One is INR ${FEE}, paid securely online during registration at ${SITE_URL}/register/player. This confirms your place in the application pool and triggers Player ID generation after payment.`;
  }

  if (/after registration|what happens next|next step|after i register|once i register/.test(q)) {
    return `After registration and payment, your Player ID is generated, your application enters APL committee review, you receive email confirmation, and you can track status at ${SITE_URL}/status. Once approved, you move toward Season One squad and fixture processes.`;
  }

  if (/what is a player id|player id|apl-\d|when.*id|get.*id/.test(q)) {
    return `Your Player ID is your official APL football identity, in the APL-#### format. It is generated automatically after successful registration and payment confirmation. Use it at ${SITE_URL}/status to check your application status anytime.`;
  }

  if (/status|check application|application status|track/.test(q)) {
    return `Visit ${SITE_URL}/status and enter your Player ID, for example APL-4821. You'll see your application status and submission date. Updates are applied by the APL committee after review and reflect immediately.`;
  }

  if (/how many franchise|number of franchise|16 franchise|franchise count/.test(q)) {
    return `Season One is built around ${FRANCHISES} official franchise teams. Each franchise represents a club in the league structure with its own identity, squad pathway, and matchday presence.`;
  }

  if (/franchise application|how.*franchise|own a franchise|franchise work|franchise owner/.test(q)) {
    return `Franchise ownership applications are submitted at ${SITE_URL}/register/franchise. Season One has ${FRANCHISES} franchise spots. The APL committee reviews each application for commitment, professionalism, and operational readiness. Approved owners proceed through onboarding, branding, and squad building.`;
  }

  if (/how many player|number of player|288|player count|roster/.test(q)) {
    return `The league is designed for ${PLAYERS} registered players across ${FRANCHISES} franchises, giving Kashmiri footballers a structured professional stage rather than scattered informal competition.`;
  }

  if (/league format|season format|how does.*work|structure|tournament or league/.test(q)) {
    return `APL is a structured franchise-based league, not a one-off tournament. Season One is planned around Group Stage, Elite League Phase, Playoffs, and Grand Final, with ${FRANCHISES} franchises, ${PLAYERS} registered players, ${MATCHES} matches, and a 12-week competition rhythm.`;
  }

  if (/match|matches|how many games|fixtures/.test(q)) {
    return `Season One is planned as an ${MATCHES}-match football season across 12 weeks, moving from group competition into the elite phase, playoffs, and the Grand Final.`;
  }

  if (/prize|pool|cash|reward/.test(q)) {
    return `The announced Season One prize pool is ${PRIZE_POOL}. APL also recognizes performance through trophies, individual awards, and Man of the Match honors across the season.`;
  }

  if (/award|trophy|golden boot|golden glove|best player|motm|man of the match/.test(q)) {
    return `APL's award list includes ${AWARDS.join(", ")}. The goal is to recognize the full football ecosystem: champions, creators, defenders, coaches, emerging players, and season-defining moments.`;
  }

  if (/who can|eligibility|can i play|outside|baramulla|from kashmir/.test(q)) {
    return "APL welcomes eligible footballers from across Kashmir and beyond. You do not need to be from Baramulla specifically. The league is open to players who meet registration and committee standards for Season One.";
  }

  if (/selection|chosen|picked|trial|scouting/.test(q)) {
    return "After registration and committee review, player progression follows APL selection processes aligned with franchise needs, squad requirements, and league standards. Approved players move forward within the Season One competitive structure.";
  }

  if (/season one|season 1|when.*start|start date|schedule|when does/.test(q)) {
    return "Season One is APL's inaugural competitive season. The official schedule and fixtures are announced after player registrations and franchise approvals are completed. Registered participants receive direct updates on next steps.";
  }

  if (/refund|money back|cancel/.test(q)) {
    return `Registration fees are non-refundable except in verified duplicate payment or technical error cases reviewed by the APL committee. Full policy: ${SITE_URL}/refund-policy.`;
  }

  if (/rulebook|rules|pdf|regulation/.test(q)) {
    return `Download the official APL Rulebook here: ${RULEBOOK_URL}. It covers format, eligibility, conduct, and league operating standards.`;
  }

  if (/sponsor|partner|business|brand|investment/.test(q)) {
    return `APL gives sponsors access to a structured football property in North Kashmir: ${FRANCHISES} franchises, ${PLAYERS} players, ${MATCHES} matches, digital storytelling, community attention, and long-term brand association with a professional sports ecosystem. Interested partners can contact contact@apexpremiereleague.in or ${CONTACT_PHONE}.`;
  }

  if (/contact|phone|call|help|support|reach/.test(q)) {
    return `Reach the APL team at ${CONTACT_PHONE}, email contact@apexpremiereleague.in, or the contact form at ${SITE_URL}/contact. I can help with quick answers on registration and league information too.`;
  }

  if (/vision|mission|why apl|purpose|goal/.test(q)) {
    return "Kashmir has never lacked football talent. APL exists to provide structure, visibility, long-term planning, and a unified competitive ecosystem, connecting players, franchises, competition, media, and opportunity under one professional platform. Season One is the first chapter of a larger vision.";
  }

  if (/payment|cashfree|pay online|secure/.test(q)) {
    return `Player registration payment of INR ${FEE} is processed through secure online checkout with Cashfree. Payment confirmation is required before your application and Player ID are finalized.`;
  }

  return null;
}

export function getDefaultKnowledgeReply(question = ""): string {
  if (question.trim()) {
    return `I can answer that best from the official APL lane. Apex Premier League is a ${FRANCHISES}-franchise, ${PLAYERS}-player football ecosystem in North Kashmir with a 12-week Season One, ${MATCHES} matches, a ${PRIZE_POOL} prize pool, player registration at INR ${FEE}, and official support at ${CONTACT_PHONE}. Ask me about registration, franchises, awards, rules, refunds, sponsors, or player IDs.`;
  }

  return `I'm Apex, the APL assistant. Ask me about player registration (INR ${FEE}), ${FRANCHISES} franchises, ${PLAYERS} players, ${MATCHES} matches, awards, Player IDs, application status, or Season One. For account-specific help, call ${CONTACT_PHONE}.`;
}
