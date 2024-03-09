export const userOptions = [
  { name: "Gestor", value: "MANAGER" },
  { name: "Cliente", value: "CLIENT" },
  { name: "Operador", value: "OPERATOR" },
];

export const userProfileOptions = [
  { name: "Op Retro", value: "OP_RETRO" },
  { name: "Op Escavadeira", value: "OP_EXCAVATOR" },
  { name: "Op Rolo", value: "OP_ROLO" },
  { name: "Op Motoniveladora", value: "OP_MOTORLEVELER" },
  { name: "Motorista de Caçamba", value: "DUMP_TRUCK_DRIVER" },
  { name: "Motorista de Caçambão", value: "LARGE_DUMP_TRUCK_DRIVER" },
  { name: "Motorista de Plataforma", value: "PLATFORM_TRUCK_DRIVER" },
];

export const convertUserRoleToBR = (type: string) => {
  switch (type) {
    case "MANAGER":
      return "Gestor";
    case "OPERATOR":
      return "Operador";
    case "ADMINISTRATOR":
      return "Administrador";
    case "CLIENT":
      return "Cliente";
  }
};
