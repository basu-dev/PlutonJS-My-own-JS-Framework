export const child = {
  name: "child",
  state: {},
  props: {},
  componentReady() {
      console.log('child component ready called',this.name)
    this.setState({
      value: this.template.getAttribute("prop"),
    });
  },
  actions: {
    clicked: (component, e) => {
      console.log(component);
    },
  },
  view() {
     
    return `<div #cat on='click,clicked,cat'>${this.state.name} ${this.state.address}</div>`;
  },
};
