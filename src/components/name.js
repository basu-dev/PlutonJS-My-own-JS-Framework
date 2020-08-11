import { Service } from "../Service.js";
export const name = {
  name: "name",
  template: "",
  style: "",
  state: {
    users: [{ name: "cat" }, { name: "dev" }],
    names: []
  },
  componentReady() {
    let apiService = new Service();
    apiService.get().then(e => {
      this.setState({users:e})
      // self.updateView(this);
    });
  },
  componentChange(prevVlaue, currentValue) {
    // console.log("Name component change called")
    // console.log(prevVlaue,currentValue)
  },
  componentDetach() {
    // console.log("component detached");
  },
  view: ({ state, props, actions }) => {
    let list = state.users.map(m => {
      return `<tr>
                <td>${m.name}</td>
                <td>${m.position || "Employee"}</td>
                <td>${m.address || "Kathmandu"}</td>
              </tr>`;
    });
    return `
       <div>
       <div class='title'>Our Members</div>
       <table>
    <thead>
        <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Address</th>
        </tr>
    </thead>
    
    <tbody>
        ${list}
    </tbody>
</table>
      
       </div>
       `;
  }
};
