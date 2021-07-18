import { Item } from './item';
import { OrderOption } from './order-option';

export class OrderItem extends Item {

  constructor(
    public quantity: number = 0,
    public obs: string = '',
    public optionsSelected: OrderOption[] = []
  ) {
    super();
  }

}
