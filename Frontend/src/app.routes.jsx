import {createBrowserRouter} from "react-router-dom"
import Login from "./features/auth/pages/login.jsx";
import Signup from "./features/auth/pages/signup.jsx";
import Protected from "./features/auth/components/protected.jsx";
import Home from "./features/ai/pages/Home.jsx";
import Interview from "./features/ai/pages/interview.jsx";
import Subscription from "./features/subscription/pages/subscription.jsx"

export const router = createBrowserRouter([
    {
        path: "/login",
        element: <Login />
    },
    {
        path: "/signup",
        element: <Signup />
    },
    {
        path:"/",
        element: <Protected><Home /></Protected>
    },
    {
        path:"/interview/:interviewId",
        element: <Protected><Interview /></Protected>
    },
    {
        path:"/subscription",
        element:<Protected><Subscription /></Protected>
    }
])
