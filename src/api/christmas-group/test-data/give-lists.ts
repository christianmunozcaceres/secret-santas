import { GiftHistoryElement } from "../types";

export const sortedGiveList: GiftHistoryElement[] = [
  { giverId: "4", availableReceivers: ["3"] },
  { giverId: "2", availableReceivers: ["0", "3"] },
  { giverId: "1", availableReceivers: ["0", "4"] },
  { giverId: "3", availableReceivers: ["0", "2", "4"] },
  { giverId: "0", availableReceivers: ["1", "3", "4"] },
];

export const emptyReceiverList: GiftHistoryElement[] = [
  { giverId: "0", availableReceivers: [] },
];
