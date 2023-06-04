export class User {
  constructor(
    public id: number,
    public firstName: string,
    public lastName: string,
    public email: string,
    private _tokenExpirationDate: Date
  ) {}

  get tokenExpirationDate() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this.id;
  }
}
