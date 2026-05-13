export const BUILDER_CODE = "bc_8thf7f3m";
export const ATTRIBUTION_CODE = "[ATTRIBUTION_CODE]";

// ERC-8021 Simple Attribution Utility
export function getAttributionData() {
  return {
    builder: BUILDER_CODE,
    attribution: ATTRIBUTION_CODE,
    timestamp: Date.now()
  };
}
