export class MailgunService implements MailService {
  constructor(
    private mailgunApiKey: string,
    private mailgunDomainName: string,
  ) {
  }

  async sendEmail(
    from: { email: string, name: string },
    to: string,
    subject: string,
    html: string
  ) {
    const form = new FormData()
    form.append("from", `${from.name} <${from.email}>`)
    form.append("to", to)
    form.append("subject", subject)
    form.append("html", html)

    return await $fetch.raw(`https://api.mailgun.net/v3/${this.mailgunDomainName}/messages`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`api:${this.mailgunApiKey}`).toString("base64"),
      },
      body: form
    })
  }
}
