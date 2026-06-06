"use client";

import { useRef, useState } from "react";

import { useSiteStore } from "@/components/providers/site-store-provider";
import { buttonStyles } from "@/components/ui/button";
import { FormInput } from "@/components/ui/FormInput";
import { Input } from "@/components/ui/input";

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
  "min-h-[52px] rounded-[1.5rem] border border-white/20 bg-transparent px-5 text-base text-white shadow-none placeholder:text-white/40 focus:border-white focus:bg-white/[0.03]";

const textareaClassName =
  "min-h-[160px] w-full rounded-[1.5rem] border border-white/20 bg-transparent px-5 py-4 text-base text-white outline-none transition placeholder:text-white/40 focus:border-white focus:bg-white/[0.03]";

function statusCopy(status: "idle" | "submitting" | "success" | "error", message: string) {
  if (status === "idle") {
    return "We review serious quote inquiries within 24-48 hours.";
  }

  return message;
}

function normalizeProjectType(value: string) {
  return projectTypes.find((projectType) => projectType.title === value)?.title ?? projectTypes[0].title;
}

export interface RfqFormPrefills {
  businessType: string;
  companyName: string;
  contactName: string;
  country: string;
  customizationRequirements: string;
  email: string;
  estimatedQuantity: string;
  message: string;
  phone: string;
}

const defaultPrefills: RfqFormPrefills = {
  businessType: "",
  companyName: "",
  contactName: "",
  country: "",
  customizationRequirements: "",
  email: "",
  estimatedQuantity: "",
  message: "",
  phone: "",
};

interface RfqFormProps {
  formKey?: string;
  prefills?: RfqFormPrefills;
}

export function RfqForm({
  formKey = "rfq-form",
  prefills = defaultPrefills,
}: RfqFormProps) {
  const formRef = useRef<HTMLFormElement>(null);
  const { clearQuote, hydrated, quoteItems } = useSiteStore();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [requestNumber, setRequestNumber] = useState("");
  const [selectedProjectType, setSelectedProjectType] = useState(normalizeProjectType(prefills.businessType));

  async function handleSubmit(formData: FormData) {
    if (quoteItems.length === 0) {
      setStatus("error");
      setMessage("No products selected yet. Add products to your quote list before submitting a request.");
      return;
    }

    setStatus("submitting");
    setMessage("");
    setRequestNumber("");

    const payload = {
      company_name: formData.get("company_name"),
      contact_name: formData.get("contact_name"),
      email: formData.get("email"),
      whatsapp: formData.get("whatsapp"),
      country: formData.get("country"),
      business_type: formData.get("business_type"),
      estimated_quantity: formData.get("estimated_quantity"),
      customization_requirements: formData.get("customization_requirements"),
      message: formData.get("message"),
      items: quoteItems,
    };

    try {
      const response = await fetch("/api/rfq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as { message?: string; requestNumber?: string };

      if (!response.ok) {
        throw new Error(result.message ?? "Unable to submit RFQ.");
      }

      setStatus("success");
      setMessage("Your quote request has been submitted. Our team will contact you shortly.");
      setRequestNumber(result.requestNumber ?? "");
      formRef.current?.reset();
      clearQuote();
      setSelectedProjectType(normalizeProjectType(prefills.businessType));
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit RFQ.");
    }
  }

  if (!hydrated) {
    return (
      <div className="space-y-6">
        <div className="space-y-4">
          <div className="h-10 w-56 animate-pulse rounded-full bg-white/8" />
          <div className="h-56 animate-pulse rounded-[2rem] bg-white/8" />
        </div>
        <div className="h-[36rem] animate-pulse rounded-[2rem] bg-white/8" />
      </div>
    );
  }

  const supportItems = [
    { label: "Response Time", value: "Within 24-48 hours" },
    { label: "Project Support", value: "OEM / ODM / Custom Development" },
    { label: "Production Scope", value: "Prototype to mass production" },
    { label: "Global Delivery", value: "Worldwide project support" },
  ];

  const buttonClassName = buttonStyles({
    size: "lg",
    fullWidth: true,
    className: "sm:w-auto",
  });

  const statusClassName =
    status === "success"
      ? "border-white/16 text-white"
      : status === "error"
        ? "border-red-400/24 text-red-200"
        : "border-white/12 text-white/52";

  return (
    <form
      key={formKey}
      ref={formRef}
      onSubmit={async (event) => {
        event.preventDefault();
        await handleSubmit(new FormData(event.currentTarget));
      }}
    >
      <div className="border-b border-white/12 pb-14 md:pb-16">
        <p className="text-xs uppercase tracking-[0.28em] text-white/42">AMO Project Inquiry</p>
        <h1 className="mt-6 text-5xl font-semibold tracking-tight text-white md:text-7xl">
          REQUEST A QUOTE
        </h1>
        <p className="mt-8 max-w-3xl text-base leading-relaxed text-white/66 md:text-lg">
          Tell us what you want to build.
          <br />
          We will respond with pricing, lead time, and development recommendations.
        </p>
      </div>

      <div className="grid gap-14 pt-14 xl:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)] xl:gap-16 xl:pt-16">
        <section className="xl:pr-10">
          <p className="text-xs uppercase tracking-[0.24em] text-white/42">Project Type</p>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">Project Type</h2>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-white/62">
            Choose the option closest to your project. This helps us understand your requirements faster.
          </p>

          <div className="mt-10 border-y border-white/12">
            {projectTypes.map((projectType) => {
              const selected = selectedProjectType === projectType.title;

              return (
                <button
                  key={projectType.title}
                  type="button"
                  onClick={() => setSelectedProjectType(projectType.title)}
                  className="relative flex w-full items-start gap-5 border-b border-white/12 py-6 text-left last:border-b-0"
                >
                  <span
                    className={`mt-2 h-2.5 w-2.5 shrink-0 rounded-full transition ${
                      selected ? "bg-white" : "bg-white/18"
                    }`}
                    aria-hidden="true"
                  />
                  <div className="min-w-0">
                    <h3 className={`text-[1.7rem] font-semibold tracking-tight transition ${selected ? "text-white" : "text-white/74 hover:text-white"}`}>
                      {projectType.title}
                    </h3>
                    <p
                      className={`mt-3 max-w-xl text-sm leading-7 transition md:text-base ${
                        selected ? "text-white/72" : "text-white/46"
                      }`}
                    >
                      {projectType.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="border-t border-white/12 pt-10 xl:border-l xl:border-t-0 xl:pl-12 xl:pt-0">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">Project Details</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">Project Details</h2>
            <p className="mt-4 text-base leading-relaxed text-white/62">
              Share your company, contact details, quantity expectations, and project context so AMO can respond with the right next step.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            <FormInput label="Company" htmlFor="rfq-company" tone="dark">
              <Input id="rfq-company" name="company_name" defaultValue={prefills.companyName} required className={inputClassName} />
            </FormInput>
            <FormInput label="Contact Name" htmlFor="rfq-contact-name" tone="dark">
              <Input id="rfq-contact-name" name="contact_name" defaultValue={prefills.contactName} required className={inputClassName} />
            </FormInput>
            <FormInput label="Email" htmlFor="rfq-email" tone="dark">
              <Input id="rfq-email" name="email" type="email" defaultValue={prefills.email} required className={inputClassName} />
            </FormInput>
            <FormInput label="WhatsApp" htmlFor="rfq-whatsapp" tone="dark">
              <Input id="rfq-whatsapp" name="whatsapp" defaultValue={prefills.phone} className={inputClassName} />
            </FormInput>
            <FormInput label="Country" htmlFor="rfq-country" tone="dark">
              <Input id="rfq-country" name="country" defaultValue={prefills.country} required className={inputClassName} />
            </FormInput>

            <FormInput label="Project Type" htmlFor="rfq-business-type" tone="dark">
              <Input
                id="rfq-business-type"
                name="business_type"
                value={selectedProjectType}
                readOnly
                required
                className={inputClassName}
              />
            </FormInput>

            <FormInput label="Estimated Quantity" htmlFor="rfq-estimated-quantity" tone="dark">
              <Input
                id="rfq-estimated-quantity"
                name="estimated_quantity"
                defaultValue={prefills.estimatedQuantity}
                className={inputClassName}
              />
            </FormInput>

            <input type="hidden" name="customization_requirements" value={prefills.customizationRequirements} />

            <div className="md:col-span-2">
              <FormInput label="Message" htmlFor="rfq-message" tone="dark">
                <textarea
                  id="rfq-message"
                  name="message"
                  rows={6}
                  defaultValue={prefills.message}
                  required
                  className={textareaClassName}
                  placeholder="Describe the idea, usage context, customization scope, and commercial timing."
                />
              </FormInput>
            </div>
          </div>

          <div className="mt-8">
            <button
              type="submit"
              disabled={status === "submitting"}
              className={buttonClassName}
            >
              {status === "submitting" ? "Submitting..." : "Request Quote"}
            </button>

            <div
              className={`mt-5 border-t px-0 pt-5 text-sm leading-7 ${statusClassName}`}
              aria-live="polite"
            >
              {statusCopy(status, message)}
              {requestNumber ? <span className="block pt-3 text-xs uppercase tracking-[0.24em] text-white/56">Reference {requestNumber}</span> : null}
            </div>
          </div>
        </section>
      </div>

      <div className="mt-16 border-t border-white/12 pt-8">
        <div className="grid gap-6 divide-y divide-white/12 sm:grid-cols-2 sm:divide-y-0 xl:grid-cols-4 xl:divide-x xl:divide-white/12">
          {supportItems.map((item) => (
            <div key={item.label} className="pt-6 first:pt-0 sm:pt-0 xl:px-6 xl:first:pl-0 xl:last:pr-0">
              <p className="text-xs uppercase tracking-[0.24em] text-white/42">{item.label}</p>
              <p className="mt-4 max-w-[16rem] text-base leading-relaxed text-white/72">{item.value}</p>
            </div>
          ))}
        </div>
      </div>
    </form>
  );
}
