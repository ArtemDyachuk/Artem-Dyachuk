import "server-only";

import { getClientFirestore } from "@/lib/firebase";

export function getServerFirestore() {
  return getClientFirestore();
}
