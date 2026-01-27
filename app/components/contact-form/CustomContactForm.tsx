"use client";

import { useState, FormEvent } from "react";
import styles from "./CustomContactForm.module.css";

interface FormData {
  firstname: string;
  email: string;
  lastname: string;
  message: string;
}

interface FormErrors {
  firstname?: string;
  email?: string;
  lastname?: string;
  message?: string;
  submit?: string;
}

export default function CustomContactForm() {
  const [formData, setFormData] = useState<FormData>({
    firstname: "",
    email: "",
    lastname: "",
    message: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const validate = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = "First name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // lastname and message are optional, no validation needed

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus("idle");
    setErrors({});

    try {
      const response = await fetch("/api/contact/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setSubmitStatus("success");
        setFormData({
          firstname: "",
          email: "",
          lastname: "",
          message: "",
        });
        // Scroll to success message
        setTimeout(() => {
          const successElement = document.getElementById("form-success");
          successElement?.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }, 100);
      } else {
        setSubmitStatus("error");
        const errorMessage =
          response.status === 429
            ? "Too many requests. Please wait a few minutes before trying again."
            : data.error || "Failed to submit form. Please try again.";
        setErrors({ submit: errorMessage });
      }
    } catch {
      setSubmitStatus("error");
      setErrors({
        submit: "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <>
      {submitStatus === "success" ? (
        <div id="form-success" className={styles.successMessage}>
          <div className={styles.successIcon}>✓</div>
          <h2 className={styles.successTitle}>Thank You!</h2>
          <p className={styles.successText}>
            Your message has been sent successfully. I&apos;ll get back to you as soon as possible.
          </p>
        </div>
      ) : (
        <>
          {submitStatus === "error" && errors.submit && (
            <div className={styles.errorMessage}>
              <strong>Error:</strong> {errors.submit}
            </div>
          )}
          <form onSubmit={handleSubmit} className={styles.form} noValidate>

      <div className={styles.nameRow}>
        <div className={styles.formGroup}>
          <label htmlFor="firstname">
            First Name <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            id="firstname"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
            required
            aria-invalid={!!errors.firstname}
            aria-describedby={errors.firstname ? "firstname-error" : undefined}
          />
          {errors.firstname && (
            <span id="firstname-error" className={styles.fieldError}>
              {errors.firstname}
            </span>
          )}
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="lastname">Last Name</label>
          <input
            type="text"
            id="lastname"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="email">
          Email <span className={styles.required}>*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? "email-error" : undefined}
        />
        {errors.email && (
          <span id="email-error" className={styles.fieldError}>
            {errors.email}
          </span>
        )}
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          rows={5}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={styles.submitButton}
      >
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
    </form>
        </>
      )}
    </>
  );
}
