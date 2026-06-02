import { CONTACT_PHONE, LEAGUE, RULEBOOK_URL, SITE_URL } from "@/lib/apl-constants";

const FEE = LEAGUE.playerRegistrationFeeInr;
const FRANCHISES = LEAGUE.franchises;
const PLAYERS = LEAGUE.players;

/** Structured fallback — friendly, detailed, never deflects to “visit the website”. */
export function getKnowledgeReply(question: string): string | null {
  const q = question.toLowerCase().trim().replace(/[^\w\s?']/g, " ");

  if (/^(hi|hello|hey|yo|salam|assalam|good morning|good evening)\b/.test(q)) {
    return `Hello! Welcome to Apex Premier League. How can I help you today? I can assist with player registration, franchise ownership, application status, league information, fees, Player IDs, and Season One details.`;
  }

  if (/thank|thanks|shukriya/.test(q)) {
    return "You're welcome! If you need anything else about APL — registration, franchises, or your application — just ask.";
  }

  if (/what is apl|what's apl|tell me about apl|about apex|who is apl/.test(q)) {
    return `Apex Premier League (APL) is a franchise-based football league designed to create a professional football ecosystem through ${FRANCHISES} franchises and ${PLAYERS} player registrations. The league provides structure, visibility, and competitive opportunities for footballers across Kashmir. Season One is the inaugural chapter, based in ${LEAGUE.location}.`;
  }

  if (/how many franchise|number of franchise|16 franchise|franchise count/.test(q)) {
    return `Season One is built around ${FRANCHISES} official franchise teams. Each franchise represents a club in the league structure with its own identity, squad pathway, and matchday presence.`;
  }

  if (/how many player|number of player|288|player count|roster/.test(q)) {
    return `The league is designed for ${PLAYERS} registered players across ${FRANCHISES} franchises — giving Kashmiri footballers a structured, professional stage rather than scattered informal competition.`;
  }

  if (/registration fee|player fee|how much|cost|price|fee/.test(q) && !/franchise fee|owner fee/.test(q)) {
    return `The official player registration fee for Season One is ₹${FEE}, paid securely online during registration at ${SITE_URL}/register/player. This confirms your place in the application pool and triggers Player ID generation after payment.`;
  }

  if (/after registration|what happens next|next step|after i register|once i register/.test(q)) {
    return `After you complete registration and payment: (1) your Player ID is generated, (2) your application enters APL committee review, (3) you receive email confirmation, (4) you can track status at ${SITE_URL}/status. Once approved, you proceed toward Season One squad and fixture processes with your franchise pathway.`;
  }

  if (/what is a player id|player id|apl-\d|when.*id|get.*id/.test(q)) {
    return `Your Player ID is your official APL football identity (format APL-####). It is generated automatically after successful registration and payment confirmation. Use it at ${SITE_URL}/status to check your application status anytime.`;
  }

  if (/status|check application|application status|track/.test(q)) {
    return `Visit ${SITE_URL}/status and enter your Player ID (e.g. APL-4821). You'll see your application status and submission date. Updates are applied by the APL committee after review — changes reflect immediately.`;
  }

  if (/franchise application|how.*franchise|own a franchise|franchise work|franchise owner/.test(q)) {
    return `Franchise ownership applications are submitted at ${SITE_URL}/register/franchise. Season One has ${FRANCHISES} franchise spots. The APL committee reviews each application for commitment, professionalism, and operational readiness. Approved owners proceed through onboarding, branding, and squad building.`;
  }

  if (/league format|how does.*work|structure|tournament or league/.test(q)) {
    return `APL is a structured franchise-based league — not a one-off tournament. ${FRANCHISES} franchises, ${PLAYERS} registered players, official fixtures, and a competitive season format with professional standards for registration, review, and match operations.`;
  }

  if (/who can|eligibility|can i play|outside|baramulla|from kashmir/.test(q)) {
    return `APL welcomes eligible footballers from across Kashmir and beyond. You do not need to be from Baramulla specifically — the league is open to players who meet registration and committee standards for Season One.`;
  }

  if (/selection|chosen|picked|trial|scouting/.test(q)) {
    return `After registration and committee review, player progression follows APL selection processes aligned with franchise needs, squad requirements, and league standards. Approved players move forward within the Season One competitive structure.`;
  }

  if (/register.*player|player registration|how.*register/.test(q) && !/franchise/.test(q)) {
    return `Register at ${SITE_URL}/register/player: submit your details, upload photo and ID, pay ₹${FEE} securely, and receive your Player ID after payment confirmation. Your application then enters committee review.`;
  }

  if (/season one|when.*start|start date|schedule|fixture|when does/.test(q)) {
    return `Season One is APL's inaugural competitive season. The official schedule and fixtures are announced after player registrations and franchise approvals are completed. All registered participants receive direct updates on next steps.`;
  }

  if (/refund|money back|cancel/.test(q)) {
    return `Registration fees are non-refundable except in verified duplicate payment or technical error cases reviewed by the APL committee. Full policy: ${SITE_URL}/refund-policy.`;
  }

  if (/rulebook|rules|pdf|regulation/.test(q)) {
    return `Download the official APL Rulebook here: ${RULEBOOK_URL} — it covers format, eligibility, conduct, and league operating standards.`;
  }

  if (/contact|phone|call|help|support|reach/.test(q)) {
    return `Reach the APL team at ${CONTACT_PHONE}, email contact@apexpremiereleague.in, or the contact form at ${SITE_URL}/contact. I'm here for quick answers on registration and league info too.`;
  }

  if (/vision|mission|why apl|purpose|goal/.test(q)) {
    return `Kashmir has never lacked football talent. APL exists to provide structure, visibility, long-term planning, and a unified competitive ecosystem — connecting players, franchises, competition, media, and opportunity under one professional platform. Season One is the first chapter of a larger vision.`;
  }

  if (/payment|cashfree|pay online|secure/.test(q)) {
    return `Player registration payment of ₹${FEE} is processed through secure online checkout (Cashfree). Payment confirmation is required before your application and Player ID are finalized.`;
  }

  return null;
}

export function getDefaultKnowledgeReply(): string {
  return `I'm Apex, the APL assistant. Ask me about player registration (₹${FEE}), ${FRANCHISES} franchises, ${PLAYERS} players, Player IDs, application status, or Season One. For account-specific help, call ${CONTACT_PHONE}.`;
}
