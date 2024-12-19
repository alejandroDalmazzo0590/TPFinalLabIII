import { mount } from "@vue/test-utils";
import PaginaRegistro from '../../views/paginaRegistro.vue';

describe("PaginaRegistro.vue", () => {
  let wrapper;

  beforeEach(() => {
    wrapper = mount(PaginaRegistro, {
      mocks: {
        $store: {
          state: { usuarios: [] },
          mutations: { agregarUsuario: jest.fn() },
        },
      },
    });
  });

  afterEach(() => {
    wrapper.unmount();
  });

  it("Valida correctamente un nombre con solo letras", async () => {
    await wrapper.setData({ Nombre: "Alejandro" });
    wrapper.vm.validarCampoPorLetras("Nombre");
    expect(wrapper.vm.esCampoValido("Nombre")).toBe(true);
  });

  it("Detecta un nombre inválido con caracteres no permitidos", async () => {
    await wrapper.setData({ Nombre: "Alej4ndro" });
    wrapper.vm.validarCampoPorLetras("Nombre");
    expect(wrapper.vm.esCampoValido("Nombre")).toBe(false);
  });

  it("Genera un ID único y lo guarda correctamente", async () => {
    const id = wrapper.vm.generarIdDeUsuario();
    expect(id).toBeDefined();
    expect(wrapper.vm.idDeUsuario).toEqual(id);
  });

  it("Evita duplicados al generar múltiples IDs", () => {
    const id1 = wrapper.vm.generarIdUnica();
    const id2 = wrapper.vm.generarIdUnica();
    expect(id1).not.toBe(id2);
    expect(wrapper.vm.idsGeneradas.has(id1)).toBe(true);
    expect(wrapper.vm.idsGeneradas.has(id2)).toBe(true);
  });

  it("Habilita el botón de generación solo si los campos son válidos", async () => {
    await wrapper.setData({ Nombre: "Juan", Apellido: "Perez" });
    expect(wrapper.vm.ValidacionNombre).toBe(true);

    await wrapper.setData({ Nombre: "Juan3" }); // Nombre inválido
    expect(wrapper.vm.ValidacionNombre).toBe(false);
  });

  it("Copia el ID al portapapeles cuando se genera", async () => {
    jest.spyOn(navigator.clipboard, "writeText").mockImplementation(() => Promise.resolve());
    await wrapper.vm.generarIdDeUsuario();
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(wrapper.vm.idDeUsuario);
  });
});


