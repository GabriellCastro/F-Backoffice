"use client";

import { FC, SetStateAction, useState } from "react";
import {
  Heading,
  Text,
  Button,
  Flex,
  Box,
  Center,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { Input } from "@/app/components/Input";
import { useRouter, useSearchParams } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import LoginIlustration from "@/app/assets/images/login.svg";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import { api } from "@/app/api";
import { recoveryPassword } from "@/app/utils/schemas/recoveryPassword";

type ISchema = yup.InferType<typeof recoveryPassword>;

const RecoveryPasswordPage: FC = () => {
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [onLoadingSubmit, setOnLoadingSubmit] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const toggleShowPassword = (
    value: boolean,
    setState: React.Dispatch<SetStateAction<boolean>>
  ) => setState(value);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISchema>({
    resolver: yupResolver(recoveryPassword),
  });

  const onSubmit: SubmitHandler<ISchema> = async (data, e) => {
    e?.preventDefault();
    setOnLoadingSubmit(true);
    try {
      await api.patch(
        `/user/restorePassword?token=${searchParams.get("token")}`,
        {
          password: data.password,
        }
      );
      toast({
        title: "Sucesso!",
        description: "Senha alterada com sucesso.",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      reset();
      router.push("/login");
    } catch (error: any) {
      toast({
        title: "Informamos que: ",
        description: error?.response?.data.message,
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
    setOnLoadingSubmit(false);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Flex as="main" justifyContent="space-between">
        <Center
          flexDir={"column"}
          w="100vw"
          h="100vh"
          p={{
            base: "0 1rem",
            md: "0",
          }}
        >
          <Box
            w={{
              base: "100%",
              md: "400px",
            }}
          >
            <Flex
              flexDir="column"
              alignItems="center"
              gap="10px"
              mb={12}
              w="100%"
            >
              <Heading
                as="h1"
                mb={2}
                fontSize={{
                  base: "2xl",
                  md: "2xl",
                }}
                color="brand.primary.500"
                fontWeight={500}
              >
                Escreva a sua nova senha
              </Heading>
              <Text
                fontSize={{
                  base: "md",
                  md: "md",
                }}
                color="brand.neutral.950"
                textAlign="center"
                maxWidth={350}
              >
                Informe a sua nova senha
              </Text>
            </Flex>
            <Flex flexDirection="column" gap={4}>
              <Input
                placeholder="Nova senha"
                variant="secondary"
                {...register("password")}
                register={register("password")}
                error={errors.password}
                type={showPassword ? "text" : "password"}
                iconRight={
                  <Icon
                    as={showPassword ? EyeSlash : Eye}
                    fontSize="2xl"
                    onClick={() =>
                      toggleShowPassword(!showPassword, setShowPassword)
                    }
                    cursor="pointer"
                    p={0.5}
                    color="brand.neutral.500"
                  />
                }
              />

              <Input
                placeholder="Confirme a sua nova senha"
                variant="secondary"
                {...register("confirmPassword")}
                register={register("confirmPassword")}
                error={errors.confirmPassword}
                type={showConfirmPassword ? "text" : "password"}
                iconRight={
                  <Icon
                    as={showConfirmPassword ? EyeSlash : Eye}
                    fontSize="2xl"
                    onClick={() =>
                      toggleShowPassword(
                        !showConfirmPassword,
                        setShowConfirmPassword
                      )
                    }
                    cursor="pointer"
                    p={0.5}
                    color="brand.neutral.500"
                  />
                }
              />
            </Flex>
            <Button
              w="100%"
              type="submit"
              mt={"12"}
              colorScheme="brand.primary"
              variant="primary"
              size="lg"
              isLoading={onLoadingSubmit}
            >
              Enviar
            </Button>
          </Box>
        </Center>

        <Box
          w={{
            base: "0",
            md: "0",
            lg: "61vw",
          }}
          h={{
            base: "0",
            md: "0",
            lg: "100vh",
          }}
          display={{ base: "none", md: "block" }}
        >
          <Image src={LoginIlustration} alt="Recovery password illsutration" />
        </Box>
      </Flex>
    </form>
  );
};

export default RecoveryPasswordPage;
