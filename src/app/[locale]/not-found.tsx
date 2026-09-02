import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function NotFound() {
  const t = useTranslations("notFound");
  return (
    <div className="flex min-h-[70vh] items-center justify-center p-6">
      <div className="text-center">
        <p className="text-5xl font-black text-primary">404</p>
        <p className="mt-3 text-sm text-muted-foreground">{t("message")}</p>
        <Link
          href="/"
          className="mt-6 inline-flex h-10 items-center rounded-full bg-primary px-5 text-sm font-semibold text-primary-foreground"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
