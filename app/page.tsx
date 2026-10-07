import { Today } from "@/components/Today";
import { getCatalog } from "@/lib/content";
export default function Home() {
  return <Today topics={getCatalog()} />;
}
