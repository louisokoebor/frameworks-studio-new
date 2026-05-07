import { createClient } from "tinacms/dist/client";
import { queries } from "./types";
export const client = createClient({ url: 'http://localhost:4001/graphql', token: 'ed9f72bf5d2f71b060b0b94606f39f67a81423dd', queries,  });
export default client;
  