export const LocaisTypes = [
  { name: "Lindeiro", value: "LINDEIRO" },
  { name: "Hotel", value: "HOTEL" },
  { name: "Pousada", value: "GUESTHOUSE" },
  { name: "Britagem", value: "CRUSHING" },
  { name: "Pedreira", value: "QUARRY" },
  { name: "Depósito Municipal", value: "MUNICIPAL_DEPOSIT" },
  { name: "Depósito Horto", value: "HORTO_DEPOSIT" },
];

export const convertLocalTypesToBR = (type: string) => {
  switch (type) {
    case "LINDEIRO":
      return "Lindeiro";
    case "HOTEL":
      return "Hotel";
    case "GUESTHOUSE":
      return "Pousada";
    case "CRUSHING":
      return "Britagem";
    case "QUARRY":
      return "Pedreira";
    case "MUNICIPAL_DEPOSIT":
      return "Depósito Municipal";
    case "HORTO_DEPOSIT":
      return "Depósito Horto";
  }
};
