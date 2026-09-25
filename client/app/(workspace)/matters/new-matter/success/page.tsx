import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

export default function MatterSuccess() {
  return (
    <div className="flex flex-col gap-3 items-center">
      <Check className="bg-[#028d2b] p-4 text-white rounded-full h-20 w-20" />
      <h4 className="text-4xl font-bold ">Matter Created successfully</h4>
      <p className="text-gray-500">Get started manging today</p>
      <div className="flex gap-x-6 mt-6">
        <Link href="/">
          <Button>View matter</Button>
        </Link>
        <Link href="/">
          <Button variant={"outline"}>Create Another matter</Button>
        </Link>
      </div>
    </div>
  );
}
