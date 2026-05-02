export const palette = [
  "#4f46e5",
  "#7c3aed",
  "#db2777",
  "#0891b2",
  "#059669",
  "#d97706",
  "#dc2626",
  "#6366f1",
  "#0284c7",
  "#9333ea",
];

export const initials = (name) => {
  return name
    ?.split(" ")
    .map((p) => p[0])
    .join("")
    .toUpperCase();
};

export const avatarColor = (name) => {
  let h = 0;
  for (let i = 0; i < name?.length; i++)
    h = (h * 31 + name?.charCodeAt(i)) % palette.length;
  return palette[h];
};
