import { api } from "@/app/api";
import { Actions } from "@/app/components/Actions";
import { IUser } from "@/app/utils/types/rest";
import {
  Button,
  useToast,
  Icon,
  Text,
  useDisclosure,
  Flex,
} from "@chakra-ui/react";

import React, { FC, useState } from "react";
import { useSWRConfig } from "swr";

import { BasicModal } from "@/app/components/BasicModal";
import { Question, Scroll, Trash } from "@phosphor-icons/react";
import { UserModalEdit } from "../Edit";

export interface IUserActions {
  data: IUser;
}

export const UserActions: FC<IUserActions> = ({ data }) => {
  const [onLoadingDelete, setOnLoadingDelete] = useState(false);
  const [isEditUserOpen, setIsEditUserOpen] = useState(false);

  const toast = useToast();
  const { mutate } = useSWRConfig();

  const { isOpen, onOpen, onClose } = useDisclosure();

  const onCloseEdit = () => setIsEditUserOpen(false);

  const onDelete = async () => {
    if (onLoadingDelete) return;
    setOnLoadingDelete(true);
    await api
      .delete(`/user/${data.id}`)
      .then(() => {
        toast({
          title: "Sucesso",
          description: "Usuário deletado com sucesso",
          status: "success",
          duration: 2000,
          isClosable: true,
        });
        mutate("/user");
        onClose();
      })
      .catch((error) => {
        toast({
          title: "Erro ao deletar.",
          description: error?.response?.data.message ?? "Algo deu errado",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
      });
    setOnLoadingDelete(false);
  };

  return (
    <>
      <BasicModal
        isOpen={isOpen}
        onClose={onClose}
        modalTitle="Confirmar Ação"
        onSubmit={onDelete}
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          mt="8"
          mb="8"
        >
          <Icon as={Question} fontSize="4xl" color="red" mb="4" />
          <Text>
            Tem certeza que deseja deletar a empresa ?
            <Text fontWeight="bold" as="span">
              {" "}
              {data.name}
            </Text>
          </Text>
          <Text fontSize="sm" color="gray.600" mt="4">
            * Essa ação não poderá ser revertida. *
          </Text>
        </Flex>
      </BasicModal>
      <Actions>
        <Button
          variant="ghost"
          justifyContent="left"
          onClick={onOpen}
          isLoading={onLoadingDelete}
          leftIcon={<Icon color="red" fontSize="20" as={Trash} />}
        >
          Deletar
        </Button>
        <Button
          variant="ghost"
          justifyContent="left"
          onClick={() => setIsEditUserOpen(true)}
          leftIcon={<Icon color="blue.500" fontSize="20" as={Scroll} />}
        >
          Atualizar
        </Button>
      </Actions>
      {isEditUserOpen && (
        <UserModalEdit
          isOpen={isEditUserOpen}
          onClose={onCloseEdit}
          user={data}
        />
      )}
    </>
  );
};
