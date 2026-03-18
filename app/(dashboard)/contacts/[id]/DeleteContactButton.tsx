"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function DeleteContactButton({ id }: { id: number | string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    const res = await fetch(`/api/contacts/${id}/`, {
      method: "DELETE",
      credentials: "include", // optional but recommended
    });

    if (!res.ok) {
      console.error("Failed to delete contact", await res.text());
      alert("Failed to delete contact.");
      return;
    }

    startTransition(() => {
      router.push("/contacts");
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="btn-danger"
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
