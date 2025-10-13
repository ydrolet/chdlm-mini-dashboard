class ErrorBase extends Error {
  constructor(message: string) {
    super(message)
    this.name = this.constructor.name
  }
}

export class MemberNotFound extends ErrorBase {}

export class NoEmailAddress extends ErrorBase {}

export class EmailSendingError extends ErrorBase {}
