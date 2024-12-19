import { createStore } from 'vuex'

export default createStore({
  state: {
    usuarios: [] //Guardamos los usuarios cargados
  },
  getters: {
  },
  mutations: {
    agregarUsuario(state, usuarios) {
      state.usuarios.push(usuarios); //Añadimos los usuarios   
  },
  },
  actions: {
  },
  modules: {
  }
})
