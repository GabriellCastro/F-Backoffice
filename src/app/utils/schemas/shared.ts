import * as Yup from "yup";

export const emailSchema = () =>
  Yup.string()
    .trim()
    .email("Email inválido.")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "Email inválido."
    );

export const nameSchema = (required = true) =>
  Yup.string()
    .trim()
    .min(3, "Deve conter ao menos 3 caracteres.")
    .max(61, "Deve conter menos que 61 caracteres")
    .matches(/^[a-záàâãéèêíïóôõöúçñ ]+$/i, "Números não permitido.")
    .test("Nome e Sobrenome", "Digite o nome completo.", (value) => {
      if (!value) return false;
      const names = value.split(" ");
      return names.length >= 2 && names.every((name) => name.length >= 2);
    })
    [required ? "required" : "optional"]("Campo obrigatório");

export const birthdateSchema = (required = true) =>
  Yup.string()
    .test("Campo inválido", "Deve ter entre 18 e 80 anos", (value) => {
      const currentYear = new Date().getFullYear();
      const dateToCompare = value?.split("-")[0];
      return (
        currentYear - Number(dateToCompare) >= 18 &&
        currentYear - Number(dateToCompare) <= 80
      );
    })
    [required ? "required" : "optional"]("Campo obrigatório");

export const cpfSchema = () =>
  Yup.string()
    .trim()
    .min(14, "Deve conter 14 dígitos.")
    .max(14, "Deve conter 14 dígitos.")
    .test("Campo inválido", "Campo inválido", (value) =>
      value?.replaceAll("_", "").length === 14 ? true : false
    );
