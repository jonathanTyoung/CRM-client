"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// --------------------------------------
// CONDITIONAL STAGES FOR BUYER / SELLER
// --------------------------------------
const STAGES = {
  buyer: [
    { value: "prospecting", label: "Prospecting" },
    { value: "agreement_signed", label: "Agreement Signed" },
    { value: "showing", label: "Showing" },
    { value: "offer_made", label: "Offer Made" },
    { value: "under_contract", label: "Under Contract" },
    { value: "closed", label: "Closed" },
  ],
  seller: [
    { value: "prospecting", label: "Prospecting" },
    { value: "appointment_set", label: "Appointment Set" },
    { value: "appointment_held", label: "Appointment Held" },
    { value: "agreement_signed", label: "Agreement Signed" },
    { value: "listed", label: "Listed" },
    { value: "under_contract", label: "Under Contract" },
    { value: "closed", label: "Closed" },
  ],
};

export default function OpportunityForm({ mode, initialData }: any) {
  const router = useRouter();

  // --------------------------------------
  // FORM STATE
  // --------------------------------------
  const [form, setForm] = useState({
    deal_type: initialData?.deal_type || "buyer",
    stage: initialData?.stage || STAGES[initialData?.deal_type || "buyer"][0].value,
    title: initialData?.title || "",
    property_address: initialData?.property_address || "",
    mls_id: initialData?.mls_id || "",
    price: initialData?.price || "",
    estimated_close_date: initialData?.estimated_close_date || "",
    notes: initialData?.notes || "",
  });

  // --------------------------------------
  // INPUT HANDLERS
  // --------------------------------------
  function handleInput(name: string, value: any) {
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSelectDealType(newType: string) {
    setForm((prev) => ({
      ...prev,
      deal_type: newType,
      stage: STAGES[newType][0].value, // reset stage when switching type
    }));
  }

  async function handleSubmit(e: any) {
    e.preventDefault();

    const url =
      mode === "create"
        ? "/api/opportunities"
        : `/api/opportunities/${initialData.id}`;

    const method = mode === "create" ? "POST" : "PATCH";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      router.push("/opportunities");
    } else {
      console.error(await res.text());
    }
  }

  // --------------------------------------
  // STYLES
  // --------------------------------------
  const inputClass =
    "w-full rounded-lg px-3 py-2 bg-neutral-100 dark:bg-neutral-800 " +
    "border border-neutral-300 dark:border-neutral-700 " +
    "text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 " +
    "dark:placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50";

  const labelClass = "block mb-1 font-medium text-neutral-700 dark:text-neutral-300";

  const sectionHeader =
    "text-lg font-semibold text-neutral-900 dark:text-neutral-100 " +
    "border-b border-neutral-200 dark:border-neutral-700 pb-2 mb-4";

  // --------------------------------------
  // DYNAMIC PLACEHOLDERS
  // --------------------------------------
  const titlePlaceholder =
    form.deal_type === "buyer"
      ? "Ex: 1234 Elm St – Buyer Lead"
      : "Ex: 1234 Elm St – Listing Opportunity";

  const addressPlaceholder = "Ex: 1234 Elm St, Nashville TN 37212";
  const mlsPlaceholder = "Ex: 2571983";
  const pricePlaceholder = "Ex: 525000";

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full py-8 px-4 md:px-12 space-y-12 bg-white dark:bg-neutral-900"
    >
      <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {mode === "create" ? "Create Opportunity" : "Edit Opportunity"}
      </h2>

      {/* -------------------------------------- */}
      {/* DEAL INFORMATION */}
      {/* -------------------------------------- */}
      <section>
        <h3 className={sectionHeader}>Deal Information</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* DEAL TYPE */}
          <div>
            <label className={labelClass}>Deal Type</label>
            <select
              value={form.deal_type}
              onChange={(e) => handleSelectDealType(e.target.value)}
              className={inputClass}
            >
              <option value="buyer">Buyer</option>
              <option value="seller">Seller</option>
            </select>
          </div>

          {/* STAGE */}
          <div>
            <label className={labelClass}>Stage</label>
            <select
              value={form.stage}
              onChange={(e) => handleInput("stage", e.target.value)}
              className={inputClass}
            >
              {STAGES[form.deal_type].map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>

          {/* TITLE */}
          <div className="md:col-span-2">
            <label className={labelClass}>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={(e) => handleInput("title", e.target.value)}
              placeholder={titlePlaceholder}
              className={inputClass}
              required
            />
          </div>
        </div>
      </section>

      {/* -------------------------------------- */}
      {/* PROPERTY DETAILS */}
      {/* -------------------------------------- */}
      <section>
        <h3 className={sectionHeader}>Property Details</h3>

        <div className="space-y-6">
          {/* ADDRESS */}
          <div>
            <label className={labelClass}>Property Address</label>
            <input
              name="property_address"
              value={form.property_address}
              onChange={(e) => handleInput("property_address", e.target.value)}
              placeholder={addressPlaceholder}
              className={inputClass}
            />
          </div>

          {/* MLS + PRICE */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className={labelClass}>MLS ID</label>
              <input
                name="mls_id"
                value={form.mls_id}
                onChange={(e) => handleInput("mls_id", e.target.value)}
                placeholder={mlsPlaceholder}
                className={inputClass}
              />
            </div>

            <div>
              <label className={labelClass}>Price</label>
              <input
                name="price"
                type="number"
                value={form.price}
                onChange={(e) => handleInput("price", e.target.value)}
                placeholder={pricePlaceholder}
                className={inputClass}
              />
            </div>
          </div>
        </div>
      </section>

      {/* -------------------------------------- */}
      {/* TIMELINE */}
      {/* -------------------------------------- */}
      <section>
        <h3 className={sectionHeader}>Timeline</h3>

        <label className={labelClass}>Estimated Close Date</label>
        <input
          type="date"
          name="estimated_close_date"
          value={form.estimated_close_date}
          onChange={(e) => handleInput("estimated_close_date", e.target.value)}
          className={inputClass}
        />
      </section>

      {/* -------------------------------------- */}
      {/* NOTES */}
      {/* -------------------------------------- */}
      <section>
        <h3 className={sectionHeader}>Notes</h3>
        <textarea
          name="notes"
          value={form.notes}
          onChange={(e) => handleInput("notes", e.target.value)}
          placeholder="Add deal context, deadlines, goals, or key details…"
          className={`${inputClass} h-32`}
        />
      </section>

      {/* SUBMIT */}
      <button
        type="submit"
        className="
          w-full mt-4 bg-blue-600 hover:bg-blue-700 
          text-white font-medium py-3 rounded-lg 
          transition shadow-sm
        "
      >
        {mode === "create" ? "Create Opportunity" : "Save Changes"}
      </button>
    </form>
  );
}
