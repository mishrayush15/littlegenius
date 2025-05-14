
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, Book, Trash2 } from "lucide-react";
import { fetchCourses, deleteCourse } from "@/services/supabaseService";
import { useToast } from "@/components/ui/use-toast";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [courses, setCourses] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      setIsLoading(true);
      try {
        const fetchedCourses = await fetchCourses();
        setCourses(fetchedCourses);
        console.log("Admin dashboard - Fetched courses:", fetchedCourses);
      } catch (error) {
        console.error("Failed to fetch courses:", error);
        toast({
          title: "Error loading courses",
          description: "There was a problem loading your courses.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [toast]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleCreateCourse = () => {
    navigate("/admin/create-course");
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (window.confirm("Are you sure you want to delete this course? This action cannot be undone.")) {
      setIsDeleting(true);
      try {
        const success = await deleteCourse(courseId);
        
        if (success) {
          // Remove the course from the local state
          setCourses(courses.filter(course => course.id !== courseId));
          toast({
            title: "Course deleted",
            description: "The course has been successfully deleted.",
          });
        } else {
          toast({
            title: "Error deleting course",
            description: "There was a problem deleting the course. Please try again.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error during course deletion:", error);
        toast({
          title: "Error deleting course",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-xl font-semibold">Your Courses</h2>
          <Button onClick={handleCreateCourse}>
            <Plus className="h-4 w-4 mr-2" />
            Create New Course
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-32 bg-gray-100 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-10 text-center">
            <p className="text-gray-500 mb-4">You haven't created any courses yet</p>
            <Button onClick={handleCreateCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Course
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {courses.map((course) => (
              <Card key={course.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col md:flex-row">
                    <div className="w-full md:w-48 h-32 relative">
                      <img 
                        src={course.thumbnailUrl} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = "https://placehold.co/600x400?text=No+Image";
                        }}
                      />
                      {course.featured && (
                        <div className="absolute top-2 left-2 bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded-full">
                          Featured
                        </div>
                      )}
                    </div>
                    <div className="p-5 flex-grow flex flex-col justify-between">
                      <div>
                        <h3 className="font-semibold text-lg mb-1">{course.title}</h3>
                        <p className="text-sm text-gray-500">
                          {course.category} • {course.level} • {course.duration}
                        </p>
                        <p className="text-sm text-gray-600 mt-2 line-clamp-1">
                          {course.description}
                        </p>
                      </div>
                      <div className="mt-4 flex items-center gap-2">
                        <div className="flex-grow flex gap-2">
                          <div className="flex items-center text-sm text-gray-500">
                            <Book className="h-4 w-4 mr-1" />
                            {course.quizQuestions?.length || 0} Questions
                          </div>
                          <span className="text-gray-300 mx-2">|</span>
                          <div className="text-sm text-gray-500">
                            {course.flashCards?.length || 0} Flashcards
                          </div>
                        </div>
                        <div>
                          <Button 
                            size="sm" 
                            variant="destructive"
                            onClick={() => handleDeleteCourse(course.id)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
