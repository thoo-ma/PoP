import { tv } from "tailwind-variants";

// ── Screen container ──────────────────────────────────────────────────────────
// The top-level View (or ScrollView) wrapper for every screen.
// Used in Vault, Marketplace, Breed, Repair, and Poop.
export const screenContainer = tv({
  base: "flex-1 items-center",
  variants: {
    padTop: {
      sm: "pt-[60px]",
      md: "pt-[100px]",
      lg: "pt-[100px]",
    },
    padX: {
      none: "",
      sm: "px-6",
      md: "px-5",
    },
    bg: {
      surface: "bg-surface-bg",
      default: "bg-background",
      white: "bg-white",
    },
  },
  defaultVariants: { padX: "none" },
});

// ── Scroll content wrapper ────────────────────────────────────────────────────
// Applied to ScrollView contentContainerClassName across all screens.
export const scrollContent = tv({
  base: "",
  variants: {
    padding: {
      md: "px-5",
      lg: "px-6",
    },
    bottomPad: {
      md: "pb-[120px]",
      lg: "pb-[140px]",
    },
  },
});

// ── Grid layout ───────────────────────────────────────────────────────────────
// Two-column NFT / mystery-box grid used in Vault and Marketplace.
export const gridLayout = tv({
  slots: {
    wrapper: "flex-row flex-wrap justify-between w-full",
    item: "",
  },
  variants: {
    columns: {
      two: {
        item: "w-[48%]",
      },
    },
  },
  defaultVariants: { columns: "two" },
});

// ── NFT picker button ─────────────────────────────────────────────────────────
// The dashed-border "Select NFT from Vault" placeholder shown in Poop and
// Repair before the user picks an NFT.
export const nftPickerButton = tv({
  base: "w-[240px] h-[360px] rounded-2xl border-2 border-dashed border-border flex-col mt-5",
});
