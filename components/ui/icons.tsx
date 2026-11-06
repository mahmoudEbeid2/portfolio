import type { JSX, SVGProps } from "react";

export type IconProps = SVGProps<SVGSVGElement>;

function BaseIcon({ children, ...props }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" focusable="false" {...props}>
      {children}
    </svg>
  );
}

export function GitHubIcon(props: IconProps) {
  return (
    <BaseIcon fill="currentColor" {...props}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </BaseIcon>
  );
}

export function BrandIcon({ path, ...props }: IconProps & { path: string }) {
  return (
    <BaseIcon fill="currentColor" {...props}>
      <path d={path} />
    </BaseIcon>
  );
}

export function LinkedInIcon(props: IconProps) {
  return (
    <BaseIcon fill="currentColor" {...props}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </BaseIcon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <BaseIcon fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="3" y="5" width="18" height="14" />
      <path d="m3 6 9 7 9-7" />
    </BaseIcon>
  );
}

export function PhoneIcon(props: IconProps) {
  return (
    <BaseIcon fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z" />
    </BaseIcon>
  );
}

export function MenuIcon(props: IconProps) {
  return (
    <BaseIcon fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M3 7h18M9 15h12" />
    </BaseIcon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <BaseIcon fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="m5 5 14 14M19 5 5 19" />
    </BaseIcon>
  );
}

export function PlayIcon(props: IconProps) {
  return (
    <BaseIcon fill="currentColor" {...props}>
      <path d="M7 4v16l13-8z" />
    </BaseIcon>
  );
}

export function SunIcon(props: IconProps) {
  return (
    <BaseIcon fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <rect x="8" y="8" width="8" height="8" />
      <path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9 7 7M17 17l2.1 2.1M4.9 19.1 7 17M17 7l2.1-2.1" />
    </BaseIcon>
  );
}

export function MoonIcon(props: IconProps) {
  return (
    <BaseIcon fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
      <path d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5z" />
    </BaseIcon>
  );
}

export type SocialPlatform = "github" | "linkedin" | "email" | "phone";

export const socialIcons: Record<SocialPlatform, (props: IconProps) => JSX.Element> = {
  github: GitHubIcon,
  linkedin: LinkedInIcon,
  email: MailIcon,
  phone: PhoneIcon,
};
