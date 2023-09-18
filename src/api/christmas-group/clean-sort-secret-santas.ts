import { SecretSanta } from "@prisma/client";
import { indexOf } from "lodash";
import { GiftHistoryElement } from "./types";

export const cleanAndSortSecretSantas = (args: {
  secretSantas: SecretSanta[];
  participantIds: string[];
}): GiftHistoryElement[] => {
  const { secretSantas, participantIds } = args;

  let result: GiftHistoryElement[] = participantIds.map((giverId) => {
    let temp: GiftHistoryElement = {
      giverId,
      availableReceivers: [...participantIds],
    };
    // Remove giver itself from `availableReceivers`
    temp.availableReceivers.splice(
      indexOf(temp.availableReceivers, giverId),
      1
    );
    // Remove all previous receivers from `availableReceivers`
    for (const secretSanta of secretSantas) {
      if (secretSanta.giverId === giverId) {
        temp.availableReceivers.splice(
          indexOf(temp.availableReceivers, secretSanta.receiverId),
          1
        );
      }
    }
    return temp;
  });

  result.sort(
    (a, b) => a.availableReceivers.length - b.availableReceivers.length
  );

  return result;
};
