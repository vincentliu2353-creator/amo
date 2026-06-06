"use client";

import { useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import { Input } from "@/components/ui/input";

const inputClassName =
  "min-h-14 rounded-[1.5rem] border border-white/12 bg-white/[0.04] px-5 text-base text-white shadow-none placeholder:text-white/34 focus:border-white/24 focus:bg-white/[0.06]";

const textareaClassName =
  "min-h-[180px] w-full rounded-[1.5rem] border border-white/12 bg-white/[0.04] px-5 py-4 text-base text-white outline-none transition placeholder:text-white/34 focus:border-white/24 focus:bg-white/[0.06]";

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
        <p className="text-xs uppercase tracking-[0.24em] text-white/42">Quick Contact</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white md:text-5xl">Send Message</h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/64">
          Use this for early project context. If no live backend is configured, the form still completes safely on the client and confirms receipt locally.
        </p>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormInput label="Name" htmlFor="contact-name" tone="dark">
          <Input id="contact-name" name="name" required className={inputClassName} />
        </FormInput>
        <FormInput label="Company" htmlFor="contact-company" tone="dark">
          <Input id="contact-company" name="company" className={inputClassName} />
        </FormInput>
        <FormInput label="Email" htmlFor="contact-email" tone="dark">
          <Input id="contact-email" name="email" type="email" required className={inputClassName} />
        </FormInput>
        <FormInput label="Country" htmlFor="contact-country" tone="dark">
          <Input id="contact-country" name="country" className={inputClassName} />
        </FormInput>
        <FormInput label="WhatsApp / WeChat" htmlFor="contact-direct" tone="dark">
          <Input id="contact-direct" name="direct_contact" className={inputClassName} />
        </FormInput>
        <FormInput label="Project Focus" htmlFor="contact-project-focus" tone="dark">
          <Input id="contact-project-focus" name="project_focus" className={inputClassName} placeholder="OEM, retail display, gifting, installation" />
        </FormInput>
      </div>

      <FormInput label="Message" htmlFor="contact-message" tone="dark">
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
          className={`rounded-full border px-4 py-2 text-sm ${
            status === "success"
              ? "border-white/16 bg-white/[0.08] text-white"
              : status === "error"
                ? "border-red-400/24 bg-red-500/10 text-red-200"
                : "border-white/12 bg-transparent text-white/48"
          }`}
          aria-live="polite"
        >
          {status === "idle" ? "We reply to serious project inquiries with clear next steps." : message}
        </div>
      </div>
    </form>
  );
}
