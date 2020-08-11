export const nav={
    name:'nav',
    componentReady(){
        // console.log("Navbar Component Started")
        // document.querySelector("navbar").addEventListener('click',this.clicked)
    },
    view:()=>{
        return  `
        <div>
        <navbar> <ul>
        <li><a href="#/intro">DevJS</a></li>
        <li><a href="#/name">Members</a></li>
        <li><a href="#/dtl">Detail</a></li>
        <li><a href="#/parent">ParentChild</a></li>
        </ul>
        </navbar>
        </div>`
    }
}