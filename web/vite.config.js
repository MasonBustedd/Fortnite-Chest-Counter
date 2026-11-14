import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

// One self-contained page (script and styles inside): the counter serves it from its embedded resources, no internet.
// The output goes to the project, where the exe build picks it up (src/ChestCounter/gui/index.html).
export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    outDir: '../src/ChestCounter/gui',
    emptyOutDir: true,
  },
});
