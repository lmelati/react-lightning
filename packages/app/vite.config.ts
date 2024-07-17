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
    entry: path.resolve(__dirname, "../react-lightning/dist/index.js"),
    name: "React Lightning",
    fileName: "react-lighhtning",
  },
});
