export class Ingredient {
  public id?: number;
  public name: string;
  public quantity: number;

  constructor(name: string, quantity: number, id?: number) {
    this.id = id;
    this.name = name;
    this.quantity = quantity;
  }
}
