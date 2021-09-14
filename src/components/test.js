export const test = {
  name: "test",
  value: "helloA,",
  view() {
    return /*html*/ `
    <div>
    <div class='title'>${this.value}</div>
    <p>This is test component</p>
    </div>
    `;
  },
};
