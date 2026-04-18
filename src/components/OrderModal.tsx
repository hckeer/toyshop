"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { submitOrder } from "@/lib/orders";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  productId?: string;
  productSlug?: string;
  productPrice?: number;
}

function formatNPR(n: number) {
  return `NPR ${n.toLocaleString("en-NP")}`;
}

export default function OrderModal({
  isOpen,
  onClose,
  productName,
  productId,
  productSlug,
  productPrice,
}: OrderModalProps) {
  const [form, setForm] = useState({
    customer_name: "",
    phone: "",
    location: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const firstInputRef = useRef<HTMLInputElement>(null);

  // Focus first input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstInputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "submitting") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isOpen, onClose, status]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.customer_name.trim()) errs.customer_name = "Name is required";
    if (!form.phone.trim()) errs.phone = "Phone number is required";
    else if (!/^[\d\s\+\-\(\)]{7,15}$/.test(form.phone.trim()))
      errs.phone = "Enter a valid phone number";
    if (!form.location.trim()) errs.location = "Location / address is required";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setStatus("submitting");
    const result = await submitOrder({
      product_id: productId,
      product_name: productName,
      product_slug: productSlug,
      customer_name: form.customer_name.trim(),
      phone: form.phone.trim(),
      location: form.location.trim(),
      notes: form.notes.trim() || undefined,
    });

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.error || "Something went wrong. Please try again.");
    }
  }

  function handleClose() {
    if (status === "submitting") return;
    setStatus("idle");
    setErrors({});
    setForm({ customer_name: "", phone: "", location: "", notes: "" });
    onClose();
  }

  const inputStyle = (field: string) => ({
    width: "100%",
    background: "rgba(255,255,255,0.04)",
    border: `1px solid ${errors[field] ? "rgba(255,45,0,0.6)" : "rgba(255,255,255,0.1)"}`,
    borderRadius: 8,
    padding: "0.75rem 1rem",
    color: "rgba(255,255,255,0.9)",
    fontSize: "0.875rem",
    outline: "none",
    transition: "border-color 0.2s",
    fontFamily: "inherit",
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={handleClose}
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(6,8,15,0.85)",
              backdropFilter: "blur(8px)",
              zIndex: 9000,
            }}
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, y: 80, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 60, scale: 0.97 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 9001,
              maxWidth: 560,
              margin: "0 auto",
              background:
                "linear-gradient(160deg, rgba(18,20,30,0.98), rgba(10,10,18,0.99))",
              border: "1px solid rgba(255,255,255,0.08)",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              boxShadow: "0 -12px 60px rgba(0,0,0,0.5)",
              padding: "2rem 1.75rem 2.5rem",
            }}
            role="dialog"
            aria-modal="true"
            aria-label={`Order ${productName}`}
          >
            {/* Drag handle */}
            <div
              style={{
                width: 40,
                height: 4,
                background: "rgba(255,255,255,0.12)",
                borderRadius: 4,
                margin: "0 auto 1.5rem",
              }}
            />

            <AnimatePresence mode="wait">
              {status === "success" ? (
                /* ── SUCCESS STATE ── */
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  style={{ textAlign: "center", padding: "1rem 0 0.5rem" }}
                >
                  {/* Checkmark animation */}
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                      delay: 0.1,
                      type: "spring",
                      stiffness: 300,
                      damping: 20,
                    }}
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: "50%",
                      background:
                        "linear-gradient(135deg, rgba(0,200,83,0.15), rgba(0,200,83,0.08))",
                      border: "2px solid rgba(0,200,83,0.4)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1.25rem",
                    }}
                  >
                    <svg
                      width="32"
                      height="32"
                      viewBox="0 0 32 32"
                      fill="none"
                    >
                      <path
                        d="M6 16L13 23L26 9"
                        stroke="#00C853"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </motion.div>

                  <h2
                    className="font-heading"
                    style={{
                      fontSize: "1.75rem",
                      fontWeight: 800,
                      color: "rgba(255,255,255,0.95)",
                      letterSpacing: "-0.01em",
                      marginBottom: "0.5rem",
                    }}
                  >
                    Order Received!
                  </h2>
                  <p
                    className="font-body"
                    style={{
                      color: "rgba(255,255,255,0.5)",
                      fontSize: "0.875rem",
                      lineHeight: 1.7,
                      marginBottom: "1.75rem",
                    }}
                  >
                    We'll call or message you shortly to confirm your{" "}
                    <span style={{ color: "rgba(255,140,0,0.9)" }}>
                      {productName}
                    </span>{" "}
                    order. Thank you!
                  </p>
                  <button
                    onClick={handleClose}
                    className="font-body"
                    style={{
                      background:
                        "linear-gradient(135deg, #FF2D00, #FF8C00)",
                      border: "none",
                      borderRadius: 999,
                      padding: "0.75rem 2rem",
                      color: "#fff",
                      fontSize: "0.875rem",
                      fontWeight: 600,
                      letterSpacing: "0.04em",
                      cursor: "pointer",
                    }}
                  >
                    Done
                  </button>
                </motion.div>
              ) : (
                /* ── FORM STATE ── */
                <motion.div key="form" initial={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  {/* Header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      marginBottom: "1.5rem",
                    }}
                  >
                    <div>
                      <p
                        className="font-body"
                        style={{
                          fontSize: "0.65rem",
                          letterSpacing: "0.2em",
                          color: "rgba(255,45,0,0.75)",
                          fontWeight: 600,
                          textTransform: "uppercase",
                          marginBottom: "0.25rem",
                        }}
                      >
                        Place Order
                      </p>
                      <h2
                        className="font-heading"
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 800,
                          color: "rgba(255,255,255,0.95)",
                          letterSpacing: "-0.01em",
                        }}
                      >
                        {productName}
                      </h2>
                      {productPrice && (
                        <p
                          className="font-body"
                          style={{
                            fontSize: "0.875rem",
                            color: "rgba(255,140,0,0.85)",
                            marginTop: "0.2rem",
                          }}
                        >
                          {formatNPR(productPrice)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={handleClose}
                      aria-label="Close order form"
                      style={{
                        background: "rgba(255,255,255,0.06)",
                        border: "1px solid rgba(255,255,255,0.1)",
                        borderRadius: "50%",
                        width: 34,
                        height: 34,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        color: "rgba(255,255,255,0.5)",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path
                          d="M1 1L13 13M13 1L1 13"
                          stroke="currentColor"
                          strokeWidth="1.8"
                          strokeLinecap="round"
                        />
                      </svg>
                    </button>
                  </div>

                  {/* Error banner */}
                  {status === "error" && (
                    <div
                      style={{
                        background: "rgba(255,45,0,0.1)",
                        border: "1px solid rgba(255,45,0,0.3)",
                        borderRadius: 8,
                        padding: "0.75rem 1rem",
                        marginBottom: "1rem",
                        fontSize: "0.8rem",
                        color: "rgba(255,90,60,0.9)",
                      }}
                    >
                      {errorMessage}
                    </div>
                  )}

                  {/* Form */}
                  <form onSubmit={handleSubmit} noValidate>
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
                      {/* Name */}
                      <div>
                        <label
                          className="font-body"
                          htmlFor="order-name"
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.45)",
                            marginBottom: "0.35rem",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Full Name *
                        </label>
                        <input
                          ref={firstInputRef}
                          id="order-name"
                          type="text"
                          autoComplete="name"
                          placeholder="Your name"
                          value={form.customer_name}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "rgba(255,140,0,0.5)")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = errors.customer_name
                              ? "rgba(255,45,0,0.6)"
                              : "rgba(255,255,255,0.1)")
                          }
                          onChange={(e) => {
                            setForm((f) => ({ ...f, customer_name: e.target.value }));
                            if (errors.customer_name)
                              setErrors((err) => ({ ...err, customer_name: "" }));
                          }}
                          style={inputStyle("customer_name")}
                        />
                        {errors.customer_name && (
                          <p style={{ color: "rgba(255,45,0,0.8)", fontSize: "0.72rem", marginTop: "0.3rem" }}>
                            {errors.customer_name}
                          </p>
                        )}
                      </div>

                      {/* Phone */}
                      <div>
                        <label
                          className="font-body"
                          htmlFor="order-phone"
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.45)",
                            marginBottom: "0.35rem",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Phone Number *
                        </label>
                        <input
                          id="order-phone"
                          type="tel"
                          autoComplete="tel"
                          placeholder="+977 98XXXXXXXX"
                          value={form.phone}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "rgba(255,140,0,0.5)")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = errors.phone
                              ? "rgba(255,45,0,0.6)"
                              : "rgba(255,255,255,0.1)")
                          }
                          onChange={(e) => {
                            setForm((f) => ({ ...f, phone: e.target.value }));
                            if (errors.phone) setErrors((err) => ({ ...err, phone: "" }));
                          }}
                          style={inputStyle("phone")}
                        />
                        {errors.phone && (
                          <p style={{ color: "rgba(255,45,0,0.8)", fontSize: "0.72rem", marginTop: "0.3rem" }}>
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Location */}
                      <div>
                        <label
                          className="font-body"
                          htmlFor="order-location"
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.45)",
                            marginBottom: "0.35rem",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Location / Delivery Address *
                        </label>
                        <input
                          id="order-location"
                          type="text"
                          autoComplete="street-address"
                          placeholder="City, Area, Street..."
                          value={form.location}
                          onFocus={(e) =>
                            (e.target.style.borderColor = "rgba(255,140,0,0.5)")
                          }
                          onBlur={(e) =>
                            (e.target.style.borderColor = errors.location
                              ? "rgba(255,45,0,0.6)"
                              : "rgba(255,255,255,0.1)")
                          }
                          onChange={(e) => {
                            setForm((f) => ({ ...f, location: e.target.value }));
                            if (errors.location)
                              setErrors((err) => ({ ...err, location: "" }));
                          }}
                          style={inputStyle("location")}
                        />
                        {errors.location && (
                          <p style={{ color: "rgba(255,45,0,0.8)", fontSize: "0.72rem", marginTop: "0.3rem" }}>
                            {errors.location}
                          </p>
                        )}
                      </div>

                      {/* Notes */}
                      <div>
                        <label
                          className="font-body"
                          htmlFor="order-notes"
                          style={{
                            display: "block",
                            fontSize: "0.75rem",
                            color: "rgba(255,255,255,0.45)",
                            marginBottom: "0.35rem",
                            letterSpacing: "0.04em",
                          }}
                        >
                          Extra Notes{" "}
                          <span style={{ opacity: 0.5 }}>(optional)</span>
                        </label>
                        <textarea
                          id="order-notes"
                          rows={3}
                          placeholder="Colour preference, colour variants, any questions..."
                          value={form.notes}
                          onChange={(e) =>
                            setForm((f) => ({ ...f, notes: e.target.value }))
                          }
                          onFocus={(e) =>
                            (e.currentTarget.style.borderColor = "rgba(255,140,0,0.5)")
                          }
                          onBlur={(e) =>
                            (e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)")
                          }
                          style={{
                            ...inputStyle("notes"),
                            resize: "none",
                          }}
                        />
                      </div>

                      {/* Submit */}
                      <button
                        type="submit"
                        id="order-submit-btn"
                        disabled={status === "submitting"}
                        className="font-body"
                        style={{
                          marginTop: "0.25rem",
                          background:
                            status === "submitting"
                              ? "rgba(255,45,0,0.4)"
                              : "linear-gradient(135deg, #FF2D00, #FF8C00)",
                          border: "none",
                          borderRadius: 999,
                          padding: "0.9rem 2rem",
                          color: "#fff",
                          fontSize: "0.875rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                          cursor: status === "submitting" ? "not-allowed" : "pointer",
                          transition: "opacity 0.2s, transform 0.15s",
                          boxShadow: "0 6px 24px rgba(255,45,0,0.3)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: "0.5rem",
                        }}
                      >
                        {status === "submitting" ? (
                          <>
                            <svg
                              width="16"
                              height="16"
                              viewBox="0 0 24 24"
                              fill="none"
                              style={{
                                animation: "spin 0.8s linear infinite",
                              }}
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="rgba(255,255,255,0.3)"
                                strokeWidth="2"
                              />
                              <path
                                d="M12 2a10 10 0 0 1 10 10"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                            Placing Order...
                          </>
                        ) : (
                          "PLACE ORDER"
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
