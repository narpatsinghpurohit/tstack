import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";
// autoImport
// routes
const routes:any = {
    Home:{
        component: Home,
        path: '/'
    },
    Login:{
        component:Login,
        path:'/login'
    },
    SignUp:{
        component:SignUp,
        path:'/sign-up'
    },// autoRoute
}
// routes END

export default routes;