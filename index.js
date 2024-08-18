import CreatePatientPriorityListFacade from "./src/facades/CreatePatientPriorityListFacade.js";

const createPatientPriorityListFacade = new CreatePatientPriorityListFacade()
const createPatientPriorityList = createPatientPriorityListFacade.create

export { createPatientPriorityList }