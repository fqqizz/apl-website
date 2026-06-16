import JsonLd from "@/components/seo/JsonLd";
import { globalSchemaGraph } from "@/lib/structured-data";

export default function GlobalSeoSchemas() {
  return <JsonLd data={globalSchemaGraph()} />;
}
