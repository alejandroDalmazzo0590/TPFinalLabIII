<template>
    <div class="general">
      <h1>Portafolio de Inversiones</h1>
        <div v-if="resumenCriptomonedas.length === 0">
          <p>No posees criptomonedas.</p>
        </div>
  
        <div v-else>
          <table>
            <thead>
              <tr>
                <th>Criptomoneda</th>
                <th>Compra</th>
                <th>Cantidad de Compra</th>
                <th>Venta</th>
                <th>Cantidad vendida</th>
                <th>Saldo</th>
                <th>Criptomonedas Disponibles</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="resumen in resumenCriptomonedas" :key="resumen.idCriptomoneda">
                <td>{{ obtenerNombreCripto(resumen.idCriptomoneda) }}</td>
                <td>{{ formatearValor(resumen.comprado) }}</td>
                <td>{{ resumen.cantidadComprada }}</td>
                <td>{{ formatearValor(resumen.vendido) }}</td>
                <td>{{ resumen.cantidadVendida }}</td>
                <td>{{ formatearValor(resumen.resultado) }}</td>
                <td>{{ resumen.cantidadDisponible }}</td>
              </tr>
            </tbody>
          </table>
                <h3>Resultado total de su cartera de inversiones</h3>
                <p>{{ formatearValor(resumenTotal) }}</p>
        
                
      <h3>Gráfico de Criptomonedas</h3>
      <div class="general">
      <div v-if="chartData.labels.length === 0">
      <p>Cargando datos del gráfico...</p>
      </div>
      <BarChart
      v-else
      :chart-data="chartData"
      :chart-options="chartOptions"
      />
      </div>
        </div>
        <footer>
  <p> © 2024 - alejandro.dalmazzo@gmail.com - cel 3564-331134 - Todos los derechos reservados.</p>
</footer>
    </div>
  </template>
 
 <script>
import axios from "axios";
import { Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";

// Registrar los elementos de Chart.js
ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

export default {
  components: {
    BarChart: Bar,
  },
  data() {
  return{
    resumenCriptomonedas: [],
    resumenTotal: 0,
    criptomonedas: {},
    chartData: {
      labels: [], // Siempre un array
      datasets: [
        {
          label: "Saldo",
          backgroundColor: "#42A5F5",
          data: [], // Siempre un array
        },
        {
          label: "Cantidad Disponible",
          backgroundColor: "#66BB6A",
          data: [], // Siempre un array
        },
      ],
    },
    chartOptions: {
      responsive: true,
      maintainAspectRatio: false,
    },
  };
},

  created() {
    this.obtenerEstadoActual();
  },
  
  methods: {
    listadoCriptomonedas() {
      return [
        { id: "btc", name: "Bitcoin" },
        { id: "eth", name: "Ethereum" },
        { id: "usdt", name: "USDT" },
      ];
    },
    formatearValor(num) {
      return Number(num).toLocaleString("es-AR", {
        style: "currency",
        currency: "ARS",
      });
    },
    obtenerNombreCripto(id) {
      const crypto = this.listadoCriptomonedas().find((c) => c.id === id);
      return crypto ? crypto.name : id;
    },
    obtenerEstadoActual() {
      const idDeUsuario = localStorage.getItem("idDeUsuario");
      const url = `https://laboratorio3-f36a.restdb.io/rest/transactions?q={"user_id":"${idDeUsuario}"}`;

      axios
        .get(url, {
          headers: {
            "x-apikey": "60eb09146661365596af552f",
          },
        })
        .then((response) => {
          const transacciones = response.data;
          this.criptomonedas = {};

          for (const transaccion of transacciones) {
            const idCriptomoneda = transaccion.crypto_code;

            if (!this.criptomonedas[idCriptomoneda]) {
              this.criptomonedas[idCriptomoneda] = {
                idCriptomoneda: idCriptomoneda,
                comprado: 0,
                vendido: 0,
                cantidadComprada: 0,
                cantidadVendida: 0,
              };
            }

            if (transaccion.action === "purchase") {
              this.criptomonedas[idCriptomoneda].comprado += parseFloat(
                transaccion.money
              );
              this.criptomonedas[idCriptomoneda].cantidadComprada += parseFloat(
                transaccion.crypto_amount
              );
            } else if (transaccion.action === "sale") {
              this.criptomonedas[idCriptomoneda].vendido += parseFloat(
                transaccion.money
              );
              this.criptomonedas[idCriptomoneda].cantidadVendida += parseFloat(
                transaccion.crypto_amount
              );
            }

            this.criptomonedas[idCriptomoneda].cantidadDisponible =
              this.criptomonedas[idCriptomoneda].cantidadComprada -
              this.criptomonedas[idCriptomoneda].cantidadVendida;
          }

          console.log("Datos para el gráfico:", this.chartData);

          this.resumenCriptomonedas = Object.values(this.criptomonedas).map(
            (crip) => {
              crip.resultado = crip.comprado - crip.vendido;
              this.resumenTotal += crip.resultado;
              return crip;
            }
          );

          // Actualizar los datos del gráfico
                    this.chartData = {
            labels: this.resumenCriptomonedas.map((crip) =>
              this.obtenerNombreCripto(crip.idCriptomoneda)
            ),
            datasets: [
              {
                label: "Saldo",
                backgroundColor: "#42A5F5",
                data: this.resumenCriptomonedas.map((crip) => crip.resultado),
              },
              {
                label: "Cantidad Disponible",
                backgroundColor: "#66BB6A",
                data: this.resumenCriptomonedas.map((crip) => crip.cantidadDisponible),
              },
            ],
          };

        });
    },
  },
};
</script>

  
  
<style>

table {
  width: 100%;
  border-collapse: collapse;  
}

th,
td {
  padding: 8px;
  border: 1px solid #1a1d1b;
}

th {
  background-color: #dfb9b9;
}
</style>