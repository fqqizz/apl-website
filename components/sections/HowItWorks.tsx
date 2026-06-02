import StepSection from "@/components/features/StepSection";

const steps = [
  {
    step: 1,
    title: "Register",
    body: "Choose your path — player or franchise owner. Complete the official APL registration. Get confirmed.",
    image: "/images/step-register.png"
  },
  {
    step: 2,
    title: "Get Verified",
    body: "Your application is reviewed by the APL team. You receive your official Player ID or Franchise documentation.",
    image: "/images/step-verify.png"
  },
  {
    step: 3,
    title: "Compete",
    body: "Season One begins. Official fixtures. Real matches. Kashmir's first structured football league.",
    image: "/images/step-compete.png"
  }
];

export default function HowItWorks() {
  return <StepSection steps={steps} />;
}
