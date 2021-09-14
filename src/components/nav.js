export const nav = {
  name: "nav",
  componentReady() {
    // console.log("Navbar Component Started")
    // document.querySelector("navbar").addEventListener('click',this.clicked)
  },
  view() {
    return /*html*/ `
        <div>
        <navbar> <ul>
        <li><a href="#/intro">Pluton</a></li>
        <li><a href="#/name">Members</a></li>
        <li><a href="#/dtl">Detail</a></li>
        <li><a href="#/parent">ParentChild</a></li>

        <li><a href="#/form">Login</a></li>
        </ul>
        </navbar>
        </div>`;
  },
};
