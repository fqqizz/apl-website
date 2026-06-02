import StepSection from "@/components/features/StepSection";

const steps = [
  {
    number: "01",
    title: "REGISTER",
    body: "Choose your path — player or franchise owner. Complete the official APL registration. Get confirmed.",
    image: "/images/step-register.png"
  },
  {
    number: "02",
    title: "GET VERIFIED",
    body: "Your application is reviewed by the APL team. You receive your official Player ID or Franchise documentation.",
    image: "/images/step-verify.png"
  },
  {
    number: "03",
    title: "COMPETE",
    body: "Season One begins. Official fixtures. Real matches. Kashmir's first structured football league.",
    image: "/images/step-compete.png"
  }
];

export default function HowItWorks() {
  return <StepSection steps={steps} />;
}
