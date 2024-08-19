import patientsRoutes from "./presentation/patients/patients.routes";

// Here is where we can add other routes
const routes = [
  ...patientsRoutes,
]

const apiRoutes = routes.map(route => ({ ...route, url: `/api/v1${route.url}` }))

export default apiRoutes
