import { ButtonLink } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { OutlineSquare } from "@/components/ui/outline-square";

export default function NotFound() {
  return (
    <Container className="flex flex-col items-start gap-6 py-24">
      <OutlineSquare size={48} tone="primary" />
      <h1 className="text-[32px] font-semibold">
        <span className="text-primary">404</span> — page not found
      </h1>
      <p>The page you&apos;re looking for doesn&apos;t exist or has moved.</p>
      <ButtonLink href="/">Back home -&gt;</ButtonLink>
    </Container>
  );
}
