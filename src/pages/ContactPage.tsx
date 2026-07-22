import { CheckCircle, Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { useSiteContent } from "../cms/SiteContentProvider";
import { Breadcrumbs } from "../components/Breadcrumbs";
import { CustomSelect, type SelectOption } from "../components/CustomSelect";
import { SectionHeading } from "../components/SectionHeading";
import { usePageTitle } from "../hooks/usePageTitle";
import { useReveal } from "../hooks/useReveal";
import { ui } from "../lib/ui";

type EnquiryFormState = { name: string; phone: string; email: string; category: string; message: string };
const initialFormState: EnquiryFormState = { name: "", phone: "", email: "", category: "", message: "" };

export function ContactPage() {
  const { content } = useSiteContent();
  const { brand, stores, categories, copy } = content;

  const [form, setForm] = useState<EnquiryFormState>(initialFormState);
  const [sent, setSent] = useState(false);

  usePageTitle(`Contact | ${brand.name}`);
  useReveal();

  const categoryOptions = useMemo<SelectOption[]>(
    () => [{ id: "", label: "General enquiry" }, ...categories.map((c) => ({ id: c.title, label: c.title }))],
    [categories],
  );

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const msg = [
      `Hello, I want to enquire about ${form.category || "your products"}.`,
      "", `Name: ${form.name}`, `Phone: ${form.phone || "-"}`,
      `Email: ${form.email || "-"}`, `Category: ${form.category || "General enquiry"}`,
      `Requirement: ${form.message}`,
    ].join("\n");
    window.open(`https://wa.me/${brand.phoneRaw}?text=${encodeURIComponent(msg)}`, "_blank", "noopener,noreferrer");
    setSent(true);
  };

  return (
    <div className={ui.pageTop}>
      <section className={ui.sectionGapIntro}>
        <div className={ui.containerWide}>
          <Breadcrumbs current="Contact" />
          <div className="mt-8">
            <SectionHeading
              eyebrow={copy.contact.heroEyebrow}
              title={copy.contact.heroTitle}
              description={copy.contact.heroDescription}
            />
          </div>
        </div>
      </section>

      <section className={ui.sectionGapNoTopWideBottom}>
        <div className={`${ui.containerWide} grid items-start gap-10 max-[780px]:gap-[1.65rem] xl:grid-cols-[0.86fr_1.14fr]`}>
          <div className="flex flex-col gap-[1.35rem]">
            <div className={`${ui.surfaceCard} p-[1.4rem]`} data-reveal>
              <p className="inline-flex items-center gap-3 text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--accent)] before:h-px before:w-[1.85rem] before:bg-current before:content-['']">
                {copy.contact.quickContactEyebrow}
              </p>
              <div className="mt-5 flex flex-col gap-[1rem]">
                <a href={brand.phoneHref} className="flex items-start gap-[0.8rem]">
                  <Phone size={18} />
                  <div className="flex flex-col gap-[0.15rem]">
                    <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[color:var(--text-faint)]">Phone</span>
                    <strong>{brand.phone}</strong>
                  </div>
                </a>
                <a href={brand.emailHref} className="flex items-start gap-[0.8rem]">
                  <Mail size={18} />
                  <div className="flex flex-col gap-[0.15rem]">
                    <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[color:var(--text-faint)]">Email</span>
                    <strong className="break-all">{brand.email}</strong>
                  </div>
                </a>
                <div className="flex items-start gap-[0.8rem]">
                  <Clock size={18} />
                  <div className="flex flex-col gap-[0.3rem]">
                    <span className="text-[0.72rem] font-extrabold uppercase tracking-[0.14em] text-[color:var(--text-faint)]">Business hours</span>
                    <strong>{copy.contact.businessHoursWeekday}</strong>
                    {copy.contact.businessHoursSunday && copy.contact.businessHoursSunday !== copy.contact.businessHoursWeekday && (
                      <strong>{copy.contact.businessHoursSunday}</strong>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <a href={brand.whatsappHref} target="_blank" rel="noreferrer"
              className={`${ui.surfaceCard} flex items-start gap-[0.8rem] bg-[linear-gradient(145deg,rgba(255,245,238,0.94),rgba(246,234,223,0.86))] p-[1.4rem]`} data-reveal>
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[color:var(--accent)] text-white max-[780px]:h-[2.8rem] max-[780px]:w-[2.8rem]">
                <MessageCircle size={22} />
              </div>
              <div className="flex flex-col gap-[0.15rem]">
                <strong>{copy.contact.whatsappTitle}</strong>
                <p className="m-0 mt-[0.35rem] text-[color:var(--text-soft)] leading-[1.7]">{copy.contact.whatsappDescription}</p>
              </div>
            </a>

            <div className="grid gap-[1.35rem]">
              {stores.map((store, index) => (
                <article key={store.name}
                  className="flex flex-col gap-[0.72rem] overflow-hidden rounded-[1.6rem] border border-[color:var(--border)] bg-white/80 p-[1.55rem] px-[1.65rem] shadow-[0_24px_70px_rgba(39,24,12,0.08)] transition-[transform,box-shadow,border-color,background-color] duration-500 [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.014] max-[780px]:rounded-[1.5rem] max-[780px]:p-4 max-[560px]:rounded-[1.25rem] max-[560px]:p-[0.88rem]"
                  data-reveal style={{ transitionDelay: `${index * 80}ms` }}>
                  <span className={ui.chip}>{store.type}</span>
                  <h2 className="m-0 mt-[0.15rem] font-display text-[clamp(1.5rem,2vw,1.9rem)] leading-[1.04]">{store.name}</h2>
                  <p className="mt-[0.2rem] grid gap-[0.5rem] text-[color:var(--text-soft)] leading-[1.78]">
                    <span>{store.address}</span>
                    <span>{store.city}</span>
                  </p>
                  <a href={store.mapsUrl} target="_blank" rel="noreferrer" className="mt-auto inline-flex items-start gap-[0.55rem] text-[0.92rem] font-bold text-[color:var(--accent)]">
                    <MapPin size={15} /> Open in Maps
                  </a>
                </article>
              ))}
            </div>
          </div>

          <div className={`${ui.surfaceCard} self-start p-[1.5rem]`} data-reveal="right">
            <div className="max-w-[36rem]">
              <p className="inline-flex items-center gap-3 text-[0.72rem] font-extrabold uppercase tracking-[0.2em] text-[color:var(--accent)] before:h-px before:w-[1.85rem] before:bg-current before:content-['']">
                {copy.contact.enquiryEyebrow}
              </p>
              <h2 className="mt-4 font-display text-3xl md:text-4xl">{copy.contact.enquiryTitle}</h2>
              <p className="mt-3 text-[color:var(--text-soft)]">{copy.contact.enquiryDescription}</p>
            </div>

            {sent ? (
              <div className={`${ui.surfaceCard} mt-8 border text-center`}>
                <CheckCircle size={34} className="mx-auto text-[color:var(--sage)]" />
                <h2 className="mt-4 font-display text-[clamp(2rem,4vw,3.4rem)]">{copy.contact.enquirySentTitle}</h2>
                <p className="mx-auto mt-3 max-w-[38rem] leading-[1.8] text-[color:var(--text-soft)]">
                  {copy.contact.enquirySentDescription}{" "}
                  <a href={brand.whatsappHref} className="font-semibold text-[color:var(--accent)]">{brand.phone}</a>.
                </p>
              </div>
            ) : (
              <form className="mt-7 space-y-5" onSubmit={handleSubmit}>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">Full name *</span>
                    <input className={ui.field} value={form.name} onChange={(e) => setForm((c) => ({ ...c, name: e.target.value }))} placeholder="Your name" required />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">Phone</span>
                    <input className={ui.field} value={form.phone} onChange={(e) => setForm((c) => ({ ...c, phone: e.target.value }))} placeholder="+91 XXXXX XXXXX" />
                  </label>
                </div>
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-semibold">Email</span>
                    <input className={ui.field} type="email" value={form.email} onChange={(e) => setForm((c) => ({ ...c, email: e.target.value }))} placeholder="name@example.com" />
                  </label>
                  <div>
                    <CustomSelect label="Category" options={categoryOptions} value={form.category} onChange={(v) => setForm((c) => ({ ...c, category: v }))} />
                  </div>
                </div>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold">Message *</span>
                  <textarea className={ui.fieldArea} value={form.message} onChange={(e) => setForm((c) => ({ ...c, message: e.target.value }))} placeholder="Tell us the range, quantity, finish, delivery location, or any workshop requirement." required />
                </label>
                <button type="submit" className={`${ui.buttonBase} ${ui.buttonPrimary} w-full`}>
                  <Send size={16} /> {copy.contact.enquirySubmitLabel}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
