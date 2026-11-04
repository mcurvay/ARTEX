import { translate } from "@/i18n";
import { cn } from "@/lib/utils"
import { Loader2Icon } from "lucide-react"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <Loader2Icon data-slot="spinner" role="status" aria-label={translate("Loading")} className={cn("size-4 animate-spin", className)} {...props} />
  )
}

export { Spinner }
