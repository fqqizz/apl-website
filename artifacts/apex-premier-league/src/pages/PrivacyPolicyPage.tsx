import { useEffect } from "react";
import { useLocation } from 'wouter';

export default function PrivacyPolicyRedirect() {
  const [, navigate] = useLocation();
  useEffect(() => { navigate("/privacy"); }, [navigate]);
  return null;
}
