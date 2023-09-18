import { SecretSanta, User } from "@prisma/client";

export type AssignGiversFunction = (
  giftHistory: GiftHistoryElement[]
) => AssignedGiver[];

export type AssignedGiver = {
  giverId: string;
  receiverId: string;
};
export type GiftHistoryElement = {
  giverId: string;
  availableReceivers: string[];
};

export type SecretSantaWithUsers = SecretSanta & {
  giver: User;
  receiver: User;
};

// BUT PROBABLY MAKE YOUR OWN DATASTRUCTURE
