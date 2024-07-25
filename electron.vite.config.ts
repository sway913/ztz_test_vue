import { resolve } from "path";
import { defineConfig, externalizeDepsPlugin, bytecodePlugin } from "electron-vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  main: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
    resolve: {
      alias: {
        "@resources": resolve("resources"),
        "@main": resolve("src/main"),
        "@common": resolve("src/common"),
        "@constants": resolve("src/constants"),
        "@interfaces": resolve("src/interfaces"),
        "@utils": resolve("src/utils"),
        "@preload": resolve("src/preload"),
      },
    },
    build: {
      minify: "esbuild",
    },
  },
  preload: {
    plugins: [externalizeDepsPlugin(), bytecodePlugin()],
  },
  renderer: {
    resolve: {
      alias: {
        "@renderer": resolve("src/renderer/src"),
        "@common": resolve("src/common"),
      },
    },
    plugins: [vue()],
  },
});
