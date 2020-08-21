export const intro={
    name:'intro',
    componentReady(){
        console.log("Intro component  ready")
    },
    view(){
        return `
       <div style='text-align:center'>
        <div class="title">Home Page</div>
        <div class="welcometext">
            Welcome to <span>DevJS</span>. This is our Home Page.
        </div>
        <section>
            <div class="box">
                <div class="main">
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        </section>
        <div class="welcometext">
            Visit The Documentation of DevJS <span><a href="#">Here.</a></span>
        </div>
        <footer>This is an web application built on top of devJS v1.0.0</footer>
        </div>
        `
        
        
    }
}