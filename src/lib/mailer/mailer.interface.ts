export abstract class Mailer {
  protected fromEmail: string;

  constructor(config: { fromEmail: string }) {
    // Validation?
    this.fromEmail = config.fromEmail;
  }

  abstract sendMail(input: SendMailInput): Promise<boolean>;
}

export interface SendMailInput {
  to: string[];
  from?: string;
  subject: string;
  body: string;
}
