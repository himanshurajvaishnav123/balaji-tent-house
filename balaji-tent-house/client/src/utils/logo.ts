import type { SiteSettings } from "../types";

/**
 * Returns Tailwind classes for the logo <img> and its wrapping box so any
 * uploaded shape (square, rectangle, or circle) displays cleanly:
 * - circle/square crop to a neat box via object-cover
 * - rectangle keeps its natural proportions via object-contain in a wider box
 */
export const getLogoDisplay = (shape: SiteSettings["logoShape"] | undefined) => {
  switch (shape) {
    case "rectangle":
      return {
        wrapper: "h-10 w-auto max-w-[160px] px-1",
        img: "h-full w-full object-contain",
      };
    case "square":
      return {
        wrapper: "h-10 w-10 rounded-md overflow-hidden border-2 border-marigold",
        img: "h-full w-full object-cover",
      };
    case "circle":
    default:
      return {
        wrapper: "h-10 w-10 rounded-full overflow-hidden border-2 border-marigold",
        img: "h-full w-full object-cover",
      };
  }
};
