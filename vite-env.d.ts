/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_POCKETBASE_URL: string
  readonly NODE_ENV: 'development' | 'production' | 'test'
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}