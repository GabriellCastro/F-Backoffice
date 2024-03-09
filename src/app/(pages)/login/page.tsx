"use client";

import { FC, useState, useContext, useEffect } from "react";
import {
  Heading,
  Text,
  Button,
  Flex,
  Box,
  Icon,
  Center,
  useToast,
} from "@chakra-ui/react";
import { Input } from "@/app/components/Input";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import Image from "next/image";
import LoginIlustration from "@/app/assets/images/login.svg";
import { AuthContext } from "@/app/context/AuthContext";
import { api } from "@/app/api";
import { setCookie } from "nookies";

const schema = yup.object({
  email: yup.string().required("E-mail obrigatório").email("E-mail inválido"),
  password: yup.string().required("Senha obrigatória"),
});

type ISchema = yup.InferType<typeof schema>;

const LoginPage: FC = () => {
  const { setCustomer } = useContext(AuthContext);
  const toast = useToast();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [onLoadingLogin, setOnLoadingLogin] = useState(false);

  const handleShowPassword = () => setShowPassword((oldValue) => !oldValue);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ISchema>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<ISchema> = async (data, e) => {
    e?.preventDefault();
    setOnLoadingLogin(true);
    try {
      const { data: response } = await api.post("/user/login", data);
      if (!["ADMINISTRATOR", "MANAGER"].includes(response.data.user.role)) {
        router.push("/login");
        toast({
          title: "Informamos que: ",
          description: "Você não tem permissão para acessar essa página",
          status: "info",
          duration: 2000,
          isClosable: true,
        });
        setOnLoadingLogin(false);
        return;
      }
      api.defaults.headers[
        "Authorization"
      ] = `Bearer ${response.data.access_token}`;
      setCookie(null, "token", response.data.access_token);
      setCustomer(response.data.user);
      router.push("/dashboard");
    } catch (error: any) {
      toast({
        title: "Informamos que: ",
        description: error?.response?.data.message,
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
    setOnLoadingLogin(false);
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
            <Flex flexDir="column" alignItems="center" mb={8} w="100%">
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
                Login
              </Heading>
              <Text
                fontSize={{
                  base: "md",
                  md: "md",
                }}
                color="brand.neutral.950"
              >
                Seja bem-vindo!
              </Text>
            </Flex>
            <Flex flexDirection="column" gap={4}>
              <Input
                placeholder="Ex: example@gmail.com"
                variant="secondary"
                {...register("email")}
                onChange={(e) => setValue("email", e.target.value)}
                error={errors.email}
              />
              <Input
                placeholder={showPassword ? "Ex: qwe123" : "Ex: ********"}
                variant="secondary"
                {...register("password")}
                onChange={(e) => setValue("password", e.target.value)}
                error={errors.password}
                type={showPassword ? "text" : "password"}
                iconRight={
                  <Icon
                    as={showPassword ? EyeSlash : Eye}
                    fontSize="2xl"
                    onClick={handleShowPassword}
                    cursor="pointer"
                    p={0.5}
                    color="brand.neutral.500"
                  />
                }
              />
            </Flex>
            <Flex justifyContent="flex-end" mt={2}>
              <Text
                as="a"
                href="/forgotPassword"
                color="brand.primary.500"
                _hover={{
                  textDecoration: "underline",
                }}
              >
                Esqueceu sua senha?
              </Text>
            </Flex>
            <Button
              w="100%"
              type="submit"
              mt={"20"}
              colorScheme="brand.primary"
              variant="primary"
              size="lg"
              isLoading={onLoadingLogin}
            >
              Entrar
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
          <Image src={LoginIlustration} alt="Login" />
        </Box>
      </Flex>
    </form>
  );
};

export default LoginPage;
