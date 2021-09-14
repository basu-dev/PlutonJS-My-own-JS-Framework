export const myForm = {
  name: "myForm",
  form: {
    email: "",
    password: "",
  },

  componentReady() {
    console.log(this.name);
  },

  print(value) {
    console.log(value);
  },

  actions: {
    setEmail(e) {
      this.form.email = e.target.value;
    },
    setPassword(e) {
      this.form.password = e.target.value;
    },
    submit(e) {
      e.preventDefault();
      console.log(this.form);
      location.hash = "/parent";
    },
  },

  view() {
    //events are passed with syntax like on='click,clicked' where click is event and handler function mentioned in the actions object.
    return /*html*/ `
        <div class="form-component">
          <div class='title'>Login Form</div>
            <div class="form">
              <form on='submit,submit' class="card">
                <input type='text' value='${this.form.email}'  placeholder='Email' on='input,setEmail' >  
                <input type='password'  placeholder='Password' value='${this.form.password}' on='keyup,setPassword' >
                <button type='submit'>Submit</button> 
              </form>
            </div>
        </div>
        `;
  },
};
