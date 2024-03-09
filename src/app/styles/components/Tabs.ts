import { tabsAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(tabsAnatomy.keys);

// define the base component styles
const baseStyle = definePartsStyle({
  // define the part you're going to style
  root: {
    boxShadow: "none",
  },
  tab: {
    fontWeight: "semibold",
    color: "brand.neutral.500",
    _hover: {
      bg: "rgba(139, 92, 246, 0.2)",
      color: "brand.primary.500",
    },
    rounded: "md",
    width: "100%",
    _selected: {
      bg: "rgba(139, 92, 246, 0.2)",
      color: "brand.primary.500",
      border: "none",
    },
  },
  tablist: {
    p: "2",
    rounded: "lg",
    gap: "2",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    ml: "4",
    bg: "brand.neutral.50",
    width: "11rem",
  },
  tabpanel: {
    p: 0,
  },
});

// export the component theme
export const Tabs = defineMultiStyleConfig({ baseStyle });
