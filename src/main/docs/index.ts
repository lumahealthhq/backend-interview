import paths from "./paths";
import schemas from "./schemas";
import components from "./components";

export default {
  openapi: "3.0.0",
  info: {
    title: "Luma Health - Test Assessment",
    version: "1.0.0",
    contact: {
      name: "Laian Braum",
      email: "braumlaian@gmail.com",
      url: "https://www.linkedin.com/in/laianbraum",
    },
  },
  servers: [
    {
      url: "/api",
      description: "Main",
    },
  ],
  paths,
  schemas,
  components,
};
