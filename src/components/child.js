export const child={
    name:'child',
    state:{},
    props:{},
    componentReady(){
        // console.log(this.props)
        this.setState({
            value:this.template.getAttribute('prop')
        })
    },
     view(component){
        let val=component.state.value?component.state.value:'';
        return `<div>${val}</div>`
    }
    
}