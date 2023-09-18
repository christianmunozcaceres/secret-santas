import { dumbAssignGivers } from "./assign-givers.dumb";
import { emptyReceiverList, sortedGiveList } from "./test-data";

describe("Assign Function", () => {
  test("All receivers are defined", () => {
    const result = dumbAssignGivers(sortedGiveList);
    for (const { receiverId } of result) {
      expect(receiverId).toBeDefined();
    }
  });

  // TODO check for specific error codes
  test("Throws error on empty receiver list", () => {
    expect(() => {
      dumbAssignGivers(emptyReceiverList);
    }).toThrow();
  });

  test("All receivers are unique", () => {
    const result = dumbAssignGivers(sortedGiveList);
    let checkedReceivers: string[] = [];
    for (const { receiverId } of result) {
      expect(checkedReceivers.includes(receiverId)).toEqual(false);

      checkedReceivers.push(receiverId);
    }
  });
});
