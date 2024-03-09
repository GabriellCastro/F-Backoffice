import * as yup from "yup";
import { cpfSchema, emailSchema } from "./shared";

export const createUserSchema = yup.object({
  role: yup.string().required("Campo obrigatório"),
  name: yup.string().required("Nome obrigatório"),
  email: emailSchema().required("Campo obrigatório"),
  cpf: cpfSchema(),
  profile: yup
    .string()
    .test("required-to-operator", "Campo inválido", (value, testContext) => {
      if (testContext.parent?.role.toUpperCase() === "OPERATOR" && !value)
        return false;
      return true;
    }),
  whatsApp: yup
    .string()
    .test("is-whatsApp", "Campo inválido", (value, testContext) => {
      if (value?.replaceAll(/[(|)|_|-]/g, "").length !== 12) return false;
      return true;
    })
    .required("Campo obrigatório"),
  address: yup.object({
    cep: yup
      .string()
      .test("is-whatsApp", "Campo inválido", (value, testContext) => {
        if (value?.replaceAll(/[_|-]/g, "").length !== 8) return false;
        return true;
      })
      .required("Campo obrigatório"),
    address: yup.string().required("Campo obrigatório"),
    number: yup
      .string()
      .max(4, "Máximo 4 dígitos")
      .required("Campo obrigatório"),
    city: yup.string().required("Campo obrigatório"),
    street: yup.string().required("Campo obrigatório"),
    state: yup.string().required("Campo obrigatório"),
    complement: yup.string().optional(),
  }),
  password: yup
    .string()
    .required("Campo obrigatório.")
    .min(6, "Mínimo 6 caracteres."),
  confirmPassword: yup
    .string()
    .required("Campo obrigatório.")
    .test("confirm-password", "Campo inválido", (value, testContext) => {
      if (value === testContext.parent?.password) return true;
      return false;
    })
    .min(6, "Mínimo 6 caracteres."),
  coordinates: yup.object({
    latitude: yup.number().optional(),
    longitude: yup.number().optional(),
  }),
});
