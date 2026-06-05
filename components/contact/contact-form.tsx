"use client";

import { useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import { Input } from "@/components/ui/input";

const inputClassName =
  "min-h-14 rounded-[1.5rem] border border-black/12 bg-white px-5 text-base text-black shadow-none placeholder:text-black/34 focus:border-black/24 focus:bg-white";

const textareaClassName =
  "min-h-[180px] w-full rounded-[1.5rem] border border-black/12 bg-white px-5 py-4 text-base text-black outline-none transition placeholder:text-black/34 focus:border-black/24";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");
    setMessage("");

    try {
      await new Promise((resolve) => {
        window.setTimeout(resolve, 700);
      });

      setStatus("success");
      setMessage("Message sent. Our team will get back to you shortly.");
      event.currentTarget.reset();
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.24em] text-black/42">Inquiry Form</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Send Message</h2>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput label="Name" htmlFor="contact-name">
          <Input id="contact-name" name="name" required className={inputClassName} />
        </FormInput>
        <FormInput label="Company" htmlFor="contact-company">
          <Input id="contact-company" name="company" className={inputClassName} />
        </FormInput>
        <FormInput label="Email" htmlFor="contact-email">
          <Input id="contact-email" name="email" type="email" required className={inputClassName} />
        </FormInput>
        <FormInput label="Country" htmlFor="contact-country">
          <Input id="contact-country" name="country" className={inputClassName} />
        </FormInput>
      </div>

      <FormInput label="Message" htmlFor="contact-message">
        <textarea
          id="contact-message"
          name="message"
          required
          className={textareaClassName}
          placeholder="Tell us about your product, project, timeline, or collaboration idea."
        />
      </FormInput>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button type="submit" disabled={status === "loading"} className={buttonStyles({ size: "lg" })}>
          {status === "loading" ? "Sending..." : "Send Message"}
        </button>
        <div
          className={`rounded-full px-4 py-2 text-sm ${
            status === "success"
              ? "bg-black text-white"
              : status === "error"
                ? "bg-red-50 text-red-600"
                : "bg-[#f5f5f2] text-black/48"
          }`}
          aria-live="polite"
        >
          {status === "idle" ? "We reply to serious project inquiries with clear next steps." : message}
        </div>
      </div>
    </form>
  );
}
