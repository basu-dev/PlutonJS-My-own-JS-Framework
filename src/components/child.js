export const child = {
  name: "child",
  state: {},
  props: {},
  componentReady() {},
  actions: {
    clicked: (e) => {
      console.log(component);
      // this.update();
    },
  },
  view() {
    return /*html*/ `<div class="child-component" on='click,clicked,cat'>
    <div class='card'>
    <h3 class="mb-3">User Details</h3>
        <div class="grid">
            <h5>Name:</h5>
            <div>${this.props.name}</div>

            <h5>Email:</h5>

            <div>${this.props.email}</div>

            <h5>Roll No:</h5>

            <div>${this.props.rollNo}</div>

            <h5>Address: </h5>
            
            <div>${this.props.address}</div>

        </div>
    </div>
     </div>`;
  },
};
