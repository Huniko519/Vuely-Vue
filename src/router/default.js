import Full from "Container/Full";

// zntral components
const Dashboard = () => import("Views/dashboard/Dashboard");
const Profile = () => import("Views/profile/Profile");
const Client = () => import("Views/clients/Client");
const ClientOverview = () => import("Views/overview/ClientOverview");
const User = () => import("Views/users/User");
const UserOverview = () => import("Views/overview/UserOverview");
const Location = () => import("Views/locations/Location");
const LocationOverview = () => import("Views/overview/LocationOverview");
const Patient = () => import("Views/patients/Patient");
const Forms = () => import("Views/form-builder/Forms");
const FormBuilder = () => import("Views/form-builder/Form-builder");
const ComponentBuilder = () => import("Views/form-builder/Component-builder");
const PatientOverview = () => import("Views/overview/PatientOverview");
const Contact = () => import("Views/contacts/Contact");
const ContactOverview = () => import("Views/overview/ContactOverview");
const Alert = () => import("Views/alerts/Alert");
const Settings = () => import("Views/settings/Settings");
const Chat = () => import("Views/chat/Chat");

export default {
    path: "/",
    component: Full,
    redirect: "/session/loginas",
    children: [
        {
            path: "/dashboard",
            component: Dashboard,
            meta: {
                requiresAuth: true,
                title: "message.dashboard",
                breadcrumb: "Dashboard",
            },
        },
        {
            path: "/dashboard/:log",
            component: Dashboard,
            meta: {
                requiresAuth: true,
                title: "message.dashboard",
                breadcrumb: "Dashboard",
            },
        },
        {
            path: "/profile",
            component: Profile,
            meta: {
                requiresAuth: true,
                title: "message.userProfile",
                breadcrumb: "User Profile",
            },
        },
        {
            path: "/clients",
            component: Client,
            meta: {
                requiresAuth: true,
                title: "message.clients",
                breadcrumb: "Clients",
                icon: "mr-2 zmdi zmdi-case",
            },
        },
        {
            path: "/clients/:id",
            component: ClientOverview,
            meta: {
                requiresAuth: true,
                title: "message.clients",
                breadcrumb: "Clients",
                icon: "mr-2 zmdi zmdi-case",
            },
        },
        {
            path: "/clients/:id/:log",
            component: ClientOverview,
            meta: {
                requiresAuth: true,
                title: "message.clients",
                breadcrumb: "Clients",
                icon: "mr-2 zmdi zmdi-case",
            },
        },
        {
            path: "/users",
            component: User,
            meta: {
                requiresAuth: true,
                title: "message.users",
                breadcrumb: "Users",
                icon: "mr-2 zmdi zmdi-account-circle",
            },
        },
        {
            path: "/users/:id",
            component: UserOverview,
            meta: {
                requiresAuth: true,
                title: "message.users",
                breadcrumb: "Users",
                icon: "mr-2 zmdi zmdi-account-circle",
            },
        },
        {
            path: "/users/:id/:log",
            component: UserOverview,
            meta: {
                requiresAuth: true,
                title: "message.users",
                breadcrumb: "Users",
                icon: "mr-2 zmdi zmdi-account-circle",
            },
        },
        {
            path: "/locations",
            component: Location,
            meta: {
                requiresAuth: true,
                title: "message.locations",
                breadcrumb: "Location",
                icon: "mr-2 zmdi zmdi-pin",
            },
        },
        {
            path: "/locations/:id",
            component: LocationOverview,
            meta: {
                requiresAuth: true,
                title: "message.locations",
                breadcrumb: "Location",
                icon: "mr-2 zmdi zmdi-pin",
            },
        },
        {
            path: "/locations/:id/:log",
            component: LocationOverview,
            meta: {
                requiresAuth: true,
                title: "message.locations",
                breadcrumb: "Location",
                icon: "mr-2 zmdi zmdi-pin",
            },
        },
        {
            path: "/patients",
            component: Patient,
            meta: {
                requiresAuth: true,
                title: "message.patients",
                breadcrumb: "Patient",
                icon: "mr-2 zmdi zmdi-account",
            },
        },
        {
            path: "/patients/:id",
            component: PatientOverview,
            meta: {
                requiresAuth: true,
                title: "message.patients",
                breadcrumb: "Patient",
                icon: "mr-2 zmdi zmdi-account",
            },
        },
        {
            path: "/patients/:id/:log",
            component: PatientOverview,
            meta: {
                requiresAuth: true,
                title: "message.patients",
                breadcrumb: "Patient",
                icon: "mr-2 zmdi zmdi-account",
            },
        },
        {
            path: "/contacts",
            component: Contact,
            meta: {
                requiresAuth: true,
                title: "message.contacts",
                breadcrumb: "Contacts",
            },
        },
        {
            path: "/contacts/:id",
            component: ContactOverview,
            meta: {
                requiresAuth: true,
                title: "message.contacts",
                breadcrumb: "Contacts",
                icon: "mr-2 zmdi zmdi-account-circle",
            },
        },
        {
            path: "/contacts/:id/:log",
            component: ContactOverview,
            meta: {
                requiresAuth: true,
                title: "message.contacts",
                breadcrumb: "Contacts",
                icon: "mr-2 zmdi zmdi-account-circle",
            },
        },
        {
            path: "/alerts",
            component: Alert,
            meta: {
                requiresAuth: true,
                title: "message.alerts",
                breadcrumb: "Alerts",
                icon: "mr-2 zmdi zmdi-notifications",
            },
        },
        {
            path: "/settings",
            component: Settings,
            meta: {
                requiresAuth: true,
                title: "message.settings",
                breadcrumb: "Settings",
                icon: "mr-2 zmdi zmdi-settings",
            },
        },
        {
            path : "/forms",
            component : Forms,
            meta : {
                requiresAuth : true,
                title : "message.forms",
                breadcrumb : "Forms",
                icon : "mr-2 zmdi zmdi-notifications",
            },
        },
        {
            path : "/form-builder",
            component : FormBuilder,
            meta : {
                requiresAuth : true,
                title : "message.form_builder",
                breadcrumb : "Form Builder",
                icon : "mr-2 zmdi zmdi-notifications",
            },
        },
        {
            path : "/form-builder/:id",
            component : FormBuilder,
            meta : {
                requiresAuth : true,
                title : "message.form_builder",
                breadcrumb : "Forms Builder",
                icon : "mr-2 zmdi zmdi-notifications",
            },
        },
        {
            path: "/component-builder",
            component: ComponentBuilder,
            meta: {
                requiresAuth: true,
                title: "message.component_builder",
                breadcrumb: "Component Builder",
                icon: "mr-2 zmdi zmdi-notifications",
            },
        },
        {
            path: "/component-builder/:id",
            component: ComponentBuilder,
            meta: {
                requiresAuth: true,
                title: "message.component_builder",
                breadcrumb: "Component Builder",
                icon: "mr-2 zmdi zmdi-notifications",
            },
        },
        {
            path: "/chat",
            component: Chat,
            meta: {
                requiresAuth: true,
                title: "Chat",
                breadcrumb: "Chat",
                icon: "mr-2 zmdi zmdi-comments",
            },
        },
        {
            path: "/chat/:type",
            component: Chat,
            meta: {
                requiresAuth: true,
                title: "Chat",
                breadcrumb: "Chat",
                icon: "mr-2 zmdi zmdi-comments",
            },
        },
        {
            path: "/chat/:type/:id",
            component: Chat,
            meta: {
                requiresAuth: true,
                title: "Chat",
                breadcrumb: "Chat",
                icon: "mr-2 zmdi zmdi-comments",
            },
        },
    ],
};
