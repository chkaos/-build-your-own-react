import { render, Component } from "./src/react"

class MyComponent extends Component{
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