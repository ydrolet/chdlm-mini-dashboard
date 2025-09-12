declare module "nuxt/schema" {
  interface RuntimeConfig {
    fromEmailAddress: string
    fromName: string
    mailgunApiKey: string
    mailgunDomainName: string
    debugRecipientEmailAddress: string
  }
}

export {}
