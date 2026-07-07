import { useState, useRef, useEffect, useCallback } from "react";
import API from "../api";

const OTP_LENGTH = 6;
const RESEND_COOLDOWN = 60; // seconds

function VerifyOTPNotice({ setPage, email, showMessage }) {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [resendState, setResendState] = useState("idle");
  const [verifyState, setVerifyState] = useState("idle");
  const [shake, setShake] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const inputsRef = useRef([]);

  const otp = digits.join("");

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setInterval(() => setCooldown((c) => Math.max(c - 1, 0)), 1000);
    return () => clearInterval(timer);
  }, [cooldown]);

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 400);
  };

  const focusInput = (index) => {
    inputsRef.current[index]?.focus();
    inputsRef.current[index]?.select();
  };

  function handleDigitChange(index, value) {
    const clean = value.replace(/\D/g, "");
    if (!clean) {
      const next = [...digits];
      next[index] = "";
      setDigits(next);
      return;
    }

    // Handle paste of multiple digits into one box
    if (clean.length > 1) {
      const next = [...digits];
      let cursor = index;
      for (const ch of clean) {
        if (cursor >= OTP_LENGTH) break;
        next[cursor] = ch;
        cursor++;
      }
      setDigits(next);
      focusInput(Math.min(cursor, OTP_LENGTH - 1));
      return;
    }

    const next = [...digits];
    next[index] = clean;
    setDigits(next);
    if (index < OTP_LENGTH - 1) focusInput(index + 1);
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      focusInput(index - 1);
    }
    if (e.key === "ArrowLeft" && index > 0) focusInput(index - 1);
    if (e.key === "ArrowRight" && index < OTP_LENGTH - 1) focusInput(index + 1);
  }

  function handlePaste(e) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    if (!text) return;
    e.preventDefault();
    const next = Array(OTP_LENGTH).fill("");
    for (let i = 0; i < text.length; i++) next[i] = text[i];
    setDigits(next);
    focusInput(Math.min(text.length, OTP_LENGTH - 1));
  }

  async function handleVerify() {
    if (!email || otp.length !== OTP_LENGTH) {
      triggerShake();
      showMessage("Enter the 6-digit code sent to your email.", "warning");
      return;
    }

    setVerifyState("sending");
    try {
      await API.post("/auth/verify-otp", { email, otp });
      setVerifyState("verified");
      showMessage("Account verified successfully. You can now log in.", "success");
      setTimeout(() => setPage("login"), 700);
    } catch {
      setVerifyState("error");
      triggerShake();
      showMessage("That code is invalid or has expired. Please try again.", "error");
    }
  }

  const handleResend = useCallback(async () => {
    if (!email || cooldown > 0) return;
    setResendState("sending");
    try {
      await API.post("/auth/resend-verification", { email });
      setResendState("sent");
      setCooldown(RESEND_COOLDOWN);
      setDigits(Array(OTP_LENGTH).fill(""));
      focusInput(0);
      showMessage("A new verification code has been sent.", "success");
    } catch {
      setResendState("error");
      showMessage("Couldn't resend the code. Please try again in a moment.", "error");
    }
  }, [email, cooldown]);

  const isComplete = otp.length === OTP_LENGTH;
  const isVerified = verifyState === "verified";

  return (
    <div className="auth-page">
      <div className={`auth-card verify-card${shake ? " verify-shake" : ""}`}>
        <div className={`verify-icon${isVerified ? " verify-icon-success" : ""}`}>
          {isVerified ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 013 17.5v-11z" stroke="white" strokeWidth="1.6" />
              <path d="M4 6.5l8 6 8-6" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <span className="auth-eyebrow">Account verification</span>
        <h1 className="auth-title">{isVerified ? "You're verified!" : "Enter your code"}</h1>
        <p className="auth-subtitle">
          {isVerified ? (
            "Redirecting you to login…"
          ) : (
            <>
              We sent a 6-digit verification code to
              {email ? (
                <>
                  {" "}
                  <strong className="verify-email-highlight">{email}</strong>
                </>
              ) : (
                " your email address"
              )}
              .
            </>
          )}
        </p>

        {!isVerified && (
          <>
            <div className="otp-input-group" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  type="text"
                  inputMode="numeric"
                  autoComplete={i === 0 ? "one-time-code" : "off"}
                  maxLength={OTP_LENGTH}
                  value={d}
                  onChange={(e) => handleDigitChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  onFocus={(e) => e.target.select()}
                  className={`otp-box${verifyState === "error" ? " otp-box-error" : ""}${d ? " otp-box-filled" : ""}`}
                />
              ))}
            </div>

            <button
              type="button"
              className="auth-submit"
              onClick={handleVerify}
              disabled={verifyState === "sending" || !isComplete}
            >
              {verifyState === "sending" ? "Verifying…" : "Verify account"}
            </button>

            <button
              type="button"
              className="auth-submit verify-resend-btn"
              onClick={handleResend}
              disabled={!email || resendState === "sending" || cooldown > 0}
            >
              {resendState === "sending"
                ? "Sending…"
                : cooldown > 0
                ? `Resend code in ${String(Math.floor(cooldown / 60)).padStart(1, "0")}:${String(cooldown % 60).padStart(2, "0")}`
                : "Resend code"}
            </button>

            {verifyState === "error" && (
              <p className="verify-error">The code you entered was incorrect.</p>
            )}

            <div className="auth-footer">
              Already verified?{" "}
              <span onClick={() => setPage("login")}>Back to login</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default VerifyOTPNotice;