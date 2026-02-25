export const rests = ["shortRest", "longRest", "fullRest"] as const;

export type Rest = (typeof rests)[number];

export const restSet = new Set<Rest>(rests);
