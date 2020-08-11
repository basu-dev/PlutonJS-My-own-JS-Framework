export const detail={
          name: "detail",
          selector:"app-detail",
          state: { name: "Detail Page" ,message:"my-msg"},
          actions: {
            click(){
                console.log("clicked")
            }
          },
          componentReady(){
            console.log('thi is detail component and it is ready as f.')
          },
          componentChange(prevValue,newValue){
            console.log(`Component state changed from ${prevValue} to ${newValue}`)
          },
          componentDetach(){
            console.log("Detaching detail component from dom")
          },
          view: ({state}) => {
            return `
            <div >
            <div on='click,click' class='title'>Detail Page</div>
            <p>This is ${state.message}.</p>
            </div>
            `;
          }
        };
