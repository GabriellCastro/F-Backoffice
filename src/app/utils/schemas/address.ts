import * as yup from "yup";

export const addressSchema = yup.object({
  cep: yup
    .string()
    .test("is-cep", "Campo inválido", (value, testContext) => {
      if (value?.replaceAll(/[_|-]/g, "").length !== 8) return false;
      return true;
    })
    .required("Campo obrigatório"),
  address: yup.string().required("Campo obrigatório"),
  number: yup.string().max(4, "Máximo 4 dígitos").required("Campo obrigatório"),
  city: yup.string().required("Campo obrigatório"),
  street: yup.string().required("Campo obrigatório"),
  state: yup.string().required("Campo obrigatório"),
  complement: yup.string().optional(),
});
