export class UserName {
  constructor(public firstName: string, public lastName: string) {}
}

export class UserNameMaker {
  static create(event: UserName) {
    return {
      firstName: event.firstName,
      lastName: event.lastName,
    };
  }
}
