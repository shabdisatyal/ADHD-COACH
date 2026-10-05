// ids must match backend

export const profileIcons = [
  { id: "duck",     label: "duck",     icon: "/stickers/duck.jpg" },
  { id: "coneduck", label: "coneduck", icon: "/stickers/coneduck.jpg" },
  { id: "frog",     label: "frog",     icon: "/stickers/frog.jpg" },
  { id: "orange",   label: "orange",   icon: "/stickers/orange.jpg" },
  { id: "mushroom", label: "mushroom", icon: "/stickers/mushroom.jpg" },
  { id: "radish",   label: "radish",   icon: "/stickers/radish.jpg" },
  { id: "clover",   label: "clover",   icon: "/stickers/clover.jpg" },
  { id: "whale",    label: "whale",    icon: "/stickers/whale.jpg" },
];

export function getIcon(id) {
  const found = profileIcons.find((icon) => icon.id === id);
  return found ?? profileIcons[0];
}