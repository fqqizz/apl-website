import JsonLd from "@/components/seo/JsonLd";
import { pageBreadcrumb } from "@/lib/structured-data";

export default function BreadcrumbJsonLd({ pageName, path }: { pageName: string; path: string }) {
  return <JsonLd data={pageBreadcrumb(pageName, path)} />;
}
