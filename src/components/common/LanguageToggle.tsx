"use client";

import { useRouter }    from "next/navigation";
import { motion }        from "framer-motion";
import { Globe }         from "lucide-react";
import { useLocale }     from "next-intl";

export function LanguageToggle() {
  const router = useRouter();
  const locale = useLocale();

  const toggle = () => {
    const next = locale === "en" ? "bn" : "en";
    document.cookie = `locale=${next};path=/;max-age=${365 * 24 * 60 * 60}`;
    router.refresh();
  };

  return (
    <motion.button
      whileTap={{ scale: 0.9 }}
      onClick={toggle}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-accent transition-colors text-sm"
    >
      <Globe className="w-3.5 h-3.5" />
      <span className="font-medium">{locale === "en" ? "বাংলা" : "EN"}</span>
    </motion.button>
  );
}
