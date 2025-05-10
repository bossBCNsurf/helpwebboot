import { redirect } from "next/navigation"

export default function LocalePage() {
  // Redirigimos al workspace público directamente
  redirect("/es/default")
}
