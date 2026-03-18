"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import ParticipantSelector from "./ParticipantSelector";
import { Participant } from "../../types/contacts";

// Stage definitions
const BUYER_STAGES = [
  { value: "prospecting", label: "Prospecting" },
  { value: "showing", label: "Showing" },
  { value: "offer_made", label: "Offer Made" },
  { value: "under_contract", label: "Under Contract" },
  { value: "closed", label: "Closed" },
];

const SELLER_STAGES = [
  { value: "prospecting", label: "Prospecting" },
  { value: "appointment_set", label: "Appointment Set" },
  { value: "appointment_held", label: "Appointment Held" },
  { value: "agreement_signed", label: "Agreement Signed" },
  { value: "listed", label: "Listed" },
  { value: "under_contract", label: "Under Contract" },
  { value: "closed", label: "Closed" },
];

export default function OpportunityForm({ mode, initialData }: any) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState<{
    title: string;
    deal_type: "buyer" | "seller";
    stage: string;
    property_address: string;
    mls_id: string;
    price: string;
    estimated_close_date: string;
    notes: string;
    participants: Participant[];
  }>(() => ({
    title: initialData?.title || "",
    deal_type: initialData?.deal_type || "buyer",
    stage: initialData?.stage || "prospecting",
    property_address: initialData?.property_address || "",
    mls_id: initialData?.mls_id || "",
    price: initialData?.price || "",
    estimated_close_date: initialData?.estimated_close_date || "",
    notes: initialData?.notes || "",
    participants: initialData?.participants || [],
  }));

  function handleChange(e: any) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleDealTypeChange(e: any) {
    const type = e.target.value;
    const defaultStage =
      type === "seller" ? SELLER_STAGES[0].value : BUYER_STAGES[0].value;

    setForm((prev) => ({
      ...prev,
      deal_type: type,
      stage: defaultStage,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    const cleanedParticipants = form.participants.map((p) => {
      // p is either { contact: ContactObj } or { contact: id }
      const id =
        typeof p.contact === "object" && p.contact !== null
          ? p.contact.id
          : p.contact;

      return { contact: id };
    });

    const payload = {
      ...form,
      participants: cleanedParticipants,
    };

    console.log("PAYLOAD WE SEND:", payload); // <-- MUST SEE object array

    const url =
      mode === "create"
        ? "/api/opportunities"
        : `/api/opportunities/${initialData.id}`;

    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      router.refresh();
      router.push("/opportunities");
    } else {
      const data = await res.json().catch(() => null);
      setError(data?.detail || JSON.stringify(data) || "Failed to save opportunity.");
    }
    setSubmitting(false);
  }

  const stages = form.deal_type === "seller" ? SELLER_STAGES : BUYER_STAGES;

  return (
    <form
      onSubmit={handleSubmit}
      className="
        max-w-2xl mx-auto
        bg-neutral-50 dark:bg-neutral-900
        border border-neutral-200 dark:border-neutral-800
        rounded-xl p-8 space-y-8 shadow
      "
    >
      <h2 className="text-xl font-semibold text-neutral-900 dark:text-neutral-100">
        {mode === "create" ? "Create Opportunity" : "Edit Opportunity"}
      </h2>

      {error && <p className="error-text">{error}</p>}

      {/* TITLE */}
      <div>
        <label className="form-label">Title</label>
        <input
          className="input"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>

      {/* DEAL TYPE + STAGE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">Deal Type</label>
          <select
            className="input"
            name="deal_type"
            value={form.deal_type}
            onChange={handleDealTypeChange}
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <div>
          <label className="form-label">Stage</label>
          <select
            className="input"
            name="stage"
            value={form.stage}
            onChange={handleChange}
          >
            {stages.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ADDRESS */}
      <div>
        <label className="form-label">Property Address</label>
        <input
          className="input"
          name="property_address"
          value={form.property_address}
          onChange={handleChange}
        />
      </div>

      {/* MLS + PRICE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="form-label">MLS ID</label>
          <input
            className="input"
            name="mls_id"
            value={form.mls_id}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="form-label">Price</label>
          <input
            type="number"
            className="input"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* DATE */}
      <div>
        <label className="form-label">Estimated Close Date</label>
        <input
          type="date"
          className="input"
          name="estimated_close_date"
          value={form.estimated_close_date}
          onChange={handleChange}
        />
      </div>

      {/* NOTES */}
      <div>
        <label className="form-label">Notes</label>
        <textarea
          className="input h-28"
          name="notes"
          value={form.notes}
          onChange={handleChange}
        />
      </div>

      {/* PARTICIPANTS */}
      <ParticipantSelector
        selected={form.participants}
        onChange={(updated) =>
          setForm((prev) => ({ ...prev, participants: updated }))
        }
      />

      {/* SUBMIT BUTTON */}
      <button
        type="submit"
        disabled={submitting}
        className="btn-primary w-full justify-center"
      >
        {submitting ? "Saving..." : mode === "create" ? "Create Opportunity" : "Save Changes"}
      </button>
    </form>
  );
}
