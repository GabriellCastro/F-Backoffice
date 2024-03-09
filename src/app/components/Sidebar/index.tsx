"use client";

import { FC, useContext, useState } from "react";
import { Flex, Icon, Text, Box, Link } from "@chakra-ui/react";
import { usePathname, useRouter } from "next/navigation";
import {
  List,
  User,
  X,
  SignOut,
  CaretUp,
  CaretDown,
  PresentationChart,
  TreeStructure,
  FileArrowDown,
  FileSearch,
  Path,
} from "@phosphor-icons/react";
import { AuthContext } from "@/app/context/AuthContext";

const options = [
  {
    name: "Dashboard",
    icon: PresentationChart,
    path: "/dashboard",
    subOptions: [],
  },
  {
    name: "Rota",
    icon: Path,
    path: "/dashboard/mapa",
    subOptions: [],
  },
  {
    name: "Gestão",
    icon: TreeStructure,
    path: null,
    subOptions: [
      {
        name: "Usuários",
        icon: User,
        path: "/dashboard/gestao/usuarios",
      },
    ],
  },
  {
    name: "Relatórios",
    icon: FileSearch,
    path: null,
    subOptions: [
      {
        name: "Administrativo",
        icon: FileArrowDown,
        path: null,
      },
      {
        name: "Produtividade",
        icon: FileArrowDown,
        path: null,
      },
      {
        name: "Gerenciais",
        icon: FileArrowDown,
        path: null,
      },
    ],
  },
];

export const Sidebar: FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSubOptionsOpen, setIsSubOptionsOpen] = useState(false);
  const [indexSubOptionsOpen, setIndexSubOptionsOpen] = useState(0);
  const [nameOptionSelected, setNameOptionSelected] = useState("Dashboard"); // options[0].name
  const pathname = usePathname();
  const { push } = useRouter();
  const { signOut } = useContext(AuthContext);

  return (
    <Flex
      as="nav"
      borderRight={"2px solid #E2E8F0"}
      bg="brand.neutral.50"
      color="white"
      direction="column"
      h="100vh"
      position="relative"
      top="0"
      left="0"
      w={isSidebarOpen ? "18rem" : "4.8rem"}
      transition="width 0.6s"
      zIndex={1}
      overflow={{
        md: "hidden",
      }}
    >
      <Box px={"5"} mb="16" mt="8">
        <Icon
          as={isSidebarOpen ? X : List}
          color="brand.neutral.950"
          boxSize={6}
          cursor={"pointer"}
          _hover={{ color: "brand.primary.500" }}
          onClick={() => {
            setIsSidebarOpen(!isSidebarOpen);
            setIsSubOptionsOpen(false);
          }}
        />
      </Box>

      <Flex direction="column" alignItems="center">
        {options.map((option) => (
          <Link
            as={!!option.path ? Link : Box}
            href={!!option.path ? option.path : "/dashboard"}
            _after={{ height: 0 }}
            key={option.name}
            w={isSidebarOpen ? "90%" : undefined}
          >
            <Box
              key={option.name}
              display="flex"
              alignItems="center"
              my="3"
              position="relative"
              borderLeft={"3px solid transparent"}
              _hover={{
                borderLeft: "3px solid white",
                backgroundColor: "brand.primary.600",
                cursor: "pointer",
              }}
              px={"5"}
              py={"1"}
              onClick={() => {
                if (option.subOptions && option.subOptions.length > 0) {
                  setIsSubOptionsOpen(
                    option.name === nameOptionSelected
                      ? !isSubOptionsOpen
                      : true
                  );
                  setNameOptionSelected(option.name);
                  return;
                }
                option.path && push(option.path as string);
              }}
              backgroundColor={
                pathname === option.path ||
                pathname ===
                  (option.subOptions &&
                    (option.subOptions[indexSubOptionsOpen]?.path as string))
                  ? "brand.primary.500"
                  : "transparent"
              }
              rounded={"md"}
              p={"4"}
            >
              <Icon
                as={option.icon}
                boxSize={"6"}
                _hover={{ cursor: "pointer", color: "white" }}
                mr={isSidebarOpen ? "2" : "0"}
                color={
                  pathname === option.path ||
                  pathname ===
                    (option.subOptions &&
                      (option.subOptions[indexSubOptionsOpen]?.path as string))
                    ? "white"
                    : "brand.neutral.950"
                }
              />
              {isSidebarOpen && (
                <Flex
                  justifyContent={"space-between"}
                  alignItems={"center"}
                  w={"100%"}
                  overflow={"hidden"}
                >
                  <Text
                    color={
                      pathname === option.path ||
                      pathname ===
                        (option.subOptions &&
                          (option.subOptions[indexSubOptionsOpen]
                            ?.path as string))
                        ? "white"
                        : "brand.neutral.950"
                    }
                    fontSize={"sm"}
                    whiteSpace="nowrap"
                    _hover={{ cursor: "pointer", color: "white" }}
                    w={"10px"}
                    onClick={() => {
                      option.subOptions &&
                        option.subOptions.length > 0 &&
                        setIsSubOptionsOpen(!isSubOptionsOpen);
                      option.path && push(option.path as string);
                    }}
                  >
                    {option.name}
                  </Text>
                  {option.subOptions && option.subOptions?.length > 0 && (
                    <Icon
                      as={
                        isSubOptionsOpen && option.name === nameOptionSelected
                          ? CaretUp
                          : CaretDown
                      }
                      boxSize={"5"}
                      ml={"28"}
                      _hover={{ cursor: "pointer" }}
                      onClick={() => {
                        setIsSubOptionsOpen(!isSubOptionsOpen);
                        setNameOptionSelected(option.name);
                      }}
                      color={
                        pathname === option.path ||
                        pathname ===
                          (option.subOptions &&
                            (option.subOptions[indexSubOptionsOpen]
                              ?.path as string))
                          ? "white"
                          : "brand.neutral.950"
                      }
                    />
                  )}
                </Flex>
              )}
            </Box>
            {isSidebarOpen &&
              isSubOptionsOpen &&
              option.name === nameOptionSelected && (
                <Flex
                  direction={"column"}
                  w={"100%"}
                  borderRadius={"sm"}
                  mb={"2"}
                  mt={"-3"}
                >
                  {option.subOptions &&
                    option.subOptions.map((subOption, index) => (
                      <Flex
                        key={subOption.name}
                        alignItems={"center"}
                        my="1"
                        px={"5"}
                        py={"1"}
                        rounded={"md"}
                        _hover={{
                          backgroundColor: "brand.neutral.200",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          subOption.path && push(subOption.path as string);
                          setIndexSubOptionsOpen(index);
                          console.log(subOption.path);
                        }}
                      >
                        <Icon
                          as={subOption.icon}
                          boxSize={"6"}
                          _hover={{
                            cursor: "pointer",
                            color: "brand.primary.500",
                          }}
                          mr={isSidebarOpen ? "2" : "0"}
                          color={
                            pathname === subOption.path
                              ? "brand.primary.500"
                              : "brand.neutral.950"
                          }
                          onClick={() => {
                            subOption.path && push(subOption.path as string);
                            setIndexSubOptionsOpen(index);
                          }}
                        />
                        <Text
                          fontSize={"sm"}
                          whiteSpace="nowrap"
                          _hover={{
                            cursor: "pointer",
                            color: "brand.primary.500",
                          }}
                          onClick={() => {
                            subOption.path && push(subOption.path as string);
                            setIndexSubOptionsOpen(index);
                          }}
                          color={
                            pathname === subOption.path
                              ? "brand.primary.500"
                              : "brand.neutral.950"
                          }
                        >
                          {subOption.name}
                        </Text>
                      </Flex>
                    ))}
                </Flex>
              )}
          </Link>
        ))}
      </Flex>
      <Box px={"4"} mt="auto" mb="10">
        <Flex
          cursor={"pointer"}
          bg={"brand.neutral.200"}
          p={"1"}
          borderRadius={"md"}
          w={isSidebarOpen ? "100%" : undefined}
          justifyContent={"center"}
          alignItems={"center"}
          onClick={signOut}
        >
          <Icon as={SignOut} color="#F03E3E" boxSize={"6"} />
          {isSidebarOpen && (
            <Text
              color={"brand.neutral.950"}
              fontSize={"sm"}
              textAlign={"center"}
              ml={"2"}
              _hover={{ color: "#F03E3E" }}
            >
              Sair
            </Text>
          )}
        </Flex>
      </Box>
    </Flex>
  );
};
