// theme.js

// 1. import `extendTheme` function
import { defineTextStyles } from "@chakra-ui/react";

// 2. Add your color mode config
const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const theme = defineTextStyles({ config })


export default theme;