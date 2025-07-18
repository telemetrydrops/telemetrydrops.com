
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  centered?: boolean;
  className?: string;
}

const SectionHeading = ({ title, subtitle, centered = false, className }: SectionHeadingProps) => {
  return (
    <div className={cn(
      "mb-12",
      centered && "text-center",
      className
    )}>
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">{title}</h2>
      {subtitle && (
        <p className="mt-3 text-lg text-muted-foreground max-w-3xl">
          {subtitle}
        </p>
      )}
      <div className={cn(
        "h-1 w-20 mt-6 bg-telemetria-yellow",
        centered ? "mx-auto" : "ml-0"
      )} />
    </div>
  );
};

export default SectionHeading;
