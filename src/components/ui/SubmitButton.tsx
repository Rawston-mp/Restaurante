"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

interface SubmitButtonProps {
  label: string;
  pendingLabel?: string;
  className?: string;
}

export default function SubmitButton({
  label,
  pendingLabel,
  className = "w-full bg-linear-to-r from-red-500 to-orange-500 text-white font-bold py-2.5 rounded-xl shadow hover:shadow-md transition-all hover:scale-[1.01]",
}: SubmitButtonProps) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className={`${className} inline-flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100`}
    >
      {pending && <Loader2 className="w-4 h-4 animate-spin" />}
      {pending ? (pendingLabel ?? "Salvando...") : label}
    </button>
  );
}
