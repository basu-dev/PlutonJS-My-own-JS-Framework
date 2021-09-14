import { Service } from "../Service";
import { Pluton } from "../../lib/pluton";
import { child } from "./child";
export const parent = {
  name: "parent",
  state: {
    users: [
      {
        name: "Basu Dev ADhikari",
        rollNo: 1,
        address: "Kathmandu",
        email: "adbasudev54@gmail.com",
      },
      {
        name: "Santosh Acharya",
        rollNo: 2,
        address: "Dang",
        email: "santosh@gmail.com",
      },
      {
        name: "Saroj Basnet",
        rollNo: 3,
        address: "Dang",
        email: "saroj@gmail.com",
      },
    ],
  },
  updated: false,
  childrens: [child],
  componentReady() {
    console.log("Parent Ready");
    let a = new Service();
    a.get().then((res) => {
      console.log(res);
      this.updated = true;
      this.state.users = res;

      setTimeout(() => {
        this.update();
      });

      // this.setState({
      //   users: res,
      // });
    });
  },
  actions: {
    fromChild: (child) => {
      console.log("from Child", child);
    },
    clicked() {
      console.log("clicked");
    },
  },
  view() {
    let { state } = this;
    let list = state.users
      .map((u) => {
        return /*html*/ Pluton.html`<child isHook='true' prop="${JSON.stringify(
          u
        )}"></child>`;
      })
      .join("");

    return /*html*/ `<div class="container">
       <div class='title' on='click,clicked'>Our Users</div>
            ${list}
        </div>`;
  },
};
