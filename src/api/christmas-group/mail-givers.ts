import { Mailer } from "../../lib";
import { SecretSantaWithUsers } from "./types";

export const mailGivers = async (
  args: { giveList: SecretSantaWithUsers[] },
  deps: { mailer: Mailer }
): Promise<MailGiversResult> => {
  const { mailer } = deps;
  const { giveList } = args;

  let result: MailGiversResult = [];

  for (const { giver, receiver } of giveList) {
    const success = await mailer.sendMail({
      to: [giver.email],
      subject: "Secret Santa: Du har blivit tilldelad en person!",
      body: `Hej ${giver.name}!
      Du har blivit tilldelat en person att ge present till denna jul.
      Personen du ska ge present till är ${receiver.name} (${receiver.email}). Titta i WhatsApp gruppen för att se vad denna person önskar sig!
      
      God jul!
      / IT Tomtenisse`,
    });

    result.push({ email: giver.email, success });
  }
  return result;
};

type MailGiversResult = { email: string; success: boolean }[];
