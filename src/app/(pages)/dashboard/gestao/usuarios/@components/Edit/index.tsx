"use client";

import { FC, useContext, useEffect, useState } from "react";
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
import { IEditUserContent } from "@/app/utils/types/form";
import { api } from "@/app/api";
import { ObjectSchema } from "yup";
import { allowOnlyNumbers } from "@/app/utils/input";
import { searchCep } from "@/app/utils/input/searchCep";
import { IUser } from "@/app/utils/types/rest";
import { userOptions, userProfileOptions } from "@/app/utils/constants/user";
import { editUserSchema } from "@/app/utils/schemas/editUser";
import { AuthContext } from "@/app/context/AuthContext";
import { obterCoordenadasPorCEP } from "../../@lib/coordenatesForZipCode";

interface ContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: IUser;
}

export const UserModalEdit: FC<ContentModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const [active, setActive] = useState("");
  const { customer } = useContext(AuthContext);

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
  } = useForm<IEditUserContent>({
    resolver: yupResolver(editUserSchema as ObjectSchema<IEditUserContent>),
    defaultValues: {},
  });

  const onSubmit: SubmitHandler<IEditUserContent> = async (data) => {
    if (onLoadingSubmit) return;
    let dataFormated = {
      ...data,
      id: user.id,
    };

    setOnLoadingSubmit(true);
    await api
      .put("/user", dataFormated)
      .then(() => {
        toast({
          title: "Sucesso",
          description: `Usuário editado com sucesso`,
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
    reset({
      cpf: user?.cpf ?? "",
      email: user.email,
      name: user.name,
      whatsApp: user.whatsApp ?? "",
      profile: user.profile ?? "",
      address: {
        address: user.address.address,
        cep: user.address.cep,
        city: user.address.city,
        street: user.address.city,
        number: user.address.number,
        state: user.address.state,
        complement: user.address.complement,
      },
      coordinates: {
        latitude: user.coordinates?.latitude,
        longitude: user.coordinates?.longitude,
      },
    });
    setValue("role", user.role);
    setActive(user.role);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, reset, setValue]);

  return (
    <BasicModal
      isOpen={isOpen}
      onClose={onClose}
      modalTitle="Edição de Usuário"
      onSubmit={handleSubmit(onSubmit)}
      isLoading={onLoadingSubmit}
    >
      <Text fontSize="md" color="gray.600" mb="4">
        Qual o tipo de usuário que você deseja cadastrar?
      </Text>
      <HStack spacing="4" mb="6">
        {userOptions.map((option) => (
          <>
            {user.role === option.value && customer.role !== option.value && (
              <Button
                key={option.value}
                color={active === option.value ? "#8B5CF6" : "gray"}
                borderColor={active === option.value ? "#8B5CF6" : "gray"}
                bg={
                  active === option.value ? "rgba(139, 92, 246, 0.2)" : "white"
                }
                variant="outline"
                onClick={() => setActive(option.value)}
                fontWeight="500"
              >
                {option.name}
              </Button>
            )}
          </>
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
                  {userProfileOptions.map((type) => (
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
          </Box>
        </Box>
      )}
    </BasicModal>
  );
};
