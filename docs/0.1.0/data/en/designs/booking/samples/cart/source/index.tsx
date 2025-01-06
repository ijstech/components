import {  Module, Container, customModule } from "@ijstech/components";
import CartMain from "./cart/index";

@customModule
export default class Cart extends Module {

  constructor(parent?: Container, options?: any) {
    super(parent, options);
  }

  init() {
    super.init();
  }

  render() {
    return <i-panel width='100%'>
      <i-cart id="cartEl" display='block' width='100%' />
    </i-panel>
  }
}