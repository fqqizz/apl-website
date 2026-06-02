import { Phone } from "lucide-react";

export default function ContactFloat() {
  return (
    <a href="tel:+918491900407" className="contact-float">
      <Phone size={14} />
      <span>Need Help? +91 8491900407</span>
    </a>
  );
}
