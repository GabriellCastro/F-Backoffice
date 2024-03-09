import * as yup from "yup";
import { cpfSchema, emailSchema } from "./shared";

export const editUserSchema = yup.object({
  role: yup.string().optional(),
  name: yup.string().optional(),
  email: emailSchema().optional(),
  cpf: cpfSchema().optional(),
  profile: yup
    .string()
    .test("optional-to-operatopo inválido", (value, testContext) => {
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
    .optional(),
  address: yup
    .object({
      cep: yup
        .string()
        .test("is-whatsApp", "Campo inválido", (value, testContext) => {
          if (value?.replaceAll(/[_|-]/g, "").length !== 8) return false;
          return true;
        })
        .optional(),
      address: yup.string().optional(),
      number: yup.string().max(4, "Máximo 4 dígitos").optional(),
      city: yup.string().optional(),
      street: yup.string().optional(),
      state: yup.string().optional(),
      complement: yup.string().optional(),
    })
    .optional(),
  coordinates: yup.object({
    latitude: yup.number().optional(),
    longitude: yup.number().optional(),
  }),
});
