"use client";

import { FC, useEffect, useState } from "react";
import { BasicModal } from "@/app/components/BasicModal";
import { Input } from "@/app/components/Input";
import {
  Box,
  Button,
  Divider,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Select,
  Link,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { useSWRConfig } from "swr";
import { yupResolver } from "@hookform/resolvers/yup";
import { SubmitHandler, useForm } from "react-hook-form";
import { ICreateUserContent } from "@/app/utils/types/form";
import { api } from "@/app/api";
import { ObjectSchema } from "yup";
import { createUserSchema } from "@/app/utils/schemas/createUser";
import { allowOnlyNumbers } from "@/app/utils/input";
import { searchCep } from "@/app/utils/input/searchCep";
import { obterCoordenadasPorCEP } from "../../@lib/coordenatesForZipCode";

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const options = [
  //{ name: "Operador", value: "OPERATOR" },
  { name: "Cliente", value: "CLIENT" },
];

const profileOptions = [
  { name: "Op Retro", value: "OP_RETRO" },
  { name: "Op Escavadeira", value: "OP_EXCAVATOR" },
  { name: "Op Rolo", value: "OP_ROLO" },
  { name: "Op Motoniveladora", value: "OP_MOTORLEVELER" },
  { name: "Motorista de Caçamba", value: "DUMP_TRUCK_DRIVER" },
  { name: "Motorista de Caçambão", value: "LARGE_DUMP_TRUCK_DRIVER" },
  { name: "Motorista de Plataforma", value: "PLATFORM_TRUCK_DRIVER" },
];

export const ContentModal: FC<ContentModalProps> = ({ isOpen, onClose }) => {
  const [active, setActive] = useState("");

  const [onLoadingSubmit, setOnLoadingSubmit] = useState(false);
  const toast = useToast();

  const { mutate } = useSWRConfig();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    clearErrors,
    reset,
  } = useForm<ICreateUserContent>({
    resolver: yupResolver(createUserSchema as ObjectSchema<ICreateUserContent>),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<ICreateUserContent> = async (data) => {
    if (onLoadingSubmit) return;
    let dataFormated = {
      ...data,
      confirmPassword: undefined,
    };

    if (data.role !== "OPERATOR") {
      delete dataFormated.profile;
    }

    setOnLoadingSubmit(true);
    await api
      .post("/user", dataFormated)
      .then(() => {
        toast({
          title: "Sucesso",
          description: `${active} adicionado com sucesso`,
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        mutate(`/user`);
        onClose();
      })
      .catch((error) => {
        toast({
          title: "Erro ao criar.",
          description: error?.response?.data.message ?? "Algo deu errado",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
    setOnLoadingSubmit(false);
  };

  useEffect(() => {
    setValue("role", active);
  }, [active, setValue]);

  return (
    <BasicModal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Cadastro de Usuário"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={onLoadingSubmit}
    >
      <Text fontSize="md" color="gray.600" mb="4">
        Qual o tipo de usuário que você deseja cadastrar?
      </Text>
      <HStack spacing="4" mb="6">
        {options.map((option) => (
          <Button
            key={option.value}
            color={active === option.value ? "#8B5CF6" : "gray"}
            borderColor={active === option.value ? "#8B5CF6" : "gray"}
            bg={active === option.value ? "rgba(139, 92, 246, 0.2)" : "white"}
            variant="outline"
            onClick={() => setActive(option.value)}
            fontWeight="500"
          >
            {option.name}
          </Button>
        ))}
      </HStack>

      {active && (
        <Box mb="6">
          <Input
            label="Dados Pessoais"
            placeholder="Nome Completo"
            register={register("name")}
            {...register("name")}
            error={errors.name}
            variant="secondary"
            mb="4"
          />
          <Input
            variant="secondary"
            register={register("cpf")}
            {...register("cpf")}
            placeholder="CPF"
            mask="999.999.999-99"
            error={errors.cpf}
          />
          <Divider mt="8" />

          {active === "OPERATOR" && (
            <>
              <Text
                color="brand.primary.500"
                fontSize={"16px"}
                fontWeight={"400"}
                mb="2"
                mt="6"
              >
                Profissional
              </Text>
              <FormControl isInvalid={!!errors.profile} flexDir="column">
                <Select
                  placeholder="Perfil"
                  variant="secondary"
                  {...register("profile")}
                >
                  {profileOptions.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.name}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage mt={1} mb={4}>
                  * {errors?.profile?.message}
                </FormErrorMessage>
              </FormControl>

              <Divider mt="6" mb="6" />
            </>
          )}

          <Stack align="flex-start" direction="column" mt="6">
            <FormLabel
              color={
                errors.whatsApp || errors.email
                  ? "red.500"
                  : "brand.primary.500"
              }
              fontSize={"16px"}
              fontWeight={"400"}
              mb={0}
            >
              Contato
            </FormLabel>
            <Flex gap="24px" w="100%">
              <Input
                register={register("whatsApp")}
                {...register("whatsApp")}
                name="whatsApp"
                variant="secondary"
                placeholder="Whatsapp"
                mask="(99) 99999-9999"
                error={errors.whatsApp}
              />
              <Input
                variant="secondary"
                placeholder="E-mail"
                {...register("email")}
                register={register("email")}
                error={errors.email}
                name="email"
              />
            </Flex>
          </Stack>
          <Divider mt="6" mb="6" />

          <Box mb="6">
            <Stack align="flex-end" direction="row" mt="6">
              <Input
                label="Endereço"
                variant="secondary"
                placeholder="CEP"
                w={"70%"}
                mask="99999-999"
                register={register("address.cep")}
                {...register("address.cep")}
                onKeyUp={(e) => {
                  searchCep(e.currentTarget?.value, setValue);
                  obterCoordenadasPorCEP(e.currentTarget?.value, setValue);
                }}
                error={errors.address?.cep}
              />
              <Link
                fontSize="14px"
                href="https://buscacepinter.correios.com.br/app/endereco/index.php?t"
                target="_blank"
                textAlign="left"
                w={"30%"}
                color="brand.primary.500"
              >
                Não sei meu CEP
              </Link>
            </Stack>
            <Stack spacing="4" mt="6" direction="row" justifyContent="start">
              <Input
                variant="secondary"
                placeholder="Endereço"
                register={register("address.address")}
                {...register("address.address")}
                error={errors.address?.address}
              />
              <Input
                variant="secondary"
                placeholder="Número"
                register={register("address.number")}
                {...register("address.number")}
                onKeyDown={allowOnlyNumbers}
                error={errors.address?.number}
              />
            </Stack>
            <HStack spacing="4" mt="6">
              <Input
                variant="secondary"
                placeholder="Complemento (opcional)"
                register={register("address.complement")}
                {...register("address.complement")}
                error={errors.address?.complement}
              />
            </HStack>
            <Stack spacing="4" mt="6" direction="row" justifyContent="start">
              <Input
                variant="secondary"
                placeholder="Bairro"
                register={register("address.street")}
                {...register("address.street")}
                error={errors.address?.street}
              />
              <Input
                variant="secondary"
                placeholder="Cidade"
                register={register("address.city")}
                {...register("address.city")}
                error={errors.address?.city}
              />
              <Input
                variant="secondary"
                placeholder="Estado"
                register={register("address.state")}
                {...register("address.state")}
                error={errors.address?.state}
              />
            </Stack>
          </Box>
          <Divider mt="6" mb="6" />

          <Box mb="6">
            <Stack align="flex-end" direction="row" mt="6" spacing="4">
              <Input
                label="Latitude e Longitude (opcional)"
                variant="secondary"
                placeholder="Latitude"
                register={register("coordinates.latitude")}
                {...register("coordinates.latitude")}
                error={errors.coordinates?.latitude}
                type="number"
              />
              <Input
                variant="secondary"
                placeholder="Longitude"
                register={register("coordinates.longitude")}
                {...register("coordinates.longitude")}
                error={errors.coordinates?.longitude}
                type="number"
              />
            </Stack>
          </Box>

          <Divider mt="6" mb="6" />
          <Input
            label="Senha"
            placeholder="Senha"
            variant="secondary"
            register={register("password")}
            {...register("password")}
            error={errors.password}
          />
          <Input
            placeholder="Confirmar senha"
            variant="secondary"
            mt="6"
            register={register("confirmPassword")}
            {...register("confirmPassword")}
            error={errors.confirmPassword}
          />
        </Box>
      )}
    </BasicModal>
  );
};
