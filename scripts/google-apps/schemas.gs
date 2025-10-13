"use strict"

const statusMapping = {
  member: 'Membre',
  probation: 'Probation',
  nonMember: 'Non-membre',
  former: 'Ancien',
}
Object.freeze(statusMapping)

class Resident {
  constructor(firstName, lastName, address, memberStatus, emailAddress) {
    this.firstName = firstName
    this.lastName = lastName
    this.address = address
    this.memberStatus = memberStatus
    this.emailAddress = emailAddress
  }

  get fullName() {
    return `${this.firstName} ${this.lastName}`
  }
}

class Member extends Resident {
  constructor(firstName, lastName, address, memberStatus, emailAddress) {
    super(firstName, lastName, address, memberStatus, emailAddress)
    this.involvement = {}
  }

  addAccomplishedTask(committeeName, period, task) {
    if (!this.involvement.hasOwnProperty(period.year)) {
      this.involvement[period.year] = {}
    }

    if (!this.involvement[period.year].hasOwnProperty(period.month)) {
      this.involvement[period.year][period.month] = {}
    }

    if (!this.involvement[period.year][period.month].hasOwnProperty(committeeName)) {
      this.involvement[period.year][period.month][committeeName] = []
    }

    this.involvement[period.year][period.month][committeeName].push(task)
  }
}

class Address {
  constructor(civicNumber, unitNumber) {
    this.civicNumber = civicNumber
    this.unitNumber = unitNumber
  }
}

class AccomplishedTask {
  constructor(taskName, hoursSpent, note) {
    this.taskName = taskName
    this.hoursSpent = hoursSpent
    this.note = note
  }
}
