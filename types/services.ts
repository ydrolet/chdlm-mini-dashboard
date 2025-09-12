export interface MailService {
  sendEmail(from: {email: string, name: string}, to: string, subject: string, html: string): Promise<Response>
}
