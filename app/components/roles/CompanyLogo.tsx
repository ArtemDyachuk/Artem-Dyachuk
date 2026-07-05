import { companyInitials } from "@/lib/companyDisplay";
import styles from "./RolesList.module.css";

type CompanyLogoProps = {
  name: string;
  logoUrl?: string | null;
};

export default function CompanyLogo({ name, logoUrl }: CompanyLogoProps) {
  if (logoUrl) {
    return (
      <div className={styles.companyLogo}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoUrl} alt="" className={styles.companyLogoImage} />
      </div>
    );
  }

  return (
    <div className={styles.companyLogoInitials} aria-hidden>
      {companyInitials(name)}
    </div>
  );
}
