export type PhotoSlot = {
  src: string;
  alt: string;
  label: string;
  position?: string;
};

// Five real photographs, sequenced as a visual sentence rather than a grid.
export const photoSlots: PhotoSlot[] = [
  {
    src: "/photos/01.jpg",
    alt: "Devon and Sarah together in a mirror photograph",
    label: "The two of us / 01",
    position: "50% 68%"
  },
  {
    src: "/photos/02.jpg",
    alt: "Sarah in a cobalt-blue studio portrait",
    label: "Composure / 02"
  },
  {
    src: "/photos/03.jpg",
    alt: "Sarah looking directly into the camera in blue",
    label: "The gaze / 03"
  },
  {
    src: "/photos/04.jpg",
    alt: "Sarah smiling in a cobalt-blue portrait",
    label: "That smile / 04"
  },
  {
    src: "/photos/05.jpg",
    alt: "Full-length portrait of Sarah in blue and denim",
    label: "Sarah, in full / 05",
    position: "50% 48%"
  }
];

export const sonnet = [
  "Before you were a birthday, you were light —",
  "a small blue check that flickered into thought,",
  "a stranger's voice that somehow felt like sight,",
  "a language I had never quite been taught.",
  "Abuja keeps us now in separate rooms,",
  "two roofs, one waiting, learning how to bend,",
  "and still you soften everything that looms,",
  "and still I count you nearer than the end.",
  "They call you outspoken; I call it brave.",
  "They call you soft; I call that softness spine.",
  "You carry sisters, mothers, all you save,",
  "and somehow still find room to carry mine.",
  "So let this be the crown that needs no gold:",
  "I'm safest in the story we unfold."
];

export const flow = [
  "She ain't easy, she a fever, she a reason to believe again,",
  "outspoken like an open book, but soft up in the deep of it,",
  "she carries sisters, carries mama, never once keeping score,",
  "she gives away the whole of her and somehow still got more.",
  "I met her on a WhatsApp tick — one blue turned into two,",
  "I wasn't planning forever, forever planned on you.",
  "Two roofs, one city, still she's closer than my skin,",
  "she's the crown I never asked for, and I'm wearing it again.",
  "Sugar in the nickname, but no sugar in her spine —",
  "she's the softest kind of storm alive, and God, she's mine."
];

export const bestowedTitles = [
  "Keeper of my softest hour",
  "Translator of the things I don't say well",
  "Architect of a house that doesn't exist yet",
  "Guardian of her sister's laughter and her mother's peace",
  "The blue tick that became a whole life",
  "My queen when no one's watching, my equal when they are"
];
