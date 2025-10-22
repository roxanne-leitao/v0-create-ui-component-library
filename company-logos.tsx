import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
}

export function SalesforceLogo({ className }: LogoProps) {
  return (
    <img src="/salesforce-logo.svg" alt="Salesforce" width={20} height={19} className={cn("inline-block", className)} />
  )
}

export function NetSuiteLogo({ className }: LogoProps) {
  return (
    <img src="/netsuite-logo.svg" alt="NetSuite" width={20} height={19} className={cn("inline-block", className)} />
  )
}
