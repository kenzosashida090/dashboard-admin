import type { PaletteMode } from "@mui/material";


export const tokensDark = {
primary: {
    100: "#dffae6",
    200: "#bff5cd",
    300: "#9ff0b3",
    400: "#7feb9a",
    500: "#5fe681",
    600: "#4cb867",
    700: "#398a4d",
    800: "#265c34",
    900: "#132e1a"
},

secondary: {
    100: "#d0d0d0",
    200: "#a0a0a0",
    300: "#717171",
    400: "#414141",
    500: "#121212",
    600: "#0e0e0e",
    700: "#0b0b0b",
    800: "#070707",
    900: "#040404"
},

warning: {
    100: "#ecd7b2",
    200: "#d7ac61",
   300:" #a87a2a",
},
danger :{
    100: "#eb9e9e",
    200: "#d94a4a",
    300: "#9c2121",
},
info:{
    100: "#92b2e5",
    200: "#4077d1",
    300:"#21498a",
}
}

function reverseTokens(tokensDark:Record<string, Record<string,string>>) {
  const reversedTokens : Record<string, Record<string, string>>  = {};
  Object.entries(tokensDark).forEach(([key, val]) => {
    const keys = Object.keys(val as Record<string, string>);
    const values = Object.values(val as  Record<string, string>);
    const length = keys.length;
    const reversedObj: Record<string, string>  = {} ;
    for (let i = 0; i < length; i++) {
      reversedObj[keys[i]] = values[length - i - 1];
    }
    reversedTokens[key] = reversedObj;
  });
  return reversedTokens;
}
export const tokensLight = reverseTokens(tokensDark);

export const themeSettings = (mode:PaletteMode) => {
  return {
    palette: {
      mode: mode,
      ...(mode === "dark"
        ? {
            // palette values for dark mode
            primary: {
              ...tokensDark.primary,
              main: tokensDark.primary[400],
              light: tokensDark.primary[400],
            },
            secondary: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            neutral: {
              ...tokensDark.secondary,
              main: tokensDark.secondary[300],
            },
            background: {
              default: tokensDark.secondary[500],
              alt: tokensDark.secondary[400],
            },
          }
        : {
            // palette values for light mode
            primary: {
              ...tokensLight.primary,
              main: tokensDark.secondary[100],
              light: tokensDark.secondary[200],
            },
            secondary: {
              ...tokensLight.secondary,
              main: tokensDark.secondary[600],
              light: tokensDark.secondary[700],
            },
            neutral: {
              ...tokensLight.grey,
              main: tokensDark.secondary[400],
            },
            background: {
              default: tokensDark.secondary[100],
              alt: tokensDark.secondary[200],
            },
          }),
    },
    typography: {
      fontFamily: ["Inter", "sans-serif"].join(","),
      fontSize: 12,
      h1: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 40,
      },
      h2: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 32,
      },
      h3: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 24,
      },
      h4: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 20,
      },
      h5: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 16,
      },
      h6: {
        fontFamily: ["Inter", "sans-serif"].join(","),
        fontSize: 14,
      },
    },
  };
};