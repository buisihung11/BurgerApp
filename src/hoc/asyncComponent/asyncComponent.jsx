import React, {Component} from 'react'

//this component will load the import component when the render method was call
//or when needed
//the importComponent is an import function which will load the component from
//the exported file and get the DEFAULT component
const asyncComponent = (importComponent) => {
    return class extends Component{
        state = {
            component : null
        }
        componentDidMount(){
            importComponent()
            .then(cmp => {
                this.setState({component: cmp.default});
            })
        }
        render(){
            const C = this.state.component;

            return C && <C {...this.props} />;
        }
    }
};

export default asyncComponent
