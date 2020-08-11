
export const  myForm={
    name:'myForm',
    state:{
        email:'',
        password:''
    },
    componentReady(){
        // console.log(this.name);
        // console.log(this.template)
    },
    actions:{
         setEmail:(component,e)=>{
             console.log(self)
            //  console.log(component,e.target.value)
             component.setState({
                 email:e.target.value
             })
        },
        setPassword:(component,e)=>{
            component.setState({
                password:e.target.value
            })
        },
        submit(component,element){
            console.log(component.state)
            component.setState({
                email:"",
                password:""
            })
        }   
    },
    view:(component)=>{
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