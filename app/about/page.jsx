import { redirect } from "next/navigation";

/**
 * /about now lives merged into the landing page at "/".
 * This keeps old bookmarks/links working by redirecting there.
 */
export default function AboutRedirect() {
  redirect("/");
}
