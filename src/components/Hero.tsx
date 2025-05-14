
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface HeroProps {
  tagline?: string;
  onExploreCoursesClick?: () => void;
}

const Hero = ({ tagline, onExploreCoursesClick }: HeroProps) => {
  return (
    <section className="hero-gradient py-16 px-6 md:px-10">
      <div className="container mx-auto">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 leading-tight">
              <span className="text-primary">Little Genius:</span> Unlock Your <span className="text-secondary">Potential</span>
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              {tagline ||
                "Access over 100+ high quality free life changing courses taught by experts and upgrade your skill or learn new skills"}
            </p>
            <div>
              <Button
                size="lg"
                variant="outline"
                className="font-semibold text-base px-6"
                onClick={onExploreCoursesClick}
              >
                Explore Courses <ArrowRight size={18} className="ml-2" />
              </Button>
            </div>
          </div>
          <div className="order-1 md:order-2 relative">
            <div className="relative z-10 animate-float">
              <img
                src="https://images.pexels.com/photos/20556421/pexels-photo-20556421/free-photo-of-smiling-girl-and-boys-sitting-under-walls-with-letters-at-school.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
                alt="Cheerful student learning online"
                className="rounded-2xl shadow-xl"
                style={{ maxHeight: 340, objectFit: "cover" }}
              />
            </div>
            <div className="absolute top-10 -right-4 md:-right-10 z-0 w-32 h-32 bg-secondary opacity-20 rounded-full blur-xl"></div>
            <div className="absolute bottom-10 -left-4 md:-left-10 z-0 w-32 h-32 bg-primary opacity-20 rounded-full blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
