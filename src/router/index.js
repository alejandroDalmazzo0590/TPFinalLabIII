import { createRouter, createWebHistory } from 'vue-router'
import UsuariosCargados from '../views/usuariosCargados.vue';
import PaginaRegistro from '../views/paginaRegistro.vue';
import CompraVenta from '../views/compraVenta.vue';
import HistorialMovimientos from '../views/historiaMovimientos.vue';
import AnalisisFinanciero from '../views/analisisFinanciero.vue';

const routes = [
  {
    path: "/",
    name: "Pagina de Registro",
    component: PaginaRegistro,
  },
  {
    path: "/usuarios",
    name: "Usuarios Cargados",
    component: UsuariosCargados,   
  },
  {
    path: "/nuevaoperacion",
    name: "compra venta",
    component: CompraVenta,   
  },
  {
    path: "/Historial",
    name: "historial operaciones",
    component: HistorialMovimientos,   
  },
  {
    path: "/Analisis",
    name: "analisis financiero",
    component: AnalisisFinanciero,   
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
