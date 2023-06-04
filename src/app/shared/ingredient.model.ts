export class Ingredient {
  public id?: number;
  public name: string;
  public quantity: number;

  constructor(name: string, amount: number) {
    this.name = name;
    this.quantity = amount;
  }
}
