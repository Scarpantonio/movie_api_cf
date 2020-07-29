import React, { useState } from "react";

// La primera variable el estado inicial
// La segunda variable es el metodo que cambia el estado inicial. "useState(0) le daria un estado inicial de cero a la primera variable."

export function Loginview(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // #3 cuando mandamos la forma enviamos el la info del usuario a main-view a nuestro parent component. y nuestro parant component, corre el render y se pregunta, if(!user) en este caso si lo tenemos y se ejecuta la vista de moviecard. es asi como funciona la interaccion entre el componente principal y los otros componentes.
  const handleSubmit = e => {
    e.preventDefault();

    console.log(username, password);
    // props.onLoggedIn(username);
    /* Send a request to the server for authentication */
    /* then call props.onLoggedIn(username) */
  };

  //we set value=username y depsues actualizamos ese valor con onchange.
  // preguntar Jay, why does value has the value of(username)
  // leer #1 const [variable/ contains inial State, function/change that state when executed]
  // then #2 en input, we set value={name} as the initial state, onChange{setUsername...} is the method executed when onchange is activated/ "when info is being input in input"
  return (
    <form>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
        ></input>
      </label>
      <label>
        Password:
        <input
          type="text"
          value={password}
          onChange={e => setPassword(e.target.value)}
        ></input>
      </label>
      <button type="text" onClick={handleSubmit}>
        Submit
      </button>
    </form>
  );
}
