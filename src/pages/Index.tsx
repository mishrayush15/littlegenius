
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import CategorySection from "@/components/CategorySection";
import CourseCard from "@/components/CourseCard";
import Footer from "@/components/Footer";
import ChatBot from "@/components/ChatBot";
import { fetchCourses } from "@/services/supabaseService";

const Index = () => {
  const coursesSectionRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchActive, setSearchActive] = useState(false);
  
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch courses from database
  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const fetchedCourses = await fetchCourses();
        setCourses(fetchedCourses);
        console.log("Fetched courses:", fetchedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, []);

  // Extract featured courses
  const featuredCourses = courses.filter(course => course.featured);
  
  const getCoursesToDisplay = () => {
    // Filter by category if not "all"
    let coursesArr = [...courses];
    
    if (selectedCategory !== "all") {
      coursesArr = coursesArr.filter(course => 
        course.category.toLowerCase() === selectedCategory.toLowerCase()
      );
    }

    // Filter by search query
    if (searchActive && searchQuery.trim() !== "") {
      coursesArr = coursesArr.filter((course) =>
        course.title.toLowerCase().includes(searchQuery.trim().toLowerCase())
      );
    }

    return coursesArr;
  };

  const handleSearch = (q: string) => {
    setSearchQuery(q);
    setSearchActive(true);
    setSelectedCategory("all");
  };

  const scrollToCourses = () => {
    setTimeout(() => {
      if (coursesSectionRef.current) {
        coursesSectionRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 0);
  };

  const handleEnrollCourse = (courseId: string | number) => {
    navigate(`/course/${courseId}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        onSearch={handleSearch}
        onCoursesClick={scrollToCourses}
        onHomeClick={() => window.location.reload()}
      />
      <main className="flex-grow">
        <Hero
          tagline="Access over 100+ high quality free life changing courses taught by experts and upgrade your skill or learn new skills"
          onExploreCoursesClick={scrollToCourses}
        />
        <CategorySection />

        <section className="py-10 px-6 md:px-10" ref={coursesSectionRef} id="courses-section">
          <div className="container mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-bold mb-2 flex items-center justify-center gap-2">
                <span className="text-amber-500" style={{
                  background: "linear-gradient(90deg, #F6D365 0%, #FDA085 100%)",
                  backgroundClip: "text",
                  color: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}>★</span>{" "}
                Featured Courses
              </h2>
              <p className="text-gray-600 max-w-lg mx-auto">
                Our handpicked, most promising free courses for you.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {isLoading ? (
                // Show loading placeholders
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="bg-gray-100 h-96 rounded-lg animate-pulse"></div>
                ))
              ) : featuredCourses.length > 0 ? (
                // Show fetched featured courses
                featuredCourses.map((course) => (
                  <CourseCard 
                    key={course.id} 
                    {...course} 
                    featured={true} 
                    onEnroll={() => handleEnrollCourse(course.id)}
                  />
                ))
              ) : (
                <p className="col-span-4 text-center text-gray-500 py-10">No featured courses available. Login as admin to create courses.</p>
              )}
            </div>
          </div>
        </section>

        <section className="py-14 px-6 md:px-10" id="popular-courses">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-bold mb-3">Our Popular Free Courses</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Start your learning journey with our most popular courses. All completely free!
              </p>
            </div>
            <div className="hidden md:flex justify-center mb-8">
              <input
                className="border outline-none rounded-l-md px-4 py-2 w-96 text-base font-medium bg-white shadow focus:ring-2 focus:ring-primary focus:border-primary"
                type="text"
                placeholder="Search for a course…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter") setSearchActive(true); }}
                aria-label="Search courses"
              />
              <Button
                className="rounded-l-none font-semibold"
                onClick={() => setSearchActive(true)}
                variant="secondary"
              >
                Search
              </Button>
              {searchActive && (
                <Button
                  variant="ghost"
                  className="rounded-md ml-2 text-sm"
                  onClick={() => { setSearchActive(false); setSearchQuery(""); }}>
                  Clear
                </Button>
              )}
            </div>
            <Tabs defaultValue="all" value={selectedCategory} className="w-full">
              <div className="flex justify-center mb-8">
                <TabsList className="grid grid-cols-3 md:grid-cols-7 gap-1 bg-gray-100 p-1">
                  <TabsTrigger
                    value="all"
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-sm"
                    onClick={() => setSelectedCategory("all")}
                  >
                    All
                  </TabsTrigger>
                  <TabsTrigger
                    value="programming"
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-sm"
                    onClick={() => setSelectedCategory("programming")}
                  >
                    Programming
                  </TabsTrigger>
                  <TabsTrigger
                    value="design"
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-sm"
                    onClick={() => setSelectedCategory("design")}
                  >
                    Design
                  </TabsTrigger>
                  <TabsTrigger
                    value="business"
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-sm"
                    onClick={() => setSelectedCategory("business")}
                  >
                    Business
                  </TabsTrigger>
                  <TabsTrigger
                    value="marketing"
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-sm"
                    onClick={() => setSelectedCategory("marketing")}
                  >
                    Marketing
                  </TabsTrigger>
                  <TabsTrigger
                    value="money"
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-sm"
                    onClick={() => setSelectedCategory("money")}
                  >
                    Money
                  </TabsTrigger>
                  <TabsTrigger
                    value="computational"
                    className="data-[state=active]:bg-white rounded-md data-[state=active]:shadow-sm"
                    onClick={() => setSelectedCategory("computational")}
                  >
                    Comp. Thinking
                  </TabsTrigger>
                </TabsList>
              </div>
              <TabsContent value={selectedCategory} className="mt-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {isLoading ? (
                    // Show loading placeholders
                    Array.from({ length: 8 }).map((_, i) => (
                      <div key={i} className="bg-gray-100 h-96 rounded-lg animate-pulse"></div>
                    ))
                  ) : getCoursesToDisplay().length === 0 ? (
                    <div className="text-center text-lg text-gray-500 col-span-full py-20 opacity-70">
                      {!searchQuery
                        ? "No courses available in this category. Login as admin to create courses."
                        : `No courses found for "${searchQuery}".`}
                    </div>
                  ) : (
                    getCoursesToDisplay().map((course) => (
                      <CourseCard
                        key={course.id}
                        {...course}
                        featured={course.featured}
                        onEnroll={() => handleEnrollCourse(course.id)}
                      />
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        <section className="py-16 px-6 md:px-10 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-3xl mx-4 md:mx-10 my-10">
          <div className="container mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              Join thousands of young learners and start your journey with our completely free courses today.
            </p>
            
            <p className="mt-6 text-sm text-gray-500">
              Are you an instructor? <a href="/login" className="text-primary hover:underline">Login</a> to create courses
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
