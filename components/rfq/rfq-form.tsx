"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import { useSiteStore } from "@/components/providers/site-store-provider";
import { buttonStyles } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/EmptyState";
import { FormInput } from "@/components/ui/FormInput";
import { Input } from "@/components/ui/input";

const inputClassName =
  "min-h-14 rounded-[1.5rem] border border-black/12 bg-white px-5 text-base text-black shadow-none placeholder:text-black/34 focus:border-black/24 focus:bg-white";

const textareaClassName =
  "min-h-[140px] w-full rounded-[1.5rem] border border-black/12 bg-white px-5 py-4 text-base text-black outline-none transition placeholder:text-black/34 focus:border-black/24";

function statusCopy(status: "idle" | "submitting" | "success" | "error", message: string) {
  if (status === "idle") {
    return "Selected products stay in local storage until the RFQ is submitted.";
  }

  return message;
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
  const { clearQuote, hydrated, quoteItems, removeFromQuote, updateQuoteItem } = useSiteStore();
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [requestNumber, setRequestNumber] = useState("");

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
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit RFQ.");
    }
  }

  if (!hydrated) {
    return (
      <div className="grid gap-6 xl:grid-cols-[1fr_24rem]">
        <div className="space-y-4">
          <div className="h-10 w-56 animate-pulse rounded-full bg-black/6" />
          <div className="h-56 animate-pulse rounded-[2rem] bg-black/6" />
        </div>
        <div className="h-[36rem] animate-pulse rounded-[2rem] bg-black/6" />
      </div>
    );
  }

  return (
    <form
      key={formKey}
      ref={formRef}
      onSubmit={async (event) => {
        event.preventDefault();
        await handleSubmit(new FormData(event.currentTarget));
      }}
      className="grid gap-10 xl:grid-cols-[1fr_24rem]"
    >
      <div className="space-y-10">
        <section>
          <div className="flex flex-col gap-4 border-b border-black/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.24em] text-black/42">Section 01</p>
              <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Selected Products</h2>
              <p className="mt-4 max-w-3xl text-base leading-relaxed text-black/62">
                Review selected products and send your project details.
              </p>
            </div>
            <div className="rounded-full border border-black/10 px-4 py-2 text-sm text-black/48">
              {quoteItems.length} product{quoteItems.length === 1 ? "" : "s"}
            </div>
          </div>

          <div className="mt-8 space-y-4">
            {quoteItems.length === 0 ? (
              <EmptyState
                title="No products selected yet."
                description="Add products to your quote list before submitting a request."
                action={
                  <Link href="/products" className={buttonStyles({ variant: "secondary", size: "sm" })}>
                    View Products
                  </Link>
                }
              />
            ) : (
              quoteItems.map((item) => (
                <article
                  key={item.product_slug}
                  className="grid gap-5 rounded-[2rem] border border-black/10 bg-[#f5f5f2] p-5 md:grid-cols-[160px_1fr]"
                >
                  <div className="overflow-hidden rounded-[1.5rem] border border-black/10 bg-white">
                    {item.product_image ? (
                      <img src={item.product_image} alt={item.product_name} className="h-40 w-full object-cover" />
                    ) : (
                      <div className="flex h-40 items-end bg-[#ecebe6] p-4">
                        <span className="rounded-full border border-black/10 bg-white/80 px-3 py-2 text-[11px] uppercase tracking-[0.24em] text-black/48">
                          AMO Product
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="text-xs uppercase tracking-[0.24em] text-black/40">{item.product_slug}</p>
                        <h3 className="mt-3 text-2xl font-semibold tracking-tight">{item.product_name}</h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromQuote(item.product_slug)}
                        className="rounded-full border border-black/10 px-4 py-2 text-xs uppercase tracking-[0.24em] text-black/54 transition hover:border-black/18 hover:text-black"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="grid gap-5 md:grid-cols-[10rem_1fr]">
                      <FormInput label="Quantity" htmlFor={`rfq-qty-${item.product_slug}`}>
                        <Input
                          id={`rfq-qty-${item.product_slug}`}
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(event) =>
                            updateQuoteItem(item.product_slug, {
                              quantity: Number(event.target.value) > 0 ? Number(event.target.value) : 1,
                            })
                          }
                          className={inputClassName}
                        />
                      </FormInput>

                      <FormInput label="Notes" htmlFor={`rfq-notes-${item.product_slug}`}>
                        <textarea
                          id={`rfq-notes-${item.product_slug}`}
                          rows={3}
                          value={item.notes}
                          onChange={(event) => updateQuoteItem(item.product_slug, { notes: event.target.value })}
                          className={textareaClassName}
                          placeholder="Share payload, environment, motion range, or integration notes."
                        />
                      </FormInput>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section>
          <div className="border-b border-black/10 pb-6">
            <p className="text-xs uppercase tracking-[0.24em] text-black/42">Section 02</p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight md:text-5xl">Inquiry Form</h2>
          </div>

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <FormInput label="Company" htmlFor="rfq-company">
              <Input id="rfq-company" name="company_name" defaultValue={prefills.companyName} required className={inputClassName} />
            </FormInput>
            <FormInput label="Contact Name" htmlFor="rfq-contact-name">
              <Input id="rfq-contact-name" name="contact_name" defaultValue={prefills.contactName} required className={inputClassName} />
            </FormInput>
            <FormInput label="Email" htmlFor="rfq-email">
              <Input id="rfq-email" name="email" type="email" defaultValue={prefills.email} required className={inputClassName} />
            </FormInput>
            <FormInput label="WhatsApp" htmlFor="rfq-whatsapp">
              <Input id="rfq-whatsapp" name="whatsapp" defaultValue={prefills.phone} className={inputClassName} />
            </FormInput>
            <FormInput label="Country" htmlFor="rfq-country">
              <Input id="rfq-country" name="country" defaultValue={prefills.country} className={inputClassName} />
            </FormInput>
            <FormInput label="Business Type" htmlFor="rfq-business-type">
              <select id="rfq-business-type" name="business_type" defaultValue={prefills.businessType} className={`${inputClassName} w-full`}>
                <option value="" disabled>
                  Select business type
                </option>
                <option value="OEM Development">OEM Development</option>
                <option value="ODM Development">ODM Development</option>
                <option value="Retail Display">Retail Display</option>
                <option value="Corporate Gifts">Corporate Gifts</option>
                <option value="Museum Installation">Museum Installation</option>
                <option value="Custom Product">Custom Product</option>
                <option value="Machine Builder">Machine Builder</option>
                <option value="System Integrator">System Integrator</option>
                <option value="Distributor">Distributor</option>
              </select>
            </FormInput>
            <FormInput label="Estimated Quantity" htmlFor="rfq-estimated-quantity">
              <Input
                id="rfq-estimated-quantity"
                name="estimated_quantity"
                defaultValue={prefills.estimatedQuantity}
                className={inputClassName}
              />
            </FormInput>
            <FormInput label="Customization Requirements" htmlFor="rfq-customization">
              <Input
                id="rfq-customization"
                name="customization_requirements"
                defaultValue={prefills.customizationRequirements}
                className={inputClassName}
              />
            </FormInput>
            <div className="md:col-span-2">
              <FormInput label="Message" htmlFor="rfq-message">
                <textarea
                  id="rfq-message"
                  name="message"
                  rows={6}
                  defaultValue={prefills.message}
                  className={textareaClassName}
                  placeholder="Add project goals, timing, technical constraints, and commercial notes."
                />
              </FormInput>
            </div>
          </div>
        </section>
      </div>

      <aside className="space-y-4">
        <div
          className={`rounded-[2rem] border p-6 ${
            status === "success"
              ? "border-black bg-black text-white"
              : status === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-black/10 bg-[#f5f5f2] text-black"
          }`}
          aria-live="polite"
        >
          <p className={`text-xs uppercase tracking-[0.24em] ${status === "success" ? "text-white/48" : "text-current/50"}`}>Status</p>
          <p className="mt-4 text-base leading-relaxed">{statusCopy(status, message)}</p>
          {requestNumber ? <p className="mt-4 text-xs uppercase tracking-[0.24em]">Reference {requestNumber}</p> : null}
        </div>

        <div className="rounded-[2rem] border border-black/10 bg-[#f5f5f2] p-6">
          <p className="text-xs uppercase tracking-[0.24em] text-black/42">Submit</p>
          <p className="mt-4 text-base leading-relaxed text-black/62">
            Preserve your selected products, then send the RFQ when the shortlist and project details are ready.
          </p>
          <button
            type="submit"
            disabled={status === "submitting" || quoteItems.length === 0}
            className={`mt-6 ${buttonStyles({ size: "lg", fullWidth: true })}`}
          >
            {status === "submitting" ? "Submitting..." : "Request Quote"}
          </button>
        </div>
      </aside>
    </form>
  );
}
