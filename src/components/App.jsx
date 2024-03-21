import "./App.css";
import { useEffect, useState } from "react";
import ErrorPage from "./ErrorPage";
import Pinniped from "../../../Pinniped-sdk/src/Pinniped";
// import Pinniped from "pinniped-sdk";
const pnpd = Pinniped("http://localhost:3000");
const SEALS_ID = "a49e125a8fa57f";

function App() {
  const [error, setError] = useState("");
  const [seals, setSeals] = useState([]);

  const [updateSealType, setUpdateSealType] = useState("");
  const [updateSealSize, setUpdateSealSize] = useState("");
  const [updateSealId, setUpdateSealId] = useState("");

  const [type, setType] = useState("");
  const [size, setSize] = useState("");

  const [user, setUser] = useState("");

  const getAllHandler = async () => {
    try {
      //Get all rows from the seals table
      const response = await pnpd.db.getAll(SEALS_ID);
      setSeals(response.data.rows);

      //get current user
      const userResponse = await pnpd.auth.getUser();
      if (userResponse.data.user) setUser(userResponse.data.user.username);
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  useEffect(() => {
    getAllHandler();
  }, [user]);

  const registerHandler = async () => {
    try {
      const response = await pnpd.auth.register("test", "password");
      console.log(response.data);
    } catch (error) {
      alert(JSON.stringify(error.message));
    }
  };

  const loginHandlerFrodo = async () => {
    try {
      const response = await pnpd.auth.login("frodo", "password");

      setUser(response.data.user.username);

      console.log(response.data);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  const loginHandlerBilbo = async () => {
    try {
      const response = await pnpd.auth.login("bilbo", "password");

      setUser(response.data.user.username);

      console.log(response.data);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  const logoutHandler = async () => {
    try {
      const response = await pnpd.auth.logout();

      setUser("");

      console.log(response.data);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  const getOneHandler = async () => {
    try {
      const response = await pnpd.db.getOne(SEALS_ID, seals[0].id);
      console.log(response.data.row[0]);
      setUpdateSealType(response.data.row[0].type);
      setUpdateSealSize(response.data.row[0].size);
      setUpdateSealId(response.data.row[0].id);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  const createOneHandler = async (e) => {
    e.preventDefault();
    //Create One
    try {
      const response = await pnpd.db.createOne(SEALS_ID, { type, size });
      console.log(response.data);
      getAllHandler();
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  const updateOneHandler = async (e) => {
    e.preventDefault();
    //Update One
    try {
      const response = await pnpd.db.updateOne(SEALS_ID, updateSealId, {
        type: updateSealType,
        size: updateSealSize,
      });
      console.log(response.data);
      getAllHandler();
      clearHandler();
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  const deleteOneHandler = async (e) => {
    e.preventDefault();
    //Delete One
    try {
      const response = await pnpd.db.deleteOne(SEALS_ID, updateSealId);
      console.log(response.data);
      getAllHandler();
      clearHandler();
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  const clearHandler = (e) => {
    if (e) e.preventDefault();
    setUpdateSealType("");
    setUpdateSealSize("");
    setUpdateSealId("");
  };

  const selectHandler = (seal) => {
    setUpdateSealType(seal.type);
    setUpdateSealSize(seal.size);
    setUpdateSealId(seal.id);
  };

  const sessionHandler = async () => {
    //Session
    try {
      const response = await pnpd.auth.getUser();

      setUser(response.data.user.username);

      console.log(response.data);
    } catch (error) {
      alert(JSON.stringify(error));
    }
  };

  if (error) {
    return (
      <ErrorPage error={error} loginHander={loginHandlerBilbo}></ErrorPage>
    );
  }

  return (
    <div>
      <h2>Seal Management</h2>
      <h3>User: {user}</h3>

      <button onClick={loginHandlerFrodo}>Login Frodo</button>
      <button onClick={loginHandlerBilbo}>Login Bilbo</button>
      <button onClick={logoutHandler}>Logout</button>
      <button onClick={getOneHandler}>Get a random Seal</button>

      {updateSealId && (
        <>
          <h3>Your Selected Seal</h3>
          <form onSubmit={updateOneHandler}>
            <label>
              Type:
              <input
                type="text"
                value={updateSealType}
                onChange={(e) => setUpdateSealType(e.target.value)}
                placeholder="Type"
              />
            </label>
            <label>
              Size:
              <input
                type="text"
                value={updateSealSize}
                onChange={(e) => setUpdateSealSize(e.target.value)}
                placeholder="Size"
              />
            </label>
            <button type="submit">Update</button>
            <button onClick={clearHandler}>Clear</button>
            <button onClick={deleteOneHandler}>Delete</button>
          </form>
        </>
      )}

      <h3>All the Seals</h3>
      {seals &&
        seals.map((seal) => {
          return (
            <div key={seal.id}>
              <span>
                Type: {seal.type} | Size: {seal.size} | Creator:{" "}
                {seal.creatorId}
              </span>
              <button onClick={() => selectHandler(seal)}>Select</button>
            </div>
          );
        })}
      <h3>Add a New Seal</h3>
      <form onSubmit={createOneHandler}>
        <label>
          Type:
          <input
            type="text"
            value={type}
            onChange={(e) => setType(e.target.value)}
            placeholder="Type"
          />
        </label>
        <label>
          Size:
          <input
            type="text"
            value={size}
            onChange={(e) => setSize(e.target.value)}
            placeholder="Size"
          />
        </label>
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default App;
