<template>
    <div class = "general">
      <div>
        <h2>Historial de OPERACIONES</h2>
            <div v-if="movimientos.length === 0">
              <p>No se encontraron operaciones.</p>
            </div>
            <div v-else>
            <table>
              <thead>
                <tr>
                  <th>Cripto</th>
                  <th>Cant</th>
                  <th>Monto</th>
                  <th>Tipo</th>
                  <th>Fecha / Hora</th>
                  <th>Opciones</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="movimiento in movimientos" :key="movimiento._id">
                  <td>{{ movimiento.crypto_code }}</td>
                  <td>{{ movimiento.crypto_amount }}</td>
                  <td>{{ movimiento.money }}</td>
                  <td>{{ movimiento.action === 'purchase' ? 'Compra' : 'Venta' }}</td>
                  <td>{{ movimiento.datetime }}</td>
                  <td>
                    <button @click="abrirFormularioEditar(movimiento)">Editar</button>
                    <button @click="borrarMovimiento(movimiento._id)">Borrar</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      <div>
        <input v-model="nuevaId" type="text" placeholder="Ingrese su TOKEN usuario" @input="verificarId">
        <p v-if="debeMostrarError" class="alerta">ID incorrecto / sin registros para mostrar.</p>
        <button @click="verificarMovimientosRegistrados">Buscar</button>
      </div>
    
      <div v-if="mostrandoEdicionDeFormulario">
        <h3>Editar operacion</h3>
        <div>
          <label>Dinero Invertido: </label>
          <input v-model="nuevoMonto" type="number" step="0.01">
        </div>
        <div>
          <label>Cantidad de Criptomoneda: </label>
          <input v-model="edicionDelMovimiento.crypto_amount" type="number" step="0.0001">
        </div>
        <div>
          <button @click="guardarEdicionMovimiento">Guardar</button>
          <button @click="cancelarEdicionMovimiento">Cancelar</button>
        </div>
      </div>
      <footer>
      <p> © 2024 - alejandro.dalmazzo@gmail.com - cel 3564-331134 - Todos los derechos reservados.</p>
    </footer>
    </div>
    </template>
    
    <script>
    import axios from 'axios';
    import { mapState } from 'vuex';
    export default {
      data() {
        return {
          movimientos: [],
          nuevaId: '',
          debeMostrarError: false,
          mostrandoEdicionDeFormulario: false,
          edicionDelMovimiento: {
            money: '',
            crypto_amount: '',
          },
          id: '',
          nuevoMonto: '',
        };
      },
    
    
      created() {
        const idDeUsuario = localStorage.getItem('idDeUsuario');
        if (idDeUsuario) {
          this.verificarMovimientosRegistrados(idDeUsuario);
        }
      },
    
    
      computed: {
        ...mapState(['usuarios']),
      },
    
    
      methods: {
        
        ApiClient() {
            return axios.create({
              baseURL: 'https://laboratorio3-f36a.restdb.io/rest/',
              headers: {
                'x-apikey': '60eb09146661365596af552f',
              },
            });
          },
    
        verificarMovimientosRegistrados() {
          const idDeUsuario = this.nuevaId || localStorage.getItem('idDeUsuario');
          const url = `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id":"${idDeUsuario}"}`;
          const apiClient = this.ApiClient();
    
          apiClient
            .get(url)
            .then(response => {
              this.movimientos = response.data;
              if (this.movimientos.length === 0) {
                console.log('No se encontraron movimientos registrados.');
              } else {
                console.log('Existen movimientos registrados.');
              }
            })
            .catch(error => {
              console.error('Error al obtener las operaciones:', error);
            });
        },
    
        abrirFormularioEditar(movimiento) {
          console.log("Formulario de edición")
          this.mostrandoEdicionDeFormulario = true;
          this.edicionDelMovimiento = {...movimiento};
          this.nuevoMonto
        },
    
        async guardarEdicionMovimiento() {
          if (!this.edicionDelMovimiento || !this.nuevoMonto) return;
    
          const apiClient = this.ApiClient();
            try {
              console.log(this.edicionDelMovimiento._id);
        const response = await apiClient.patch(`/transactions/${this.edicionDelMovimiento._id}`, {
          money: this.nuevoMonto,
          crypto_amount: this.edicionDelMovimiento.crypto_amount,
        });
        console.log("operacion editada y guardado")
        console.log(response);
    
        this.verificarMovimientosRegistrados();
        this.cancelarEdicionMovimiento();
      } catch (error) {
        console.error("Error al guardar la edición del movimiento: ", error);
      }
    },
    
    cancelarEdicionMovimiento() {
      this.mostrandoEdicionDeFormulario = false;
      this.edicionDelMovimiento = null;
      this.nuevoMonto = '';
      console.log("Formulario cerrado")
    },
    
      async borrarMovimiento(id) {
        try {
          const apiClient = this.ApiClient();
          if (!apiClient) return;
    
          const response = await apiClient.delete(`/transactions/${id}`);
          console.log("operacion borrada");  
          this.movimientos = this.movimientos.filter(movimiento => movimiento._id !== id);  
          return response.data;
    
    
        } catch (error) {
          console.error("Error al borrar la operacion", error);
        }
      },
    
        ocultarEdicionDeFormulario() {
          this.mostrandoEdicionDeFormulario = false; 
        },
        
      },
    };
    </script>