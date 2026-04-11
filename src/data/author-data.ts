export interface AuthorSocial {
  linkedin?: string;
  github?: string;
  bluesky?: string;
}

export interface Author {
  name: string;
  role: string;
  avatar: string;
  bio: string;
  social: AuthorSocial;
}

export const authors: Record<string, Author> = {
  juraci: {
    name: "Juraci Paixão Kröhling",
    role: "OpenTelemetry Maintainer & Instructor",
    avatar: "/authors/juraci.jpg",
    bio: "OpenTelemetry maintainer and founder of Telemetry Drops, where he teaches observability engineering through hands-on courses.",
    social: {
      linkedin: "https://www.linkedin.com/in/jpkroehling",
      github: "https://github.com/jpkrohling",
    },
  },
};
