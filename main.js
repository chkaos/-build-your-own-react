import { createElement, render, ReactComponent } from "./src/creact"

class MyComponent extends ReactComponent{
  render() {
    return <div>MyComponent</div>
  }
}

render(<MyComponent id="test">
  <div>123</div>
  <div>abc</div>
  <div>456</div>
</MyComponent>, document.body)