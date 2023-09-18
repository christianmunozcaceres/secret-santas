import { MailService as SendgridMailer } from "@sendgrid/mail";
import { Mailer, SendMailInput } from "../mailer.interface";
import { SendgridConfig } from "./interfaces";

export class SendgridClient extends Mailer {
  private sendgridMailer: SendgridMailer;

  constructor({ apiKey, fromEmail }: SendgridConfig) {
    super({ fromEmail });
    this.sendgridMailer = new SendgridMailer();
    this.sendgridMailer.setApiKey(apiKey);
  }

  async sendMail({ body, subject, to, from }: SendMailInput): Promise<boolean> {
    const fromEmail = from ?? this.fromEmail;

    try {
      const result = await this.sendgridMailer.send({
        from: fromEmail,
        text: body,
        subject,
        to: to.map((email) => {
          return { email };
        }),
      });

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  }
}
