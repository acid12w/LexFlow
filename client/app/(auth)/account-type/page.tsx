import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@/components/ui/field";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import Link from "next/link";

function AccountType() {
  return (
    <main className="h-screen flex flex-col justify-center items-center gap-y-8">
      <div className="text-center">
        <h1 className="text-2xl">what you want to do</h1>
        <p> Lorem ipsum dolor sit amet consectetur.</p>
      </div>

      <div className="flex gap-8">
        <Link href="/join-firm">
          <div className="border-2 rounded-md p-4 hover:bg-[#E7F4FF] hover:text-[#279AFF] hover:border-[#279AFF] cursor-pointer">
            <p>
              Create a New Firm I'm setting
              <br /> up a new law practice
              <br /> account
            </p>
          </div>
        </Link>

        <Link href="create-firm">
          <div className="border-2 rounded-md p-4 hover:bg-[#E7F4FF] hover:text-[#279AFF] hover:border-[#279AFF] cursor-pointer">
            <p>
              Create a New Firm I'm setting
              <br /> up a new law practice
              <br /> account
            </p>
          </div>
        </Link>
      </div>
    </main>
  );
}

export default AccountType;
