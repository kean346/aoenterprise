"use client";

import { Check, ChevronDown, Paperclip } from "lucide-react";
import { useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { services } from "./services";

const fileLimit = 10 * 1024 * 1024;
const allowedFile = /\.(pdf|xlsx?|png|jpe?g)$/i;

type FieldName = "company" | "name" | "email" | "phone" | "service" | "area" | "requirements" | "file";
type FieldErrors = Partial<Record<FieldName, string>>;
type Draft = { label: string; value: string }[];

export function QuoteForm() {
  const [errors, setErrors] = useState<FieldErrors>({});
  const [draft, setDraft] = useState<Draft | null>(null);
  const confirmation = useRef<HTMLDivElement>(null);

  function updateField(event: FormEvent<HTMLFormElement>) {
    const field = event.target as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;
    const name = field.name as FieldName;
    setDraft(null);
    setErrors((previous) => {
      if (!previous[name]) return previous;
      const updated = { ...previous };
      delete updated[name];
      return updated;
    });
  }

  function reviewQuote(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    const get = (name: FieldName) => String(data.get(name) ?? "").trim();
    const errors: FieldErrors = {};
    const service = services.find(({ id }) => id === get("service"));
    const email = form.elements.namedItem("email") as HTMLInputElement;
    const file = data.get("file");

    if (!get("company")) errors.company = "Enter your company or organisation name.";
    if (!get("name")) errors.name = "Enter your name.";
    if (!get("email") || !email.validity.valid) errors.email = "Enter a valid work email address.";
    if (!service) errors.service = "Select the service you’re interested in.";
    if (!get("requirements")) errors.requirements = "Tell us what you need to source.";
    if (file instanceof File && file.name) {
      if (!allowedFile.test(file.name)) errors.file = "Choose a PDF, Excel spreadsheet, JPG or PNG.";
      else if (file.size > fileLimit) errors.file = "Choose a file that’s 10 MB or smaller.";
    }
    setErrors(errors);

    const firstError = Object.keys(errors)[0];
    if (firstError || !service) {
      setDraft(null);
      requestAnimationFrame(() => (form.elements.namedItem(firstError) as HTMLElement | null)?.focus());
      return;
    }

    setDraft([
      { label: "Company", value: get("company") },
      { label: "Contact", value: get("name") },
      { label: "Email", value: get("email") },
      { label: "Phone", value: get("phone") },
      { label: "Service", value: service.name },
      { label: "Delivery area", value: get("area") },
      { label: "Requirements", value: get("requirements") },
      { label: "Attachment", value: file instanceof File ? file.name : "" },
    ].filter(({ value }) => value));
    requestAnimationFrame(() => confirmation.current?.focus({ preventScroll: false }));
  }

  const fieldProps = (name: FieldName) => ({
    id: "rfq-" + name,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": [
      name === "file" ? "file-help" : "",
      errors[name] ? "error-" + name : "",
    ].filter(Boolean).join(" ") || undefined,
  });

  function label(name: FieldName, title: string, control: ReactNode, full = false) {
    return (
      <div className={full ? "form-field field-full" : "form-field"}>
        <label htmlFor={"rfq-" + name}>{title}{name === "phone" || name === "area" || name === "file" ? <span>Optional</span> : null}</label>
        {control}
        {errors[name] && <p className="field-error" id={"error-" + name}>{errors[name]}</p>}
      </div>
    );
  }

  return (
    <form className="quote-form" method="dialog" aria-describedby="demo-note" onSubmit={reviewQuote} onChange={updateField} noValidate>
      <h3>Request a Quote</h3>
      <p className="form-note" id="demo-note">Preview only. Your details and attachments stay in this browser session.</p>
      <div className="form-fields">
        {label("company", "Company name", <input {...fieldProps("company")} autoComplete="organization" required maxLength={160} />)}
        {label("name", "Contact name", <input {...fieldProps("name")} autoComplete="name" required maxLength={120} />)}
        {label("email", "Work email", <input {...fieldProps("email")} type="email" autoComplete="email" required maxLength={254} />)}
        {label("phone", "Phone", <input {...fieldProps("phone")} type="tel" autoComplete="tel" maxLength={36} />)}
        {label("service", "Service", <div className="select-wrap">
          <select {...fieldProps("service")} defaultValue="" required>
            <option value="" disabled>Select a service</option>
            {services.map((service) => <option key={service.id} value={service.id}>{service.name}</option>)}
          </select>
          <ChevronDown size={17} aria-hidden="true" />
        </div>)}
        {label("area", "Delivery area", <input {...fieldProps("area")} autoComplete="address-level2" maxLength={120} />)}
        {label("requirements", "What do you need?", <textarea {...fieldProps("requirements")} placeholder="Include quantities, specifications or dates where available." rows={4} required maxLength={3000} />, true)}
        {label("file", "Supporting file", <div className="upload-wrap">
          <Paperclip size={18} aria-hidden="true" />
          <input {...fieldProps("file")} type="file" accept=".pdf,.xlsx,.xls,.jpeg,.jpg,.png" />
          <p id="file-help">PDF, Excel, JPG or PNG · up to 10 MB</p>
        </div>, true)}
      </div>
      <button className="button button-light" type="submit">Review quote request</button>
      {draft && (
        <div ref={confirmation} className="quote-confirmation" tabIndex={-1} role="status">
          <Check size={18} aria-hidden="true" />
          <div>
            <strong>Your request is ready to review.</strong>
            <dl>
              {draft.map(({ label, value }) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}
            </dl>
            <p>This demo has no submission endpoint.</p>
          </div>
        </div>
      )}
    </form>
  );
}
