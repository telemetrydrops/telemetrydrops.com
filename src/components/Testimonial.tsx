
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface TestimonialProps {
  quote: string;
  author: string;
  role?: string;
  company?: string;
  avatarUrl?: string;
  className?: string;
}

const Testimonial = ({ 
  quote, 
  author, 
  role, 
  company, 
  avatarUrl,
  className 
}: TestimonialProps) => {
  const initials = author
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <div className={cn(
      "flex flex-col h-full rounded-lg border bg-card p-6 shadow",
      className
    )}>
      <div className="text-lg italic text-muted-foreground flex-grow mb-6">
        "{quote}"
      </div>
      
      <div className="flex items-center space-x-4 mt-auto">
        <Avatar className="h-12 w-12 border-2 border-telemetria-orange/30">
          {avatarUrl && <AvatarImage src={avatarUrl} alt={author} />}
          <AvatarFallback className="bg-telemetria-orange/20 text-telemetria-orange">
            {initials}
          </AvatarFallback>
        </Avatar>
        
        <div>
          <div className="font-semibold">{author}</div>
          {(role || company) && (
            <div className="text-sm text-muted-foreground">
              {role}
              {role && company && ", "}
              {company}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Testimonial;
