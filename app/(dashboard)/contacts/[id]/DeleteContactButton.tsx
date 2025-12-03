"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

export function DeleteContactButton({ id }: { id: number | string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this contact?")) return;

    const res = await fetch(`/api/contacts/${id}`, {
      method: "DELETE",
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
      className={`
        inline-flex items-center justify-center px-4 py-2 
        rounded-md font-medium text-white 
        bg-red-600 
        hover:bg-red-700 
        focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1
        disabled:opacity-50 disabled:cursor-not-allowed
        transition-colors duration-150
      `}
    >
      {isPending ? "Deleting..." : "Delete"}
    </button>
  );
}
