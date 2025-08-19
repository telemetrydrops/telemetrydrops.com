import { toast as sonnerToast } from "sonner"

// Simplified toast hook that wraps Sonner
export const useToast = () => {
  const toast = ({
    title,
    description,
    variant = "default",
  }: {
    title: string
    description?: string
    variant?: "default" | "destructive"
  }) => {
    if (variant === "destructive") {
      sonnerToast.error(title, {
        description,
      })
    } else {
      sonnerToast.success(title, {
        description,
      })
    }
  }

  return { toast }
}

export { sonnerToast as toast }