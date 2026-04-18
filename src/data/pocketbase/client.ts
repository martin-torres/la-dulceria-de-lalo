import PocketBase from 'pocketbase';

export const pbClient = new PocketBase(
  import.meta.env.VITE_POCKETBASE_URL || 'http://localhost:8090'
);

pbClient.autoCancellation(false);

