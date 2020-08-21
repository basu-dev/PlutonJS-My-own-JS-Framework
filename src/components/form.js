
export const  myForm={
    name:'myForm',
    state:{
        email:'',
        password:''
    },
    componentReady(){
        console.log(this.name);
        // console.log(this.template)
    },
    actions:{
         setEmail(component,e){
             console.log(this)
             console.log(e.target.value)
             this.setState({
                 email:e.target.value,
                 password:this.state.password
             })
        },
        setPassword(component,e){
            console.log(this)
            console.log(e.target.value)
            this.setState({
                email:this.state.email,
                password:e.target.value
            })
        },
        submit(component,element){
            console.log(this.state)
            this.setState({
                email:"",
                password:""
            })
        }   
    },
    view(){
        let component=this;
        //events are passed with syntax like on='click,clicked' where click is event and handler function mentioned in the actions object.
        return  `
        <div>
        <div class='title'>Login Form</div>
        <form on='submit,submit'>
        <input type='text'  name='email' value='${component.state.email}'  placeholder='Email' on='input,setEmail' >  
        <input type='password' name='password' placeholder='Password' value='${component.state.password}' on='keyup,setPassword' >
        <button type='submit'>Submit</button> 
        </form>
        </div>
        `
    }
}