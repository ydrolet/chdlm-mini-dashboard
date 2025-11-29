declare module "nuxt/schema" {
  interface RuntimeConfig {
    mongodbUri: string
    apiKey: string
    fromEmailAddress: string
    fromName: string
    mailgunApiKey: string
    mailgunDomainName: string
    debugRecipientEmailAddress: string
  }
}

export {}
