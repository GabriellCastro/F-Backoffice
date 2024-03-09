"use client";

import { FC, ReactNode } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  Box,
} from "@chakra-ui/react";
import { usePathname } from "next/navigation";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalTitle: string;
  children: ReactNode;
  onSubmit?: () => void;
  isLoading?: boolean;
}

export const BasicModal: FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  modalTitle,
  isLoading,
  onSubmit,
}) => {
  const pathname = usePathname();
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      isCentered
      size={"xl"}
      motionPreset="slideInBottom"
      onEsc={onClose}
      scrollBehavior={"inside"}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader borderBottom={"1px solid #E2E8F0"}>
          {modalTitle}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>{children}</ModalBody>
        {pathname !== "/dashboard/mapa" ? (
          <ModalFooter
            borderTop={"1px solid #E2E8F0"}
            display={"flex"}
            flexDir={"column"}
          >
            <Text
              fontSize={"12px"}
              color={"brand.neutral.500"}
              mb={"4"}
              w={"100%"}
              bg={"red.100"}
              rounded={"md"}
              textAlign={"center"}
              p={"2"}
            >
              Obs: Em situações em que realizar edições ou criar um novo
              registro seja necessário, é crucial notar que ao fechar o modal
              sem salvar, todas as modificações realizadas serão perdidas.
            </Text>
            <Box
              display={"flex"}
              justifyContent={"flex-end"}
              alignItems={"center"}
              w={"100%"}
            >
              <Button
                mr={3}
                variant="outline"
                onClick={onClose}
                fontSize={"14px"}
              >
                Cancelar
              </Button>
              <Button
                colorScheme="brand.primary.500"
                h={"40px"}
                fontSize={"14px"}
                onClick={onSubmit}
                isLoading={isLoading}
              >
                Salvar
              </Button>
            </Box>
          </ModalFooter>
        ) : null}
      </ModalContent>
    </Modal>
  );
};
