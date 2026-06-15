import { useEffect } from "react";
import { useLocation } from 'wouter';

export default function TermsAndConditionsRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/terms"); }, [navigate]);
  return null;
}
