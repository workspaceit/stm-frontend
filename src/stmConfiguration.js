const stmConfig = {
  apiBaseUrl: "http://58.84.34.65:8585",
  route: {
    home: "/",
    login: "/login",
    logout: "/logout",
    about: "/about",
    contact: "/contact",
    registration: "/registration",
    dashboard: "/dashboard",
    projects: "/dashboard/projects",
    tasks: "/dashboard/tasks",
    tasklist: "/dashboard/tasklist",
    createorganizations: "/dashboard/create-organizations",
    detailsOrganization: "/dashboard/organizations-details",
    editOrganization: "/dashboard/edit-organizations",
    listOrganization: "/dashboard/list-organization",
    members: "/dashboard/members",
    createProject: "/dashboard/projects/create",
    editProject: "/dashboard/projects/edit",
    projectTasks: "/dashboard/projects/tasks",
    createTask: "/dashboard/projects/tasks/create",
    taskDetails: "/dashboard/projects/tasks/details"
  },
  auth: {
    accessToken: null,
    clientId: "MlpLTvpYwdg4HMI7prTnp1QNbBcvRXce1eRaaCsb",
    clientSecret:
      "eHEpL8dEHau1CABzM7GVswF6FZJTCbVQEMTZ87CjlS7op9RMUSj3KP8XnKaLS2cUcErT1uYpqvs6GCeXe4SkqytRphXmHmF6NsC7hHyCVmW8T1CgRrtRnITiJgZCacEh"
  },
  user: {
    uid: null,
    name: "",
    org: {
      id: null,
      name: null,
      slug: null
    }
  },
  methods: {
    destroyCredentials: function() {
      localStorage.removeItem("stm_access_token");
      stmConfig.auth.accessToken = null;
      stmConfig.user = {
        uid: null,
        org: {
          id: null,
          name: null,
          slug: null
        }
      };
    },

    sleep: function(time) {
      return new Promise(resolve => setTimeout(resolve, time));
    }
  }
};

export default stmConfig;