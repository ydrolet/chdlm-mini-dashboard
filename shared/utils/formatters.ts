export function maskEmailAddress(email: string) {
  return email.replace(/(?<=.).(?=.*.@)/g, "*")
}
