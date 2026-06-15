export const FAQ_CATEGORIES = [
  {
    title: "Player FAQ",
    items: [
      {
        q: "How do I register?",
        a: "Complete the player registration form, submit the required details, complete the registration fee payment, and your application will enter review."
      },
      {
        q: "When do I get my Player ID?",
        a: "Your Player ID is automatically generated after successful registration and payment confirmation."
      },
      {
        q: "Can I play if I'm not from Baramulla?",
        a: "Yes. APL welcomes eligible players from across Kashmir and beyond."
      }
    ]
  },
  {
    title: "Franchise FAQ",
    items: [
      {
        q: "How many franchises are there?",
        a: "Season One is designed around 16 franchise teams."
      },
      {
        q: "What is the approval process?",
        a: "Each application is reviewed by the APL committee based on commitment, professionalism, and league requirements."
      },
      {
        q: "Can I add branding later?",
        a: "Yes. Approved franchises can finalize branding, kits, and promotional assets during onboarding."
      }
    ]
  },
  {
    title: "General FAQ",
    items: [
      {
        q: "When does Season One begin?",
        a: "The official schedule and fixtures will be announced after registrations and franchise approvals are completed."
      },
      {
        q: "Is the fee refundable?",
        a: "Registration fees are non-refundable except in verified duplicate payment or technical error cases."
      },
      {
        q: "Who do I contact for help?",
        a: "Contact the APL team directly at +91 8491900407 or use Apex AI for instant assistance."
      }
    ]
  }
];

export type FaqItem = { q: string; a: string };

export const FAQ_PREVIEW: FaqItem[] = [
  FAQ_CATEGORIES[0].items[0],
  FAQ_CATEGORIES[0].items[1],
  FAQ_CATEGORIES[2].items[0]
];
