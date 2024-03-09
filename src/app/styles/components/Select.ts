export const Select = {
  variants: {
    secondary: {
      field: {
        bg: "brand.neutral.200",
        color: "brand.neutral.500",
        border: "none",
        px: 4,
        h: "45px",
        letterSpacing: "0.02em",
        _placeholder: {
          color: "brand.neutral.500",
        },
        _focus: {
          border: "1px solid #8B5CF6",
        },
        cursor: "pointer",
      },
      icon: {
        color: "brand.neutral.500",
      },
    },
  },
};
