"use client";

import { FC } from "react";
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { ContentModal } from "./@components/ContentModal";
import { createColumn } from "react-chakra-pagination";
import { ComplexTable } from "@/app/components/ComplexTable";
import { BeatLoader } from "react-spinners";
import { useFetch } from "@/app/hooks/useFetch";
import { IUsersPaginatedResponse } from "@/app/utils/types/rest";
import { UserActions } from "./@components/Actions";
import { convertUserRoleToBR } from "@/app/utils/constants/user";

const UsersPage: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { data: users } = useFetch<IUsersPaginatedResponse>("/user");

  const tableData = users?.data?.elements?.map((data) => ({
    name: (
      <Flex align="center">
        <Text>{data.name}</Text>
      </Flex>
    ),
    role: convertUserRoleToBR(data.role),
    email: data.email,
    cpf: data.cpf ?? <Text opacity={0.7}>Indefinido</Text>,
    action: <UserActions data={data} />,
  }));

  const columnHelper = createColumn<typeof tableData>();

  const columns = [
    columnHelper.accessor("name", {
      cell: (info) => info.getValue(),
      header: "Nome",
    }),
    columnHelper.accessor("role", {
      cell: (info) => info.getValue(),
      header: "Permissão",
    }),
    columnHelper.accessor("email", {
      cell: (info) => info.getValue(),
      header: "Email",
    }),
    columnHelper.accessor("cpf", {
      cell: (info) => info.getValue(),
      header: "CPF",
    }),
    columnHelper.accessor("action", {
      cell: (info) => info.getValue(),
      header: "",
    }),
  ];

  return (
    <Box>
      <Flex justifyContent="space-between" mb="8">
        <Heading
          color="brand.neutral.950"
          borderBottom="2px solid"
          borderColor="brand.primary.950"
          pb="2"
          fontSize="3xl"
        >
          Usuários
        </Heading>
        <Button
          colorScheme="brand.primary.500"
          onClick={onOpen}
          width={"9.5rem"}
          isLoading={isOpen ? true : false}
          spinner={<BeatLoader size={8} color={"#fff"} />}
        >
          Adicionar
        </Button>
      </Flex>
      {isOpen && <ContentModal isOpen={isOpen} onClose={onClose} />}
      <ComplexTable
        tableData={tableData}
        columns={columns}
        users={users?.data?.elements}
      />
    </Box>
  );
};

export default UsersPage;
