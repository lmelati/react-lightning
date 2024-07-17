import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const isExternal = (id: string) => !id.startsWith(".") && !path.isAbsolute(id);

const getBaseConfig = ({ plugins = [react()], lib }) =>
  defineConfig({
    plugins,
    server: {
      port: 5172,
    },
    build: {
      lib,
      rollupOptions: {
        external: isExternal,
        output: {
          globals: {
            react: "React",
          },
        },
      },
    },
  });

export default getBaseConfig({
  lib: {
    entry: path.resolve(__dirname, "../react-smartv/dist/index.js"),
    name: "ReactSmarTV",
    fileName: "react-smartv",
  },
});
