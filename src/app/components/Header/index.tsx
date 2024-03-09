"use client";

import { FC, useContext } from "react";
import { Flex, Icon, HStack, Avatar } from "@chakra-ui/react";
import { AuthContext } from "@/app/context/AuthContext";

import { Bell, Question } from "@phosphor-icons/react";

export const Header: FC = () => {
  const { customer } = useContext(AuthContext);
  return (
    <Flex
      as="header"
      w="100%"
      h={"74px"}
      justifyContent={"flex-end"}
      alignItems={"center"}
      bgColor={"brand.neutral.50"}
      px={{ base: "4", md: "10" }}
      zIndex={1}
      borderBottom={"2px solid #E2E8F0"}
    >
      <HStack
        spacing={8}
        display={{ base: "none", md: "flex" }}
        alignItems={"center"}
      >
        <Icon
          as={Question}
          fontSize={32}
          weight="regular"
          color={"brand.neutral.950"}
          cursor={"pointer"}
          _hover={{
            color: "brand.primary.500",
          }}
        />
        <Icon
          as={Bell}
          fontSize={32}
          weight="regular"
          color={"brand.neutral.950"}
          cursor={"pointer"}
          _hover={{
            color: "brand.primary.500",
          }}
        />
        <Avatar
          name={customer.name}
          size={"sm"}
          color={"white"}
          cursor={"pointer"}
          bgColor={"brand.primary.500"}
        />
      </HStack>
    </Flex>
  );
};
