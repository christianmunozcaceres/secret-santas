import { indexOf } from "lodash";
import { AssignError } from "./errors";
import { AssignGiversFunction, AssignedGiver } from "./types";

/**
 * This first iteration of the assign function is NOT designed to be performant...
 * @param giveList A 2D list of every participant and the available receivers
 * they can give to, sorted from least available receivers
 * @returns An array of Giver/Receiver pairs
 */
export const dumbAssignGivers: AssignGiversFunction = (giveList) => {
  let result: AssignedGiver[] = [];

  for (let i = 0; i < giveList.length; i++) {
    const { giverId, availableReceivers } = giveList[i];

    if (availableReceivers.length === 0) {
      throw AssignError.noAvailableReceivers(
        `Giver with id ${giverId} didn't have any receivers`
      );
    }
    const receiverId = availableReceivers[0];

    result.push({ giverId, receiverId });

    for (let c = i + 1; c < giveList.length; c++) {
      const { giverId: cleanId, availableReceivers: cleanList } = giveList[c];
      if (cleanList.includes(receiverId)) {
        cleanList.splice(indexOf(cleanList, receiverId), 1);
      }

      if (cleanId === receiverId && cleanList.includes(giverId)) {
        cleanList.splice(indexOf(cleanList, giverId), 1);
      }
    }
  }
  return result;
};
