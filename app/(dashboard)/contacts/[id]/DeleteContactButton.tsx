"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function DeleteContactButton({ id }: { id: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this contact? This cannot be undone.")) {
      return;
    }

    setLoading(true);

    // IMPORTANT: use internal route, not Django
    const res = await fetch(`/internal/contacts/${id}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (res.status === 204 || res.ok) {
      router.push("/contacts");
      router.refresh();
      return;
    }

    alert("Failed to delete contact.");
    setLoading(false);
  }

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="btn-secondary text-red-500 border-red-500 hover:bg-red-100"
    >
      {loading ? "Deleting…" : "Delete"}
    </button>
  );
}
