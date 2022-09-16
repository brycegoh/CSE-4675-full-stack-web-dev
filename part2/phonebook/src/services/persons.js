import axios from "axios";

const getAllPersons = () => axios.get("http://localhost:3001/persons");
const createNewPerson = (newName, newNumber) =>
  axios.post("http://localhost:3001/persons", {
    name: newName,
    number: newNumber,
  });

const deletePerson = (id) =>
  axios.delete(`http://localhost:3001/persons/${id}`);

const updatePerson = (id, name, number) =>
  axios.put(`http://localhost:3001/persons/${id}`, {
    name: name,
    number: number,
  });

export default {
  getAllPersons: getAllPersons,
  createNewPerson: createNewPerson,
  deletePerson: deletePerson,
  updatePerson: updatePerson,
};
