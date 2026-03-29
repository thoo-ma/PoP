import { tv } from "tailwind-variants";

export const emptyState = tv({
  slots: {
    root: "py-12 items-center",
    title: "text-base font-semibold text-text-title mb-2",
    detail: "text-sm text-text-body text-center",
  },
});

export const errorMessage = tv({
  base: "text-[13px] text-red-600 text-center mb-3 px-2",
});

export const dialogBody = tv({
  base: "mb-4 gap-1.5",
});

// ── Dialog panel ─────────────────────────────────────────────────────────────
// Shared Dialog.Content + Dialog.Close styling for Profile and Wallet modals.
export const dialogPanel = tv({
  slots: {
    content: "mx-auto w-[85%] max-w-[400px] rounded-3xl px-8 py-8 items-center",
    close: "absolute top-4 right-4",
  },
});

// ── Info box ─────────────────────────────────────────────────────────────────
// Generic rounded container used in Breed (dashed) and Repair (solid).
export const infoBox = tv({
  base: "w-full bg-default rounded-2xl p-4 border border-border",
  variants: {
    border: {
      solid: "",
      dashed: "border-dashed rounded-[14px] p-5 items-center",
    },
  },
  defaultVariants: { border: "solid" },
});
