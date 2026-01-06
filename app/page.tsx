import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import Header from "./_shared/Header";
import Hero from "./_shared/Hero";

/**
 * Render the home page layout with header, hero, and decorative background elements.
 *
 * The root element contains the shared Header and Hero components plus four absolutely
 * positioned, blurred circular divs used for background decoration.
 *
 * @returns A JSX element containing the header, hero, and four positioned blurred circular decorative divs.
 */
export default function Home() {
  return (
    <div>
      <Header/>
      <Hero/>
      <div className="absolute -top-40 -left-40 h-[500px] w-[500px] bg-amber-600/40 blur-[120px] rounded-full"></div>
      <div className="absolute top-20 right-[0px] h-[500px] w-[500px] bg-orange-400/40 blur-[130px] rounded-full"></div>
      <div className="absolute bottom-[0px] -left-0 h-[500px] w-[500px] bg-orange-300/40 blur-[130px] rounded-full"></div>
      <div className="absolute top-[200px] left-1/8 h-[500px] w-[500px] bg-amber-600/40 blur-[130px] rounded-full"></div>

    </div>
  );
}