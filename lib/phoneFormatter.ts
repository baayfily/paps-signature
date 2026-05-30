export function formatPhoneLocalNumber(value: string, countryId: string): string {
  // Strip all non-digits
  const digits = value.replace(/\D/g, "");
  
  if (countryId === "sn") {
    // Format: XX XXX XX XX (Max 9 digits)
    const sliced = digits.slice(0, 9);
    if (sliced.length <= 2) {
      return sliced;
    } else if (sliced.length <= 5) {
      return `${sliced.slice(0, 2)} ${sliced.slice(2)}`;
    } else if (sliced.length <= 7) {
      return `${sliced.slice(0, 2)} ${sliced.slice(2, 5)} ${sliced.slice(5)}`;
    } else {
      return `${sliced.slice(0, 2)} ${sliced.slice(2, 5)} ${sliced.slice(5, 7)} ${sliced.slice(7)}`;
    }
  } else if (countryId === "ci") {
    // Format: XX XX XX XX XX (Max 10 digits)
    const sliced = digits.slice(0, 10);
    const parts = [];
    for (let i = 0; i < sliced.length; i += 2) {
      parts.push(sliced.slice(i, i + 2));
    }
    return parts.join(" ");
  } else if (countryId === "cv") {
    // Format: XXX XX XX (Max 7 digits)
    const sliced = digits.slice(0, 7);
    if (sliced.length <= 3) {
      return sliced;
    } else if (sliced.length <= 5) {
      return `${sliced.slice(0, 3)} ${sliced.slice(3)}`;
    } else {
      return `${sliced.slice(0, 3)} ${sliced.slice(3, 5)} ${sliced.slice(5)}`;
    }
  }
  
  // Generic: Max 15 digits, group by pairs
  const sliced = digits.slice(0, 15);
  const parts = [];
  for (let i = 0; i < sliced.length; i += 2) {
    parts.push(sliced.slice(i, i + 2));
  }
  return parts.join(" ");
}
