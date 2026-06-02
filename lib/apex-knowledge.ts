import { CONTACT_PHONE, LEAGUE, RULEBOOK_URL, SITE_URL } from "@/lib/apl-constants";

/** Deterministic answers — never deflect to “visit the website”. */
export function getKnowledgeReply(question: string): string | null {
  const q = question.toLowerCase().trim();

  if (/what is apl|what's apl|tell me about apl|about apex/.test(q)) {
    return `Apex Premier League (APL) is a franchise-based football league designed to create structured competition, visibility, and opportunities for footballers through ${LEAGUE.franchises} franchises and ${LEAGUE.players} registered players. Season One is the inaugural season from ${LEAGUE.location}.`;
  }

  if (/how many player|number of player|288/.test(q)) {
    return `Season One includes ${LEAGUE.players} registered player slots across the league.`;
  }

  if (/how many franchise|number of franchise|16 team/.test(q)) {
    return `Season One is built around ${LEAGUE.franchises} official franchise teams.`;
  }

  if (/registration fee|how much|cost|price|fee/.test(q) && !/franchise fee|owner/.test(q)) {
    return `The current player registration fee is ₹${LEAGUE.playerRegistrationFeeInr}, paid securely online during registration at ${SITE_URL}/register/player.`;
  }

  if (/player id|apl-\d|when.*id|get.*id/.test(q)) {
    return "Your Player ID is generated automatically after successful registration and payment confirmation. You can check application status anytime at /status using your Player ID (format APL-####).";
  }

  if (/status|check application|application status/.test(q)) {
    return "Go to /status and enter your Player ID (e.g. APL-4821). You will see your application status and submission date. Status updates are applied by the APL committee after review.";
  }

  if (/register.*player|player registration|how.*register/.test(q) && !/franchise/.test(q)) {
    return `Register at ${SITE_URL}/register/player: complete your details, upload photo and ID, pay ₹${LEAGUE.playerRegistrationFeeInr}, and your application enters committee review. Your Player ID is issued after payment confirmation.`;
  }

  if (/franchise|own a team|club owner/.test(q)) {
    return `Franchise ownership applications are at ${SITE_URL}/register/franchise. Season One has ${LEAGUE.franchises} franchise spots. The APL committee reviews each application for commitment and league fit. Founding owners receive priority placement.`;
  }

  if (/season one|when.*start|schedule|fixture/.test(q)) {
    return "Season One is APL's inaugural competitive season. The official schedule and fixtures are announced after player registrations and franchise approvals are completed. Registered participants receive direct updates.";
  }

  if (/refund/.test(q)) {
    return "Registration fees are non-refundable except in verified duplicate payment or technical error cases reviewed by the APL committee. Full terms are at /refund-policy.";
  }

  if (/baramulla|kashmir|where.*located|location/.test(q)) {
    return `APL is headquartered in ${LEAGUE.location}. Players from across Kashmir and beyond are welcome to register.`;
  }

  if (/contact|phone|call|help|support/.test(q)) {
    return `Reach the APL team at ${CONTACT_PHONE} or use the contact form at ${SITE_URL}/contact. I'm Apex — I can also answer registration, franchise, and Season One questions here.`;
  }

  if (/rulebook|rules|pdf/.test(q)) {
    return `Download the official APL Rulebook here: ${RULEBOOK_URL}`;
  }

  if (/vision|mission|why apl/.test(q)) {
    return "Kashmir has always produced football talent. APL brings structure, visibility, and a long-term ecosystem — players, franchises, competition, media, and opportunity in one professionally managed platform. Season One is only the beginning.";
  }

  return null;
}
