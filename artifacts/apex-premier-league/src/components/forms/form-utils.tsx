

import { FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Upload } from "lucide-react";

export type ErrorMap = Record<string, string>;

export function Field({
  label,
  name,
  type = "text",
  required = false,
  error,
  inputMode,
  pattern,
  onInput
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  error?: string;
  inputMode?: "email" | "url" | "search" | "text" | "none" | "tel" | "numeric" | "decimal";
  pattern?: string;
  onInput?: (event: FormEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-label text-apl-text-muted">
        {label} {required && <span className="text-apl-blue">*</span>}
      </span>
      <input
        name={name}
        type={type}
        inputMode={inputMode}
        pattern={pattern}
        onInput={onInput}
        className={`field ${error ? "field-error" : ""}`}
        placeholder={label}
      />
      <AnimatePresence>
        {error && (
          <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-xs text-red-400">
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </label>
  );
}

export function UploadField({
  label,
  name,
  required = false,
  error,
  fileName,
  onFileChange
}: {
  label: string;
  name: string;
  required?: boolean;
  error?: string;
  fileName?: string;
  onFileChange?: (file: File | null) => void;
}) {
  return (
    <label className={`upload-field ${error ? "border-red-400/50" : ""}`}>
      <span>
        {label} {required && <span className="text-apl-blue">*</span>}
        {error && <span className="mt-1 block text-xs font-normal normal-case tracking-normal text-red-400">{error}</span>}
      </span>
      <Upload size={17} />
      <input
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,application/pdf"
        className="hidden"
        onChange={(event) => onFileChange?.(event.target.files?.[0] ?? null)}
      />
      {fileName && <p className="absolute bottom-2 left-4 text-xs text-apl-text-muted">{fileName}</p>}
    </label>
  );
}

export function validateForm(form: HTMLFormElement, required: string[]) {
  const data = new FormData(form);
  const nextErrors: ErrorMap = {};

  required.forEach((name) => {
    if (name === "termsAcceptance") {
      const checkbox = form.querySelector(`input[name="${name}"]`) as HTMLInputElement;
      if (!checkbox?.checked) nextErrors[name] = "Required";
      return;
    }
    const value = data.get(name);
    if (value instanceof File) {
      if (!value.name) nextErrors[name] = "Required";
      return;
    }
    if (!String(value || "").trim()) nextErrors[name] = "Required";
  });

  const email = String(data.get("email") || "");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) nextErrors.email = "Enter a valid email";

  return nextErrors;
}
