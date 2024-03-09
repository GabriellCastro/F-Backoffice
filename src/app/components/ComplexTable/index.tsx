"use client";

import { FC, useState } from "react";

import { Box, Icon } from "@chakra-ui/react";
import { Table } from "react-chakra-pagination";
import { Database, ListMagnifyingGlass } from "@phosphor-icons/react";
import { Input } from "../Input";

interface Props {
  tableData: any;
  columns: any;
  users: any;
}

export const ComplexTable: FC<Props> = ({ tableData, columns, users }) => {
  // função que vai filtrar por nome
  const [search, setSearch] = useState("");
  const filter = search
    ? users.filter((element: any) => {
        return element.name.toLowerCase().includes(search.toLowerCase().trim());
      })
    : tableData;

  return (
    <Box bgColor={"brand.neutral.50"} rounded={"md"}>
      <Box bgColor={"brand.primary.500"} rounded={"md"} p={4} color={"white"}>
        <Input
          name="search"
          placeholder="Pesquisar por nome"
          iconLeft={
            <Icon
              as={ListMagnifyingGlass}
              fontSize="24"
              color={"brand.primary.500"}
            />
          }
          _focus={{
            borderColor: "brand.primary.500",
          }}
          color={"black"}
          backgroundColor="white"
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>
      <Table
        colorScheme="brand.primary.500"
        // Fallback component when list is empty
        emptyData={{
          icon: <Icon as={Database} fontSize="64" />,
          text: "Nenhum registro encontrado!",
          noShadow: true,
        }}
        // Control registers to show
        // Exemple: show 10 registers of 15
        totalRegisters={tableData?.length ?? 50}
        itemsPerPage={10}
        initialPage={1}
        // Listen change page event and control the current page using state
        onPageChange={(page) => console.log(page)}
        columns={columns}
        data={filter ?? []}
      />
    </Box>
  );
};
