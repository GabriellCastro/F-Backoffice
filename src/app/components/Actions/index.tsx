import {
  Button,
  Flex,
  Icon,
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverCloseButton,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react";
import { DotsThree } from "@phosphor-icons/react";

import React, { FC } from "react";

export interface IActions {
  children: React.ReactNode;
}

export const Actions: FC<IActions> = ({ children }) => {
  return (
    <Popover isLazy placement="left-start">
      <PopoverTrigger>
        <Button variant="ghost">
          <Icon as={DotsThree} fontSize="20" />
        </Button>
      </PopoverTrigger>
      <PopoverContent backgroundColor="#fff" w="150px" boxShadow={"md"}>
        <PopoverArrow />
        <PopoverBody>
          <Flex flexDir="column">{children}</Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};
