import Vue from "vue";
import Router from "vue-router";

//routes
import defaultRoutes from "./default";

// session components
const Install = () => import("Views/session/Install");
const SignUpOne = () => import("Views/session/SignUpOne");
const Activate = () => import("Views/session/Activate");
const Expired = () => import("Views/session/Expired");
const LoginOne = () => import("Views/session/LoginOne");
const ForgotPassword = () => import("Views/session/ForgotPassword");
const ResetPassword = () => import("Views/session/ResetPassword");

const LoginAs = () => import("Views/session/LoginAs");
const PageNotFound = () => import("Views/session/PageNotFound");

Vue.use(Router);

export default new Router({
    mode: "history",
    routes: [
        defaultRoutes,
        {
            path: "/install",
            component: Install,
            meta: {
                title: "Install",
                breadcrumb: "Install"
            }
        },
        {
            path: "/activate/:key",
            component: Activate,
            meta: {
                title: "message.activate",
                breadcrumb: "Activate"
            }
        },
        {
            path: "/expired",
            component: Expired,
            meta: {
                title: "message.expried",
                breadcrumb: "Expired"
            }
        },
        {
            path: "/session/sign-up",
            component: SignUpOne,
            meta: {
                title: "message.signUp",
                breadcrumb: "Session / Sign Up"
            }
        },
        {
            path: "/session/login",
            component: LoginOne,
            meta: {
                title: "message.login",
                breadcrumb: "Session / Login"
            }
        },
        {
            path: "/session/forgot-password",
            component: ForgotPassword,
            meta: {
                title: "message.forgotPassword",
                breadcrumb: "Session / Forgot Password"
            }
        },
        {
            path: "/session/reset-password/:otp/:email_hashed_id",
            component: ResetPassword,
            meta: {
                title: "message.resetPassword",
                breadcrumb: "Reset Password"
                // requiresAuth: false
            }
        },
        {
            path: "/session/loginas",
            name: "loginas",
            component: LoginAs,
            props: true,
            meta: {
                title: "Login As",
                breadcrumb: "Login As",
                requiresAuth: true,
                redirect: location.pathname
            }
        },
        // Finally redirectign to the login route, when none of the above matches:
        {
            path: "*",
            component: PageNotFound
        }
    ]
});
