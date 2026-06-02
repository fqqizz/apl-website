"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { load } from "@cashfreepayments/cashfree-js";
import { Check, CreditCard, Lock, X } from "lucide-react";
import { savePendingPlayerRegistration } from "@/lib/pendingRegistration";
import { ErrorMap, Field, UploadField, validateForm } from "@/components/forms/form-utils";
import Button from "@/components/ui/Button";

const transition: Transition = { duration: 0.76, ease: [0.22, 1, 0.36, 1] };
type PaymentState = "idle" | "checkout" | "success" | "failed";

function PaymentModal({
  state,
  setState,
  formData
}: {
  state: PaymentState;
  setState: (state: PaymentState) => void;
  formData: Record<string, unknown>;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState("");
  const paymentLock = useRef(false);

  const handleCashfreePayment = async () => {
    if (paymentLock.current) return;
    paymentLock.current = true;
    setIsLoading(true);
    setUploadProgress("Connecting to payment gateway...");
    setError(null);
    let paymentData: { paymentSessionId?: string; paymentLink?: string; orderId?: string } | null = null;

    try {
      const photoFile = formData.photo as File;
      const idFile = formData.idUpload as File;

      if (!photoFile || !idFile) {
        setError("Files missing from form data");
        setIsLoading(false);
        paymentLock.current = false;
        return;
      }

      setUploadProgress("Initiating payment...");
      const response = await fetch("/api/payments/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone
        })
      });

      paymentData = await response.json();

      if (!response.ok || (!paymentData?.paymentSessionId && !paymentData?.paymentLink)) {
        setError("Failed to load payment gateway. Please try again.");
        setIsLoading(false);
        paymentLock.current = false;
        return;
      }

      const orderId = paymentData.orderId;
      if (!orderId) {
        setError("Unable to create payment order. Please try again.");
        setIsLoading(false);
        paymentLock.current = false;
        return;
      }

      await savePendingPlayerRegistration({
        orderId,
        createdAt: Date.now(),
        fullName: String(formData.fullName),
        age: parseInt(String(formData.age), 10),
        position: String(formData.position),
        preferredFoot: String(formData.foot),
        contactNumber: String(formData.phone),
        email: String(formData.email),
        instagram: (formData.instagram as string) || null,
        area: String(formData.area),
        photoFile,
        idFile,
        photoName: photoFile.name,
        idName: idFile.name,
        photoType: photoFile.type,
        idType: idFile.type
      });

      const cashfreeMode = ["TEST", "SANDBOX"].includes((process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || "").toUpperCase())
        ? "sandbox"
        : "production";

      const cashfree = await load({ mode: cashfreeMode });
      setUploadProgress("Opening secure payment...");

      if (paymentData.paymentSessionId && cashfree && typeof cashfree.checkout === "function") {
        await cashfree.checkout({ paymentSessionId: paymentData.paymentSessionId, redirectTarget: "_self" });
      } else if (paymentData.paymentLink) {
        window.location.assign(paymentData.paymentLink);
      } else {
        throw new Error("No payment session or link available");
      }
      setIsLoading(false);
      paymentLock.current = false;
    } catch {
      if (paymentData?.paymentLink) {
        window.location.assign(paymentData.paymentLink);
      } else {
        setError("Failed to process payment. Please try again.");
      }
      setUploadProgress("");
      setIsLoading(false);
      paymentLock.current = false;
    }
  };

  return (
    <AnimatePresence>
      {state !== "idle" && (
        <motion.div className="fixed inset-0 z-[70] grid place-items-center bg-apl-navy/80 p-4 backdrop-blur-md" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.96 }}
            transition={transition}
            className="max-h-[calc(100dvh-2rem)] w-full max-w-md overflow-y-auto rounded-xl border border-apl bg-apl-navy-mid p-6"
          >
            {state === "checkout" && (
              <>
                <div className="flex items-center justify-between">
                  <p className="text-label text-apl-text-muted">Secure Checkout</p>
                  <button type="button" onClick={() => setState("idle")} aria-label="Close" className="text-apl-text-muted hover:text-white">
                    <X size={18} />
                  </button>
                </div>
                <h3 className="text-display-md mt-4 text-apl-white">₹249</h3>
                <p className="mt-3 text-body-md text-apl-text-secondary">Official APL player registration via Cashfree.</p>
                <div className="mt-5 rounded-lg border border-apl bg-apl-glass p-4">
                  <div className="flex items-center gap-3 text-sm">
                    <CreditCard size={18} />
                    Card / UPI / Wallet
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-apl-text-muted">
                    <Lock size={13} />
                    Encrypted checkout
                  </div>
                </div>
                {error && <p className="mt-4 text-sm text-red-400">{error}</p>}
                {uploadProgress && <p className="mt-4 text-sm text-apl-text-secondary">{uploadProgress}</p>}
                <div className="mt-6 grid gap-3">
                  <Button onClick={handleCashfreePayment} disabled={isLoading} className="w-full justify-center">
                    {isLoading ? "Processing..." : "Proceed to Payment"}
                  </Button>
                  <Button variant="secondary" onClick={() => setState("idle")} disabled={isLoading} className="w-full justify-center">
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function PlayerRegistrationForm() {
  const [errors, setErrors] = useState<ErrorMap>({});
  const [paymentState, setPaymentState] = useState<PaymentState>("idle");
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [photoFileName, setPhotoFileName] = useState("");
  const [idFileName, setIdFileName] = useState("");
  const required = ["fullName", "age", "position", "foot", "phone", "email", "area", "photo", "idUpload", "termsAcceptance"];

  useEffect(() => {
    const cashfreeMode = ["TEST", "SANDBOX"].includes((process.env.NEXT_PUBLIC_CASHFREE_ENVIRONMENT || "").toUpperCase())
      ? "sandbox"
      : "production";
    void load({ mode: cashfreeMode }).catch(() => undefined);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm(event.currentTarget, required);
    if (photoFile && photoFile.size > 5 * 1024 * 1024) nextErrors.photo = "Photo must be 5MB or smaller.";
    if (idFile && idFile.size > 5 * 1024 * 1024) nextErrors.idUpload = "ID upload must be 5MB or smaller.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    const data = new FormData(event.currentTarget);
    const formDataObj: Record<string, unknown> = {};
    data.forEach((value, key) => {
      formDataObj[key] = value;
    });
    formDataObj.photo = photoFile;
    formDataObj.idUpload = idFile;
    setFormData(formDataObj);
    setPaymentState("checkout");
  };

  return (
    <>
      <form onSubmit={handleSubmit} noValidate className="form-surface grid gap-5 md:grid-cols-2">
        <Field label="Full Name" name="fullName" required error={errors.fullName} />
        <Field label="Age" name="age" type="number" required error={errors.age} />
        <Field label="Position" name="position" required error={errors.position} />
        <Field label="Preferred Foot" name="foot" required error={errors.foot} />
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
        <Field label="Instagram" name="instagram" />
        <Field label="Area/District" name="area" required error={errors.area} />
        <div className="relative md:col-span-1">
          <UploadField
            label="Upload Photo"
            name="photo"
            required
            error={errors.photo}
            fileName={photoFileName}
            onFileChange={(file) => {
              setPhotoFile(file);
              setPhotoFileName(file?.name || "");
            }}
          />
        </div>
        <div className="relative md:col-span-1">
          <UploadField
            label="Upload ID"
            name="idUpload"
            required
            error={errors.idUpload}
            fileName={idFileName}
            onFileChange={(file) => {
              setIdFile(file);
              setIdFileName(file?.name || "");
            }}
          />
        </div>
        <label className={`md:col-span-2 flex gap-3 ${errors.termsAcceptance ? "text-red-400" : ""}`}>
          <input type="checkbox" name="termsAcceptance" className="mt-1 h-5 w-5 shrink-0 accent-apl-blue" />
          <span className="text-body-md">
            I accept the{" "}
            <Link href="/terms" className="text-apl-blue hover:underline">
              terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-apl-blue hover:underline">
              privacy policy
            </Link>{" "}
            <span className="text-apl-blue">*</span>
          </span>
        </label>
        <div className="md:col-span-2">
          <Button type="submit" className="w-full justify-center md:w-auto">
            Continue To Payment
          </Button>
        </div>
      </form>
      <PaymentModal state={paymentState} setState={setPaymentState} formData={formData} />
    </>
  );
}
