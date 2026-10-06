import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { useAdmin, DEFAULT_PAGE_CONTENT } from "@/contexts/AdminContext";
import { useSEO } from "@/hooks/use-seo";
import { apiFetch } from "@/lib/api";

const SUPPORT_EMAIL_FALLBACK = "hello@danywens.com";

const Contact = () => {
  const { siteSettings } = useAdmin();
  const contact = siteSettings.pageContent?.contact ?? DEFAULT_PAGE_CONTENT.contact;
  const supportEmail = contact.email || SUPPORT_EMAIL_FALLBACK;

  useSEO({
    title: "Contact Us",
    description: "Get in touch with DANYWENS — order support, returns, press, and wholesale inquiries.",
    path: "/contact",
  });
  const [submitted, setSubmitted] = useState(false);
  const [fellBack, setFellBack] = useState(false);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "General Inquiry",
    message: "",
  });

  const setField = (field: keyof typeof form, value: string) =>
    setForm((p) => ({ ...p, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    setSending(true);
    try {
      // Preferred path: server sends the email straight to the support inbox.
      await apiFetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          name: fullName,
          email: form.email,
          subject: form.subject,
          message: form.message,
        }),
      });
      setFellBack(false);
    } catch {
      // Server-send unavailable — open the customer's mail app instead.
      const subject = `[Danywens] ${form.subject} — ${fullName}`;
      const body = `Name: ${fullName}\nEmail: ${form.email}\nSubject: ${form.subject}\n\n${form.message}`;
      window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setFellBack(true);
    } finally {
      setSending(false);
      setSubmitted(true);
    }
  };

  return (
    <Layout>
      <div className="pt-24 md:pt-28 px-4 md:px-8 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-heading tracking-tight mb-2">Contact Us</h1>
          <p className="text-sm text-muted-foreground mb-12">{contact.subtitle}</p>
          {(contact.email || contact.phone || contact.address) && (
            <div className="mb-10 space-y-1 text-sm text-muted-foreground border border-border rounded-xl p-5">
              {contact.email && <p><span className="font-semibold text-foreground">Email:</span> {contact.email}</p>}
              {contact.phone && <p><span className="font-semibold text-foreground">Phone:</span> {contact.phone}</p>}
              {contact.address && <p><span className="font-semibold text-foreground">Address:</span> {contact.address}</p>}
            </div>
          )}

          {submitted ? (
            <div className="py-16 text-center">
              {fellBack ? (
                <>
                  <h2 className="text-xl font-heading tracking-tight mb-2">Almost There</h2>
                  <p className="text-sm text-muted-foreground">
                    Your email app should have opened with your message ready to send to{" "}
                    <span className="text-foreground font-medium">{supportEmail}</span>. Just hit send.
                  </p>
                  <p className="text-xs text-muted-foreground mt-3">
                    Didn't open? Email us directly at{" "}
                    <a href={`mailto:${supportEmail}`} className="underline text-foreground">{supportEmail}</a>.
                  </p>
                </>
              ) : (
                <>
                  <h2 className="text-xl font-heading tracking-tight mb-2">Message Sent</h2>
                  <p className="text-sm text-muted-foreground">Thanks for reaching out — we'll get back to you shortly.</p>
                </>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">First Name</label>
                  <input required value={form.firstName} onChange={(e) => setField("firstName", e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
                <div>
                  <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">Last Name</label>
                  <input required value={form.lastName} onChange={(e) => setField("lastName", e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">Email</label>
                <input type="email" required value={form.email} onChange={(e) => setField("email", e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">Subject</label>
                <select value={form.subject} onChange={(e) => setField("subject", e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors">
                  <option>General Inquiry</option>
                  <option>Order Support</option>
                  <option>Returns & Exchanges</option>
                  <option>Press</option>
                  <option>Wholesale</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold tracking-[0.1em] uppercase mb-2">Message</label>
                <textarea required rows={6} value={form.message} onChange={(e) => setField("message", e.target.value)} className="w-full border border-border bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-foreground transition-colors resize-none" />
              </div>
              <button
                type="submit"
                disabled={sending}
                className="w-full bg-foreground text-background py-4 text-xs font-semibold tracking-[0.2em] uppercase hover:bg-foreground/90 transition-colors disabled:opacity-50"
              >
                {sending ? "Sending…" : "Send Message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
