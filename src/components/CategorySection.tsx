
import { Link } from "react-router-dom";
import { Code, BookOpen, Briefcase, DollarSign, Brain } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  name: string;
  icon: React.ElementType;
  courses: number;
  color: string;
  bgColor: string;
}

const categories: Category[] = [
  {
    name: "Programming",
    icon: Code,
    courses: 42,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    name: "Design",
    icon: BookOpen,
    courses: 35,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  },
  {
    name: "Business",
    icon: Briefcase,
    courses: 28,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Marketing",
    icon: BookOpen,
    courses: 24,
    color: "text-red-600",
    bgColor: "bg-red-50"
  },
  {
    name: "Money Management",
    icon: DollarSign,
    courses: 19,
    color: "text-amber-600",
    bgColor: "bg-amber-50"
  },
  {
    name: "Computational Thinking",
    icon: Brain,
    courses: 31,
    color: "text-teal-600",
    bgColor: "bg-teal-50"
  }
];

const CategorySection = () => {
  return (
    <section className="py-12 px-6 md:px-10 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3">Explore Categories</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Discover a world of free learning opportunities across various subjects tailored for young minds.
          </p>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
          {categories.map((category) => (
            <Link
              to={`/category/${category.name.toLowerCase()}`}
              key={category.name}
              className="category-card block"
              style={{ aspectRatio: "1", minWidth: "140px", minHeight: "140px" }}
            >
              <div
                className={
                  cn(
                    "flex flex-col items-center justify-center p-6 rounded-xl border border-gray-100 bg-white h-full w-full transition-all duration-300",
                    category.bgColor,
                    "group hover:shadow-xl hover:-translate-y-1"
                  )
                }
                style={{
                  boxSizing: "border-box",
                  height: "100%",
                  width: "100%",
                  transition: "box-shadow 0.3s, border-color 0.3s"
                }}
              >
                <div
                  className={cn("p-4 rounded-lg mb-3 transition-colors duration-300", category.bgColor, "group-hover:bg-yellow-50")}
                  style={{
                    boxShadow: "0 4px 20px rgba(255, 215, 0, 0.10)"
                  }}
                >
                  <category.icon className={cn("h-7 w-7", category.color)} />
                </div>
                <h3 className="font-bold text-base text-center">{category.name}</h3>
                
                {/* Gold border on hover */}
                <div className="pointer-events-none absolute inset-0 rounded-xl group-hover:border-2 group-hover:border-yellow-400 group-hover:shadow-yellow-200/80"></div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategorySection;
