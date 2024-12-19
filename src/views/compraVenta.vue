<template>
    <div class = "general">
      <div>
        <h1>Ingrese su TOKEN para poder operar en DALMAZZO INVERSIONES.</h1>
        <h2>Una vez iniciada su sesión, podrá realizar operaciones.</h2>
        <input v-model="idDeUsuario" type="text" placeholder="TOKEN de usuario" @input="Idcorrecta">
          <p v-if="debeMostrarError">TOKEN incorrecto. No podrá iniciar sesión intente nuevamente con un TOKEN valido.</p>
      </div>  
            <div v-if="sesionIniciada" class="recuadroBienvenida">
                <h2>Bienvenid@, {{ obtenerNombre() }}</h2>
                <h3>¿Qué operación te gustaria realizar?</h3>
              <div class="seccionCompra">
                  <label class="texto">Tipo de operación:</label>
                  <select v-model="tipoDeOperacion">
                  <option value="comprar">Comprar</option>
                  <option value="vender">Vender</option>
                  </select>
              </div>
    
              <div class="seccionCompra">
                <label class="texto">Criptomoneda:</label>
                <select v-model="criptomonedaSeleccionada">
                <option v-for="criptomoneda in criptomonedas" :key="criptomoneda.id" :value="criptomoneda.id">{{ criptomoneda.name }}</option>
                </select>
              </div>
              <div class="seccionCompra">
                <label class="texto">Cantidad:</label>
                <input v-model="cantidad" type="number" step="0.1" min="0.000001" @change="calcularMonto">
              </div>
              <div class="seccionCompra">
                <label class="texto">Monto a pagar:</label>
                <input type="number" readonly :value="montoActualizado">         
              </div>
              <div>
              <button @click="guardarTransaccion" :disabled="!datosValidos || (tipoDeOperacion === 'vender' && !puedeVender) || bloquearBoton">Guardar</button>
              </div>
            </div>
        
    
          
  
        <div v-if="compraRealizada">
            <h3>Compra Realizada</h3>
            <p>Fecha y Hora: {{ compraActual.fechaHora }}</p>
            <p>Criptomoneda: {{ compraActual.criptomoneda }}</p>
            <p>Cantidad: {{ compraActual.cantidad }}</p>
            <p>Monto: ${{ compraActual.monto }}</p>
        </div>
        <div v-if="ventaRealizada">
          <h3>Venta Realizada</h3>
          <p>Fecha y Hora: {{ ventaActual.fechaHora }}</p>
          <p>Criptomoneda: {{ ventaActual.criptomoneda }}</p>
          <p>Cantidad: {{ ventaActual.cantidad }}</p>
          <p>Monto: ${{ ventaActual.monto }}</p>
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
          idDeUsuario: '',
          debeMostrarError: false,
          criptomonedaSeleccionada: '',
          cantidad: 0,
          fechaHora: '',
          monto: 0,
          precios: {},
    
          compraRealizada: false,
          ventaRealizada: false,
          tipoDeOperacion: 'comprar',
          compraActual: {
            fechaHora: '',
            criptomoneda: '',
            cantidad: '',
            monto: '',
            tipoDeOperacion: 'comprar',
          },
          ventaActual: {
            fechaHora: '',
            criptomoneda: '',
            cantidad: '',
            monto: '',
            tipoDeOperacion: 'vender',
          },
          puedeVender: false,
          bloquearBoton: false,
          contadorCriptomonedas: {},
        };
      },
    
      methods: {
        mounted() {
      
      if (localStorage.getItem('contadorCriptomonedas')) {
        this.contadorCriptomonedas = JSON.parse(localStorage.getItem('contadorCriptomonedas'));
      }
    },
  
    ApiClient() {
          return axios.create({
            baseURL: 'https://laboratorio3-f36a.restdb.io/rest/',
            headers: {
              'x-apikey': '60eb09146661365596af552f',
            },
          });
        },
  
        obtenerNombre() {
          const usuario = this.usuarios.find((usuario) => usuario.idDeUsuario === this.idDeUsuario);
          return usuario ? `${usuario.Nombre} ${usuario.Apellido}` : '';
        },
    
        calcularMonto() {
          const criptomoneda = this.criptomonedas.find((c) => c.id === this.criptomonedaSeleccionada);
          if (criptomoneda) {
            const url = `https://criptoya.com/api/argenbtc/${criptomoneda.id}/ars/${this.cantidad}`;
            const action = this.tipoDeOperacion === 'comprar' ? 'ask' : 'bid';
    
            axios
              .get(url)
              .then((response) => {
                const precioARS = response.data[action];
                this.precios[criptomoneda.id] = precioARS;
                this.monto = (this.cantidad * precioARS).toFixed(2);
              })
              .catch((error) => {
                console.error('Error al obtener el monto en pesos (ARG): ', error);
              });
          }
        },
    
        Idcorrecta() {
          const idValida = this.usuarios.some((usuario) => usuario.idDeUsuario === this.idDeUsuario);
          const cantindaddedigitos = this.idDeUsuario.length === 10;
          this.debeMostrarError = !idValida && cantindaddedigitos;
          if (this.sesionIniciada) {
            this.verificarCantidadCriptomonedas();
          }
        },
    
        guardarTransaccion() {
          const nuevaTransaccion = {
            user_id: this.idDeUsuario,
            action: this.tipoDeOperacion === 'comprar' ? 'purchase' : 'sale',
            crypto_code: this.criptomonedaSeleccionada,
            crypto_amount: this.cantidad.toString(),
            money: this.monto.toString(),
            datetime: this.fechaHoraActual(),
          };
    
          axios
            .post('https://laboratorio3-f36a.restdb.io/rest/transactions', nuevaTransaccion, {
              headers: {
                'x-apikey': '60eb09146661365596af552f',
              },
            })
            .then((response) => {
              console.log('Operación exitosa:', response.data);
    
              if (nuevaTransaccion.action === 'purchase') {
                // compra
                this.compraActual.fechaHora = this.fechaHoraActual();
                this.compraActual.criptomoneda = this.obtenerNombreCriptomoneda();
                this.compraActual.cantidad = this.cantidad;
                this.compraActual.monto = this.monto;
                this.compraRealizada = true;
                if (!this.contadorCriptomonedas[this.criptomonedaSeleccionada]) {
                  this.contadorCriptomonedas[this.criptomonedaSeleccionada] = 0;
                }
                this.contadorCriptomonedas[this.criptomonedaSeleccionada] += this.cantidad;
              } else if (nuevaTransaccion.action === 'sale') {
                // venta
                this.ventaActual.fechaHora = this.fechaHoraActual();
                this.ventaActual.criptomoneda = this.obtenerNombreCriptomoneda();
                this.ventaActual.cantidad = this.cantidad;
                this.ventaActual.monto = this.monto;
                this.ventaRealizada = true;
    
                
                this.contadorCriptomonedas[this.criptomonedaSeleccionada] -= this.cantidad; 
              }
              this.bloquearBoton = true;
              this.verificarCantidadCriptomonedas();
              this.resetearFormulario();
            })
            .catch((error) => {
              console.error('Error al guardar la transacción:', error);
            });
        },
  
  
        resetearFormulario() {
          this.criptomonedaSeleccionada = '';
          this.cantidad = 0;
          this.fechaHora = this.fechaHoraActual();
          this.monto = 0;
        },
    
        obtenerNombreCriptomoneda() {
          const criptomoneda = this.criptomonedas.find((c) => c.id === this.criptomonedaSeleccionada);
          return criptomoneda ? criptomoneda.name : '';
        },
    
        fechaHoraActual() {
          const now = new Date();
          const year = now.getFullYear();
          const month = `${now.getMonth() + 1}`.padStart(2, '0');
          const day = `${now.getDate()}`.padStart(2, '0');
          const hour = `${now.getHours()}`.padStart(2, '0');
          const minute = `${now.getMinutes()}`.padStart(2, '0');
          return `${year}-${month}-${day}  ${hour}:${minute}`;
        },
    
        verificarCantidadCriptomonedas() {
      const idDeUsuario = this.idDeUsuario;
      const codigoCriptomoneda = this.criptomonedaSeleccionada;
  
      const url = `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id":"${idDeUsuario}","crypto_code":"${codigoCriptomoneda}"}`;
      const apiClient = this.ApiClient();
    
      apiClient
        .get(url)
        .then((response) => {
          const movimientosCriptomoneda = response.data;
          let cantidadComprada = 0;
          let cantidadVendida = 0;
          let cantidadDisponible = 0;
    
          for (const movimiento of movimientosCriptomoneda) {
            if (movimiento.action === 'purchase') {
              cantidadComprada += parseFloat(movimiento.crypto_amount);
            } else if (movimiento.action === 'sale') {
              cantidadVendida += parseFloat(movimiento.crypto_amount);
            }
          }
    
          const contadorCriptomonedas = this.contadorCriptomonedas[this.criptomonedaSeleccionada] || 0;
          cantidadComprada += contadorCriptomonedas;
          cantidadDisponible = cantidadComprada - cantidadVendida;
    
          this.puedeVender = cantidadDisponible >= 0 && this.cantidad > 0 && this.cantidad <= cantidadDisponible;
          if (this.tipoDeOperacion === 'comprar') {
            // siempre se puede comprar.
            this.puedeVender = true;
          } else if (this.tipoDeOperacion === 'vender' && this.cantidad > this.contadorCriptomonedas[this.criptomonedaSeleccionada]) {
            this.puedeVender = this.cantidad <= cantidadDisponible;
            this.puedeVender ? null : console.log("No puede realizar la venta. No tiene las criptomonedas")
          }
  
          localStorage.setItem('contadorCriptomonedas', JSON.stringify(this.contadorCriptomonedas));
          this.bloquearBoton = false; // Desbloque boton luego de verificar
        })
        .catch((error) => {
          console.error('Error al obtener la cantidad de criptomonedas:', error);
        });
    },
  },
  
    
      computed: {
        ...mapState(['usuarios']),
        sesionIniciada() {
          return this.idDeUsuario !== '' && this.esIdValida;
        },
    
        esIdValida() {
          return this.usuarios.some((usuario) => usuario.idDeUsuario === this.idDeUsuario);
        },
    
        criptomonedas() {
          return [
            { id: 'btc', name: 'Bitcoin' },
            { id: 'eth', name: 'Ethereum' },
            { id: 'usdt', name: 'USDT' },
            
          ];
        },
    
        datosValidos() {
          return (
            this.criptomonedaSeleccionada !== '' &&
            this.cantidad > 0 &&
            this.monto >= 0
          );
        },
    
        montoActualizado() {
          const criptomoneda = this.criptomonedas.find((c) => c.id === this.criptomonedaSeleccionada);
          if (criptomoneda) {
            const precioARS = this.precios[criptomoneda.id];
            return (this.cantidad * precioARS).toFixed(2);
          } else {
            return 0;
          }
        },
      },
    
      watch: {
        cantidad: {
          handler() {
            this.calcularMonto();
            this.verificarCantidadCriptomonedas();
          },
          immediate: true,
        },
      },
    };
    </script>

<style scoped>

  
  .recuadroBienvenida {
    background-color: #689eaf;
    border: 1px solid rgb(112, 97, 97);
    width: 80%; 
    height: 80%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    font-family: "Roboto Condensed", sans-serif;
    color: #000000;
    padding: 2%;
    border-radius: 20px;
    grid-area: main;
    margin: 5px;
    position: relative;
  }
  
  .seccionCompra {
    display: flex;
    margin-bottom: 10px;
  }
  
  .seccionCompra .texto{
    margin-right: 10px;
    font-size: 18px;
    width: 15%; 
  }
  
  
  .seccionComprar p {
    margin-right: 10px; 
    font-size: 18px;
    width: 100%;
  }
  
  .seccionCompra input,
  .seccionCompra select {
    flex: 1;
    height: 40px;
    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 5px;
    font-size: 16px;
  }
  

  .mostrarCompra {
    background-image: linear-gradient(45deg, #A48754, #E8B174, #916d31 );
    height: 80%;
    width: 90%;
    border: 1px inset black;
    border-radius: 5px;
    padding: 5%;
    font-size: 16px;
    margin-top: 50px;
  }

  </style>