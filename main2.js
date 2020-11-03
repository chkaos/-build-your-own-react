import { createElement, render, ReactComponent } from "./src/creact"

class MyComponent extends ReactComponent{
  constructor(){
    super()
    this.state = {
      a: 1,
      b: 2
    }
  }
  render() {
    return <div>
      <h1>MyComponent</h1>
      <button onClick={()=>{this.setState({a: this.state.a + 1})}}>增加</button>
      <span>{this.state.a.toString()}</span>
      <div>{this.state.b.toString()}</div>
      {this.children}
    </div>
  }
}

render(<MyComponent id="test">
  <div>123</div>
  <div>abc</div>
  <div>456</div>
</MyComponent>, document.body)