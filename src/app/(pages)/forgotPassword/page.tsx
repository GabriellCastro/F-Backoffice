"use client";

import React, { FC, useState } from "react";
import {
  Heading,
  Text,
  Button,
  Flex,
  Box,
  Center,
  useToast,
} from "@chakra-ui/react";
import { Input } from "@/app/components/Input";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import Image from "next/image";
import LoginIlustration from "@/app/assets/images/login.svg";
import { api } from "@/app/api";
import { forgotPassword } from "@/app/utils/schemas/recoveryPassword";

type ISchema = yup.InferType<typeof forgotPassword>;

const ForgotPasswordPage: FC = () => {
  const toast = useToast();
  const router = useRouter();
  const [onLoadingSubmit, setOnLoadingSubmit] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ISchema>({
    resolver: yupResolver(forgotPassword),
  });

  const onSubmit: SubmitHandler<ISchema> = async (data, e) => {
    e?.preventDefault();
    setOnLoadingSubmit(true);
    try {
      await api.post(`/user/forgotPassword`, data);
      toast({
        title: "Sucesso!",
        description: "Email para recuperação de senha enviado.",
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
                Recuperação de senha
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
                Informe o seu e-mail para iniciarmos a recuperação
              </Text>
            </Flex>
            <Flex flexDirection="column" gap={4}>
              <Input
                placeholder="E-mail"
                variant="secondary"
                {...register("email")}
                register={register("email")}
                error={errors.email}
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

export default ForgotPasswordPage;
