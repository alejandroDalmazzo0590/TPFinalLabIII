<template>
    <div class="general">
      <div class="titulo">
        <h1>Para continuar, debe registrarse en DALMAZZO INVERSIONES</h1>
        <p>Y podrás conocer todo acerca de cómo operar en la Blockchain!!!</p>
        <h2>Completando el siguiente formulario se generará un TOKEN único, que utilizarás para realizar las operaciones, gracias por confiar en nosotros!!!</h2>
      </div>
    <div class="registrarUsuario">
      <input v-model="Nombre" type="text" placeholder="Nombre" @input="validarCampoPorLetras('Nombre')">
      <p v-if="!esCampoValido('Nombre')" class="mensaje-validacion">Solo puede contener letras.</p>
      <input v-model="Apellido" type="text" placeholder="Apellido" @input="validarCampoPorLetras('Apellido')">
      <p v-if="!esCampoValido('Apellido')" class="mensaje-validacion">Solo puede contener letras.</p>
      <button @click="generarIdDeUsuario" :disabled="idCopiada || !ValidacionNombre" :class="{ 'copiado': idCopiada }" >
        {{ idCopiada ? '✔' : 'Generar TOKEN de usuario' }}
      </button>
      <p v-if="idDeUsuario">TOKEN de usuario generado: {{ idDeUsuario }}</p> 
    </div>
    <footer>
      <p> © 2024 - alejandro.dalmazzo@gmail.com - cel 3564-331134 - Todos los derechos reservados.</p>
    </footer>
  </div>
  
  </template>
  
  <script>
  import { mapMutations, mapState } from 'vuex';
  //Para  acceso usuario, usamos MapState
  export default {
    data() {
      return {
        Nombre: "",
        Apellido: "",
        idDeUsuario: "",
        idCopiada: false, 
        idsGeneradas: new Set(), 
        camposValidos: {
        Nombre: true,
        Apellido: true,
        },
      };
    },
  
    methods: {
      validarCampoPorLetras(campoAValidar) { 
        const texto = this[campoAValidar].trim();
        const valoresValidos = /^[A-Za-z]+$/;
        this.camposValidos[campoAValidar] = texto !== '' && valoresValidos.test(texto);
      },
  
      esCampoValido(campo) {
        return this.camposValidos[campo];
      },
  
      generarIdAleatorio() {
        const caracteres = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789¡?!¿";
        let idGenerada = "";
        for (let i = 0; i < 10; i++) {
          idGenerada += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return idGenerada;
      },
  
      generarIdUnica() {
        let idNueva = this.generarIdAleatorio();
        while (this.idsGeneradas.has(idNueva)) {
          idNueva = this.generarIdAleatorio();
        }
        return idNueva;
      },
  
      generarIdDeUsuario() {
    const idNueva = this.generarIdUnica();
    localStorage.setItem('idDeUsuario', idNueva);
    this.idsGeneradas.add(idNueva);
    this.idDeUsuario = idNueva;
    const nuevoUsuario = {
      Nombre: this.Nombre,
      Apellido: this.Apellido,
      idDeUsuario: this.idDeUsuario,
    };
    this.copiarId();
    this.idCopiada = true;
    this.agregarUsuario(nuevoUsuario);
    
  },
  
      copiarId() {
    const idACopiar = this.idDeUsuario;
    navigator.clipboard.writeText(idACopiar) 
      .catch((error) => {
        console.error('Error al copiar el ID:', error);
      });
  },
      ...mapMutations(['agregarUsuario']), 
      
    },
    computed: {
      ...mapState(["usuarios"]),
      ValidacionNombre() { 
        return this.esCampoValido('Nombre') && this.esCampoValido('Apellido') && this.Nombre.trim() !== '' && this.Apellido.trim() !== '';
      },
    },
  };
  </script>
  