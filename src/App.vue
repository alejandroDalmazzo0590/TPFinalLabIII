<template>
  <img src="./assets/logo.png" class="logo">
  <nav>
    <router-link class="encabezado" to="/">Registrarse</router-link> |
    <router-link class= "encabezado" to="/usuarios">Usuarios Cargados</router-link> |
    <router-link class= "encabezado" to="/nuevaoperacion">Compra y Venta de criptomonedas</router-link> |
    <router-link class= "encabezado" to="/historial">Historial de operaciones</router-link> |
    <router-link class= "encabezado" to="/Analisis">Analisis Financiero</router-link> |
  </nav>
  <router-view/>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
.logo {
  width: 10%;
  margin-left: -4%;
}
.encabezado{
  transform: scale(1.01);
  margin: 0 5px; 
  padding: 5px 5px;
}
</style>
