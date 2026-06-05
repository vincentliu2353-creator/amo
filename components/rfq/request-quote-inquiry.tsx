"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { buttonStyles } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/ui/PageHeader";

const projectTypes = [
  {
    title: "OEM Development",
    description: "Custom magnetic levitation products for your brand.",
  },
  {
    title: "ODM Development",
    description: "Ready-to-develop product concepts with customization support.",
  },
  {
    title: "Retail Display",
    description: "Floating displays for premium retail environments.",
  },
  {
    title: "Corporate Gifts",
    description: "Memorable magnetic levitation gifts for business clients.",
  },
  {
    title: "Museum Installation",
    description: "Floating objects for cultural and exhibition spaces.",
  },
  {
    title: "Custom Product",
    description: "Unique levitation solutions based on your idea.",
  },
];

const inputClassName =
  "min-h-14 rounded-[1.5rem] border border-black/12 bg-white px-5 text-base text-black shadow-none placeholder:text-black/34 focus:border-black/24 focus:bg-white";

const textareaClassName =
  "min-h-[180px] w-full rounded-[1.5rem] border border-black/12 bg-white px-5 py-4 text-base text-black outline-none transition placeholder:text-black/34 focus:border-black/24";

export function RequestQuoteInquiry() {
  const router = useRouter();
  const [selectedProjectType, setSelectedProjectType] = useState(projectTypes[0].title);
  const [status, setStatus] = useState<"idle" | "loading">("idle");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    const params = new URLSearchParams({
      project: String(formData.get("project_type") ?? selectedProjectType),
      company: String(formData.get("company") ?? ""),
      contact: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("whatsapp") ?? ""),
      country: String(formData.get("country") ?? ""),
      volume: String(formData.get("estimated_quantity") ?? ""),
      message: String(formData.get("message") ?? ""),
    });

    router.push(`/rfq?${params.toString()}`);
  }

  return (
    <div className="space-y-14">
      <PageHeader
        eyebrow="Request A Quote"
        title="Request A Quote"
        description="Tell us about your project. We&apos;ll respond with pricing, lead time, and development recommendations."
      />

      <div className="grid gap-10 xl:grid-cols-[1fr_28rem]">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-black/42">Project Types</p>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {projectTypes.map((projectType) => {
              const selected = selectedProjectType === projectType.title;

              return (
                <button
                  key={projectType.title}
                  type="button"
                  onClick={() => setSelectedProjectType(projectType.title)}
                  className={`rounded-[1.75rem] border p-6 text-left transition ${
                    selected ? "border-black bg-black text-white" : "border-black/10 bg-[#f5f5f2] text-black hover:border-black/18"
                  }`}
                >
                  <h2 className="text-2xl font-semibold tracking-tight">{projectType.title}</h2>
                  <p className={`mt-4 text-base leading-relaxed ${selected ? "text-white/74" : "text-black/62"}`}>
                    {projectType.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="rounded-[2rem] border border-black/10 bg-[#f5f5f2] p-6 md:p-8">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-black/42">Inquiry Form</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight">Submit Inquiry</h2>
            <p className="mt-4 text-base leading-relaxed text-black/62">
              Your details will carry into the RFQ page so you can review products and submit the final request without retyping.
            </p>
          </div>

          <div className="mt-8 space-y-5">
            <FormInput label="Company" htmlFor="request-quote-company">
              <Input id="request-quote-company" name="company" required className={inputClassName} />
            </FormInput>

            <FormInput label="Name" htmlFor="request-quote-name">
              <Input id="request-quote-name" name="name" required className={inputClassName} />
            </FormInput>

            <FormInput label="Email" htmlFor="request-quote-email">
              <Input id="request-quote-email" name="email" type="email" required className={inputClassName} />
            </FormInput>

            <FormInput label="WhatsApp" htmlFor="request-quote-whatsapp">
              <Input id="request-quote-whatsapp" name="whatsapp" className={inputClassName} />
            </FormInput>

            <FormInput label="Country" htmlFor="request-quote-country">
              <Input id="request-quote-country" name="country" className={inputClassName} />
            </FormInput>

            <FormInput label="Project Type" htmlFor="request-quote-project-type">
              <select
                id="request-quote-project-type"
                name="project_type"
                value={selectedProjectType}
                onChange={(event) => setSelectedProjectType(event.target.value)}
                className={`${inputClassName} w-full`}
              >
                {projectTypes.map((projectType) => (
                  <option key={projectType.title} value={projectType.title}>
                    {projectType.title}
                  </option>
                ))}
              </select>
            </FormInput>

            <FormInput label="Estimated Quantity" htmlFor="request-quote-estimated-quantity">
              <Input id="request-quote-estimated-quantity" name="estimated_quantity" className={inputClassName} />
            </FormInput>

            <FormInput label="Message" htmlFor="request-quote-message">
              <textarea
                id="request-quote-message"
                name="message"
                className={textareaClassName}
                placeholder="Describe the idea, usage context, customization scope, and commercial timing."
              />
            </FormInput>

            <button type="submit" className={buttonStyles({ size: "lg" })} disabled={status === "loading"}>
              {status === "loading" ? "Opening RFQ..." : "Submit Inquiry"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
