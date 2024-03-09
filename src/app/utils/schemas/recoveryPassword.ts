import * as yup from "yup";
import { emailSchema } from "./shared";

export const recoveryPassword = yup.object({
  password: yup
    .string()
    .required("Senha obrigatória")
    .min(6, "Mínimo 6 dígitos"),
  confirmPassword: yup
    .string()
    .test(
      "confirm-password",
      "A confirmação de senha não corresponde à senha fornecida",
      (value, testContext) => {
        if (testContext?.parent?.password !== value) return false;
        return true;
      }
    )
    .required("Senha obrigatória")
    .min(6, "Mínimo 6 dígitos"),
});

export const forgotPassword = yup.object({
  email: emailSchema().required("E-mail obrigatório"),
});
