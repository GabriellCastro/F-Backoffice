import { api } from "@/app/api";
import { UseFormSetValue } from "react-hook-form";

export const searchCep = async (
  cep: string,
  setValue: UseFormSetValue<any>
) => {
  if (cep.replaceAll(/[_|-]/g, "").length !== 8) return;
  await api
    .get(`https://viacep.com.br/ws/${cep}/json/`)
    .then((response) => {
      const { logradouro, localidade, uf, bairro, erro } = response.data;
      if (erro) {
        setValue("address.cep", "CEP não encontrado.");
        return;
      }
      setValue("address.address", logradouro);
      setValue("address.city", localidade);
      setValue("address.state", uf);
      setValue("address.street", bairro);
    })
    .catch(() => {
      setValue("address.cep", "CEP não encontrado.");
    });
};
