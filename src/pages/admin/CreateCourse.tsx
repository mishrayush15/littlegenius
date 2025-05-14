import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { ArrowLeft, Save, BookPlus, Book, Plus } from "lucide-react";
import { createCourse, Course } from "@/services/supabaseService";
import ChapterForm, { ChapterData } from "@/components/ChapterForm";

interface CourseFormData {
  title: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  video_url: string;
  duration: string;
  level: string;
  featured: boolean;
  quizQuestions: any[];
  flashCards: any[];
  chapters: ChapterData[];
}

const CreateCourse = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("details");
  const [isPublishing, setIsPublishing] = useState(false);
  
  const [courseData, setCourseData] = useState<CourseFormData>({
    title: "",
    category: "",
    description: "",
    thumbnailUrl: "",
    video_url: "",
    duration: "",
    level: "Beginner",
    featured: false,
    quizQuestions: [],
    flashCards: [],
    chapters: [],
  });

  const handleCourseDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData(prev => ({ ...prev, [name]: value }));
  };

  const handleFeaturedToggle = (checked: boolean) => {
    setCourseData(prev => ({ ...prev, featured: checked }));
  };

  const handleAddChapter = () => {
    const newChapter: ChapterData = {
      id: `ch-${Date.now()}`,
      title: "",
      description: null,
      video_url: null,
      order_index: courseData.chapters.length,
      quizQuestions: [],
      flashCards: []
    };
    
    setCourseData(prev => ({
      ...prev,
      chapters: [...prev.chapters, newChapter]
    }));
  };

  const handleUpdateChapter = (index: number, updatedChapter: ChapterData) => {
    setCourseData(prev => {
      const chapters = [...prev.chapters];
      chapters[index] = updatedChapter;
      return { ...prev, chapters };
    });
  };

  const handleDeleteChapter = (index: number) => {
    setCourseData(prev => {
      const chapters = [...prev.chapters];
      chapters.splice(index, 1);
      
      // Update order_index values for remaining chapters
      const updatedChapters = chapters.map((chapter, idx) => ({
        ...chapter,
        order_index: idx
      }));
      
      return { ...prev, chapters: updatedChapters };
    });
  };

  const handlePublish = async () => {
    // Validate required fields
    if (!courseData.title || !courseData.description || !courseData.category || !courseData.thumbnailUrl) {
      toast({
        title: "Missing required fields",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Check if there's any content (chapters)
    if (courseData.chapters.length === 0) {
      toast({
        title: "No content",
        description: "Please add at least one chapter to your course",
        variant: "destructive",
      });
      return;
    }

    // Validate that chapters have titles
    for (let i = 0; i < courseData.chapters.length; i++) {
      if (!courseData.chapters[i].title) {
        toast({
          title: "Incomplete chapter",
          description: `Chapter ${i + 1} requires a title`,
          variant: "destructive",
        });
        return;
      }
    }

    setIsPublishing(true);
    
    try {
      // Transform courseData to match the expected Course type
      const courseToCreate: Omit<Course, 'id' | 'created_at'> = {
        title: courseData.title,
        category: courseData.category,
        description: courseData.description,
        thumbnailUrl: courseData.thumbnailUrl,
        video_url: courseData.video_url,
        duration: courseData.duration,
        level: courseData.level,
        featured: courseData.featured,
        quizQuestions: courseData.quizQuestions,
        flashCards: courseData.flashCards,
        chapters: courseData.chapters.map(chapter => ({
          ...chapter,
          course_id: "", // Will be set by createCourse function
          order_index: chapter.order_index !== undefined ? chapter.order_index : 0
        }))
      };
      
      // Create course in Supabase
      const newCourse = await createCourse(courseToCreate);
      console.log("Course created successfully:", newCourse);

      toast({
        title: "Course published!",
        description: "Your course has been published successfully",
      });
      
      // Navigate back to dashboard after successful publishing
      setTimeout(() => {
        navigate("/admin/dashboard");
      }, 3000);
    } catch (error) {
      console.error("Error publishing course:", error);
      toast({
        title: "Error publishing course",
        description: "There was an error publishing your course. Please try again.",
        variant: "destructive",
      });
      setIsPublishing(false);
    }
  };

  // Correctly typed event handler for select element
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCourseData(prev => ({ ...prev, level: e.target.value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-6 flex justify-between items-center">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="mr-4" 
              onClick={() => navigate("/admin/dashboard")}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Create New Course</h1>
          </div>
          <Button 
            onClick={handlePublish}
            disabled={isPublishing}
          >
            <Save className="h-4 w-4 mr-2" />
            {isPublishing ? "Publishing..." : "Publish Course"}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2 w-[400px] mb-8">
            <TabsTrigger value="details">
              <BookPlus className="h-4 w-4 mr-2" />
              Course Details
            </TabsTrigger>
            <TabsTrigger value="chapters">
              <Book className="h-4 w-4 mr-2" />
              Chapters
            </TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-0">
            <Card>
              <CardHeader>
                <CardTitle>Course Details</CardTitle>
                <CardDescription>
                  Fill in the basic information about your course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Course Title*</Label>
                    <Input
                      id="title"
                      name="title"
                      value={courseData.title}
                      onChange={handleCourseDataChange}
                      placeholder="e.g., Python for Beginners"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="category">Category*</Label>
                    <Input
                      id="category"
                      name="category"
                      value={courseData.category}
                      onChange={handleCourseDataChange}
                      placeholder="e.g., Programming"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description*</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={courseData.description}
                    onChange={handleCourseDataChange}
                    placeholder="Describe what students will learn in this course"
                    rows={4}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="thumbnailUrl">Thumbnail URL*</Label>
                    <Input
                      id="thumbnailUrl"
                      name="thumbnailUrl"
                      value={courseData.thumbnailUrl}
                      onChange={handleCourseDataChange}
                      placeholder="URL for course thumbnail image"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="duration">Duration*</Label>
                    <Input
                      id="duration"
                      name="duration"
                      value={courseData.duration}
                      onChange={handleCourseDataChange}
                      placeholder="e.g., 2 hours, 4 weeks"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="level">Level</Label>
                    <select
                      id="level"
                      name="level"
                      value={courseData.level}
                      onChange={handleLevelChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    >
                      <option value="Beginner">Beginner</option>
                      <option value="Intermediate">Intermediate</option>
                      <option value="Advanced">Advanced</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="featured">Featured Course</Label>
                      <Switch
                        id="featured"
                        checked={courseData.featured}
                        onCheckedChange={handleFeaturedToggle}
                      />
                    </div>
                    <p className="text-xs text-gray-500">Featured courses are highlighted on the home page</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={() => setActiveTab("chapters")}>
                  Continue to Chapters
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          
          <TabsContent value="chapters" className="mt-0">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Course Chapters</h2>
                <Button onClick={handleAddChapter}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Chapter
                </Button>
              </div>
              
              {courseData.chapters.length === 0 ? (
                <Card>
                  <CardContent className="py-8">
                    <div className="text-center">
                      <Book className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                      <h3 className="text-lg font-medium mb-2">No Chapters Added Yet</h3>
                      <p className="text-gray-500 mb-4">
                        Add chapters to your course with video links, quizzes, and flashcards
                      </p>
                      <Button onClick={handleAddChapter}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add First Chapter
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {courseData.chapters.map((chapter, index) => (
                    <ChapterForm
                      key={chapter.id}
                      index={index}
                      chapter={chapter}
                      onUpdate={handleUpdateChapter}
                      onDelete={handleDeleteChapter}
                    />
                  ))}
                </div>
              )}
            </div>
            
            <div className="flex justify-end">
              <Button 
                onClick={handlePublish} 
                disabled={isPublishing || courseData.chapters.length === 0}
              >
                <Save className="h-4 w-4 mr-2" />
                {isPublishing ? "Publishing..." : "Publish Course"}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CreateCourse;
