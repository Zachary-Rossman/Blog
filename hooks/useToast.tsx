"use client";

import { useEffect } from "react";

type ToastProps = {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
};

export default function Toast({
  message,
  type = "success",
  onClose,
}: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`
        fixed bottom-6 right-6 px-4 py-3 rounded shadow-lg text-white
        ${type === "success" ? "bg-green-600" : "bg-red-600"}
      `}
    >
      {message}
    </div>
  );
}