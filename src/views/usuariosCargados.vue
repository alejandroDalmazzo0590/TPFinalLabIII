<template>
    <div class="general">
    <div>
      <h2>Usuarios Cargados:</h2>
      <ul>
        <li v-for="usuario in usuarios" :key="usuario.idDeUsuario">
          {{ usuario.Nombre }} {{ usuario.Apellido }} (ID: {{ usuario.idDeUsuario }})
        </li>
      </ul>
    </div>
    <footer>
      <p> © 2024 - alejandro.dalmazzo@gmail.com - cel 3564-331134 - Todos los derechos reservados.</p>
    </footer>
    </div>
    
    
  </template>
  
  <script>
  import { mapState } from 'vuex';
  
  export default {
    computed: {
      ...mapState(["usuarios"]),
    },
  };
  </script>

  <style>

.general {
  width: 1200px;
  height: 400px;
  display: grid;
  grid:
    "header" auto
    "main" 1fr
    / 1fr;
  gap: 0px;
  justify-items: center;
  align-items: center;
  background-image: linear-gradient(45deg, #a2a7e9, #c4baf3, #916d31 );
}  

footer {
  background-color: rgb(21, 111, 247);
  color: white;
  text-align: center;
  padding: 5px 0;
  width: 100%;
  bottom: 0;
  margin-top: auto;
  font-size: 10px;
  padding: 5px 0;
}

  footer p {
  font-size: 10px;
  margin: 0;
}

  

  .titulo {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  font-family: "Roboto Condensed", sans-serif;
  font-size: 100%;
  color: #040b53;
  padding-top: 3%;
  width: 90%;
  border-radius: 20px;
  grid-area: header;
}
p {
  color: rgb(0, 0, 0);
  display: flex;
  justify-content: center;
}

.mensaje-validacion {
  color: rgb(245, 9, 9);
  font-size: 18px;
  margin-top: 2px;
  font-weight: bold;
}
.registrarUsuario{
width: 60%;
height: 100%;
padding: 0%;
display: flex;
flex-direction: column; 
align-items: center;
border-radius: 15px;
grid-area: main;
}



  </style>