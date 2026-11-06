import type { CSSProperties } from "react";
import { BrandIcon } from "@/components/ui/icons";
import type { SkillIcon } from "@/lib/skill-icons";

type SkillLabelProps = {
  name: string;
  icon: SkillIcon | null;
};

/** A skill name with its optional brand icon. Takes a resolved icon so it also runs on the client. */
export function SkillLabel({ name, icon }: SkillLabelProps) {
  const style = icon && {
    "--brand-dark": icon.brandDark,
    "--brand-light": icon.brandLight,
  };

  return (
    <span className="skill inline-flex items-center gap-1.5" style={style as CSSProperties}>
      {icon && <BrandIcon path={icon.path} className="skill-icon size-4 shrink-0" />}
      {name}
    </span>
  );
}
