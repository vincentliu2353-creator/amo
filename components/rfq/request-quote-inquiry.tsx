"use client";

import { useState } from "react";

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

interface QuoteFormValues {
  company: string;
  contactName: string;
  email: string;
  whatsapp: string;
  country: string;
  projectType: string;
  estimatedQuantity: string;
  message: string;
}

type QuoteFormErrors = Partial<Record<keyof QuoteFormValues, string>>;

const defaultProjectType = projectTypes[0].title;

const initialValues: QuoteFormValues = {
  company: "",
  contactName: "",
  email: "",
  whatsapp: "",
  country: "",
  projectType: defaultProjectType,
  estimatedQuantity: "",
  message: "",
};

export function RequestQuoteInquiry() {
  const [selectedProjectType, setSelectedProjectType] = useState(defaultProjectType);
  const [values, setValues] = useState<QuoteFormValues>(initialValues);
  const [errors, setErrors] = useState<QuoteFormErrors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("We review serious quote inquiries within 24-48 hours.");

  function updateField<K extends keyof QuoteFormValues>(field: K, value: QuoteFormValues[K]) {
    setValues((current) => ({
      ...current,
      [field]: value,
    }));

    setErrors((current) => {
      if (!current[field]) {
        return current;
      }

      const nextErrors = { ...current };
      delete nextErrors[field];
      return nextErrors;
    });
  }

  function selectProjectType(projectType: string) {
    setSelectedProjectType(projectType);
    updateField("projectType", projectType);
  }

  function validateForm() {
    const nextErrors: QuoteFormErrors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.company.trim()) {
      nextErrors.company = "Company is required.";
    }

    if (!values.contactName.trim()) {
      nextErrors.contactName = "Contact name is required.";
    }

    if (!values.email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!emailPattern.test(values.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!values.country.trim()) {
      nextErrors.country = "Country is required.";
    }

    if (!values.projectType.trim()) {
      nextErrors.projectType = "Project type is required.";
    }

    if (!values.message.trim()) {
      nextErrors.message = "Message is required.";
    }

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateForm();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      setStatus("error");
      setMessage("Please correct the highlighted fields and try again.");
      return;
    }

    setStatus("loading");
    setMessage("Submitting...");

    try {
      await new Promise((resolve) => window.setTimeout(resolve, 900));

      setStatus("success");
      setMessage("Your quote request has been submitted. Our team will contact you shortly.");
      setErrors({});
      setValues((current) => ({
        ...initialValues,
        projectType: current.projectType,
      }));
    } catch {
      setStatus("error");
      setMessage("Something went wrong. Please try again.");
    }
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

  const statusText =
    status === "idle"
      ? "We review serious quote inquiries within 24-48 hours."
      : message;

  function renderTextField(
    field: keyof QuoteFormValues,
    label: string,
    id: string,
    options: { type?: "email" | "text"; placeholder?: string; required?: boolean } = {},
  ) {
    return (
      <FormInput label={label} htmlFor={id} tone="dark" error={errors[field]}>
        <Input
          id={id}
          name={field}
          type={options.type ?? "text"}
          value={values[field]}
          onChange={(event) => updateField(field, event.target.value)}
          required={options.required}
          placeholder={options.placeholder}
          className={inputClassName}
        />
      </FormInput>
    );
  }

  return (
    <div>
      <div className="border-b border-white/12 pb-14 md:pb-16">
        <p className="text-xs uppercase tracking-[0.28em] text-white/42">AMO Project Inquiry</p>
        <h1 className="mt-6 whitespace-pre-line text-5xl font-semibold tracking-tight text-white md:text-7xl">
          {"REQUEST\nA QUOTE"}
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
                  onClick={() => selectProjectType(projectType.title)}
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

        <form onSubmit={handleSubmit} noValidate className="border-t border-white/12 pt-10 xl:border-l xl:border-t-0 xl:pl-12 xl:pt-0">
          <div>
            <p className="text-xs uppercase tracking-[0.24em] text-white/42">Project Details</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white md:text-4xl">Project Details</h2>
            <p className="mt-4 text-base leading-relaxed text-white/62">
              Share your company, contact details, quantity expectations, and project context so AMO can respond with the right next step.
            </p>
          </div>

          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {renderTextField("company", "Company", "request-quote-company", { required: true })}
            {renderTextField("contactName", "Contact Name", "request-quote-contact-name", { required: true })}
            {renderTextField("email", "Email", "request-quote-email", { type: "email", required: true })}
            {renderTextField("whatsapp", "WhatsApp", "request-quote-whatsapp")}
            {renderTextField("country", "Country", "request-quote-country", { required: true })}

            <FormInput label="Project Type" htmlFor="request-quote-project-type" tone="dark" error={errors.projectType}>
              <Input
                id="request-quote-project-type"
                name="projectType"
                value={values.projectType}
                readOnly
                required
                className={inputClassName}
              />
            </FormInput>

            {renderTextField("estimatedQuantity", "Estimated Quantity", "request-quote-estimated-quantity")}

            <div className="md:col-span-2">
              <FormInput label="Message" htmlFor="request-quote-message" tone="dark" error={errors.message}>
              <textarea
                id="request-quote-message"
                name="message"
                value={values.message}
                onChange={(event) => updateField("message", event.target.value)}
                className={textareaClassName}
                placeholder="Describe the idea, usage context, customization scope, and commercial timing."
                required
              />
            </FormInput>
            </div>
          </div>

          <div className="mt-8">
            <button type="submit" className={buttonClassName} disabled={status === "loading"}>
              {status === "loading" ? "Submitting..." : "Request Quote"}
            </button>

            <div
              className={`mt-5 border-t px-0 pt-5 text-sm leading-7 ${statusClassName}`}
              aria-live="polite"
            >
              {statusText}
            </div>
          </div>
        </form>
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
    </div>
  );
}
