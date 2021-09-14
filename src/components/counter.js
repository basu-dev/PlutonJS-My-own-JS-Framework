export const counter = {
  name: "counter",
  componentReady() {
    // console.log("Navbar Component Started")
    // document.querySelector("navbar").addEventListener('click',this.clicked)
  },
  count: 0,
  actions: {
    clicked() {
      console.log("clicked");
      this.count++;
      this.update();
    },
  },
  view() {
    return /*html*/ `
        <div>
        <h1>${this.count}</h1>
            <button on='click,clicked'> Increment</button>
        </div>`;
  },
};
