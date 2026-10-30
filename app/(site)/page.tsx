import { ButtonLink } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { DotGrid } from "@/components/ui/dot-grid";
import { socialIcons } from "@/components/ui/icons";
import { Logo } from "@/components/ui/logo";
import { OutlineSquare } from "@/components/ui/outline-square";
import { SectionTitle } from "@/components/ui/section-title";
import { Tag } from "@/components/ui/tag";

// Temporary design-system preview; replaced by the real home page.
export default function Home() {
  return (
    <div className="py-16">
      <Container className="flex flex-col gap-12">
        <Logo />
        <h1 className="text-[32px] font-semibold">
          Mahmoud is a <span className="text-primary">backend engineer</span>
        </h1>
        <SectionTitle name="projects" viewAllHref="/projects" />
        <div className="flex flex-wrap gap-4">
          <ButtonLink href="/contacts">Contact me !!</ButtonLink>
          <ButtonLink href="https://github.com/mahmoudEbeid2" variant="secondary">
            GitHub &gt;=
          </ButtonLink>
        </div>
        <Card className="max-w-sm gap-2 p-4">
          <h3 className="text-2xl font-medium">Card title</h3>
          <p>Card body text.</p>
          <div className="flex flex-wrap gap-2">
            <Tag>Node.js</Tag>
            <Tag>PostgreSQL</Tag>
          </div>
        </Card>
        <div className="flex items-center gap-8">
          <DotGrid cols={5} rows={5} />
          <OutlineSquare size={64} tone="primary" />
          <OutlineSquare size={48} />
          {Object.entries(socialIcons).map(([name, Icon]) => (
            <Icon key={name} className="size-8" />
          ))}
        </div>
      </Container>
    </div>
  );
}
