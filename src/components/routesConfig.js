export const roleRoutes = {
  admin: [
    { path: "/dashboard", component: "Dashboard" },
    { path: "/add-projects", component: "AddProjects" },
    { path: "/add-users", component: "AddUsers" },
  ],
  designer: [
    { path: "/dashboard", component: "Dashboard" },
    { path: "/projects", component: "Projects" },
    { path: "/rfi", component: "RFI" },
  ],
  client: [
    { path: "/dashboard", component: "Dashboard" },
    { path: "/projects", component: "Projects" },
  ],
  expert: [
    { path: "/dashboard", component: "Dashboard" },
    { path: "/projects", component: "Projects" },
  ],
};
