
import { Router } from "../devJs/router.js";

export class Route extends Router{

    constructor(app){
        
        super(app,
            [
                {
                    routeName:'test',
                    componentName:'test'
                },
                {
                    routeName:'name',
                    componentName:'name'
                },
                {
                    routeName:'mycomp',
                    componentName:'mycomp'
                },
                {
                    routeName:'dtl',
                    componentName:'detail'
                },
                {
                    routeName:'nav',
                    componentName:'nav'
                },
                {
                    routeName:'intro',
                    componentName:'intro',
                    isDefault:true
                },
                {
                    routeName:'parent',
                    componentName:'parent'
                }
            ]
            );

    }
}
