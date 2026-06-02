"use client";

import { FormEvent, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";
import { insertFranchise } from "@/lib/database";
import { uploadFranchiseLogo } from "@/lib/uploads";
import { ErrorMap, Field, UploadField, validateForm } from "@/components/forms/form-utils";
import Button from "@/components/ui/Button";

export default function FranchiseRegistrationForm() {
  const [errors, setErrors] = useState<ErrorMap>({});
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitMessage, setSubmitMessage] = useState("");
  const required = ["ownerName", "phone", "email", "teamArea"];

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);
    const nextErrors = validateForm(event.currentTarget, required);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length !== 0) return;

    setIsSubmitting(true);
    setSubmitMessage("Connecting to Apex...");

    try {
      const data = new FormData(event.currentTarget);
      const logoFile = data.get("logo") as File | null;

      let logoUrl: string | null = null;
      if (logoFile?.name) {
        setSubmitMessage("Uploading logo...");
        const upload = await uploadFranchiseLogo(logoFile);
        if (!upload.success) {
          setSubmitError(upload.error || "Failed to upload logo");
          setIsSubmitting(false);
          setSubmitMessage("");
          return;
        }
        logoUrl = upload.url || null;
      }

      setSubmitMessage("Finalizing application...");
      const result = await insertFranchise({
        owner_name: String(data.get("ownerName") || ""),
        contact_number: String(data.get("phone") || ""),
        email: String(data.get("email") || ""),
        team_area: String(data.get("teamArea") || ""),
        team_name: String(data.get("teamName") || null),
        team_colors: String(data.get("teamColors") || null),
        squad_estimate: String(data.get("squadEstimate") || null),
        manager_name: String(data.get("managerName") || null),
        instagram: String(data.get("instagram") || null),
        previous_experience: String(data.get("experience") || null),
        logo_url: logoUrl,
        approval_status: "pending"
      } as never);

      if (!result.success) {
        setSubmitError(result.error || "Failed to save franchise application");
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
      setSubmitMessage("");
    }
  };

  if (submitted) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-apl-blue">
          <Check size={22} className="text-white" />
        </div>
        <h3 className="text-display-md mt-6 text-apl-white">Application received</h3>
        <p className="mt-4 text-body-md text-apl-text-secondary">
          Your franchise application has been submitted. The APL Committee will contact you via email with next steps.
        </p>
        <Button className="mt-8 justify-center" onClick={() => setSubmitted(false)}>
          Submit another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="glass-card grid gap-5 md:grid-cols-2">
      <Field label="Owner Name" name="ownerName" required error={errors.ownerName} />
      <Field
        label="Contact Number"
        name="phone"
        type="tel"
        required
        error={errors.phone}
        inputMode="numeric"
        pattern="[0-9]*"
        onInput={(e) => {
          e.currentTarget.value = e.currentTarget.value.replace(/\D/g, "");
        }}
      />
      <Field label="Email" name="email" type="email" required error={errors.email} />
      <Field label="Team Area" name="teamArea" required error={errors.teamArea} />
      <p className="md:col-span-2 border-t border-apl pt-4 text-body-md text-apl-text-muted">
        Optional details may be submitted after approval.
      </p>
      <Field label="Team Name" name="teamName" />
      <Field label="Team Colors" name="teamColors" />
      <Field label="Squad Estimate" name="squadEstimate" />
      <Field label="Manager Name" name="managerName" />
      <Field label="Instagram" name="instagram" />
      <Field label="Previous Experience" name="experience" />
      <div className="md:col-span-2">
        <UploadField label="Logo Upload" name="logo" />
      </div>
      <div className="md:col-span-2">
        <Button type="submit" disabled={isSubmitting} className="w-full justify-center md:w-auto">
          {isSubmitting ? "Submitting..." : "Submit Franchise Application"}
        </Button>
      </div>
      {submitMessage && <p className="md:col-span-2 text-sm text-apl-text-secondary">{submitMessage}</p>}
      {submitError && <p className="md:col-span-2 text-sm text-red-400">{submitError}</p>}
    </form>
  );
}
