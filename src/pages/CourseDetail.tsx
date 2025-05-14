
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, ChevronLeft, ChevronRight, FileText as FileTextIcon, Video as VideoIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { fetchCourseById } from "@/services/supabaseService";
import FlipCard from "@/components/FlipCard";
import ChapterAccordion from "@/components/ChapterAccordion";

// Import the interfaces from supabaseService
import type { Course, QuizQuestion, FlashCard, Chapter } from "@/services/supabaseService";

const CourseDetail = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showFlashcards, setShowFlashcards] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);
  const [currentFlashcardIndex, setCurrentFlashcardIndex] = useState(0);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [activeFlashcards, setActiveFlashcards] = useState<FlashCard[]>([]);

  // Fetch course data
  useEffect(() => {
    if (!courseId) return;
    
    const fetchCourse = async () => {
      setLoading(true);
      try {
        const data = await fetchCourseById(courseId);
        console.log("CourseDetail - Fetched course:", data);
        
        if (data) {
          setCourse(data);
          // If course has chapters, default to the first one
          if (data.chapters && data.chapters.length > 0) {
            setActiveChapter(data.chapters[0]);
          }
        } else {
          toast({
            title: "Course not found",
            description: "The requested course could not be found",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Error fetching course:", error);
        toast({
          title: "Error",
          description: "Failed to load course details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId, toast]);

  const handleStartQuiz = (chapterId: string) => {
    if (!course) return;
    
    // Find the chapter and set its quiz questions as active
    const chapter = course.chapters.find(ch => ch.id === chapterId);
    if (chapter) {
      setActiveChapter(chapter);
      setActiveQuestions(chapter.quizQuestions);
      // Reset quiz state
      setCurrentQuestionIndex(0);
      setSelectedAnswers({});
      setQuizCompleted(false);
      setScore(0);
      setShowQuiz(true);
    }
  };

  const handleStartFlashcards = (chapterId: string) => {
    if (!course) return;
    
    // Find the chapter and set its flashcards as active
    const chapter = course.chapters.find(ch => ch.id === chapterId);
    if (chapter) {
      setActiveChapter(chapter);
      setActiveFlashcards(chapter.flashCards);
      // Reset flashcard state
      setCurrentFlashcardIndex(0);
      setShowFlashcards(true);
    }
  };

  const handleSelectAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
  };

  const handleNextQuestion = () => {
    if (activeQuestions.length === 0) return;
    
    if (currentQuestionIndex < (activeQuestions.length - 1)) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Calculate score
      let correctCount = 0;
      activeQuestions.forEach(q => {
        if (selectedAnswers[q.id] === q.correctAnswer) {
          correctCount++;
        }
      });
      
      const finalScore = correctCount;
      const totalQuestions = activeQuestions.length;
      const percentage = (finalScore / totalQuestions) * 100;
      
      setScore(finalScore);
      setQuizCompleted(true);

      // Show toast with result
      toast({
        title: percentage >= 60 ? "Great job!" : "Keep practicing!",
        description: `You scored ${finalScore} out of ${totalQuestions} (${Math.round(percentage)}%)`,
        variant: percentage >= 60 ? "default" : "destructive",
      });
    }
  };

  const nextFlashcard = () => {
    if (activeFlashcards.length === 0) return;
    
    if (currentFlashcardIndex < (activeFlashcards.length - 1)) {
      setCurrentFlashcardIndex(prev => prev + 1);
    }
  };

  const prevFlashcard = () => {
    if (currentFlashcardIndex > 0) {
      setCurrentFlashcardIndex(prev => prev - 1);
    }
  };

  const goBackToHome = () => {
    navigate("/");
  };

  const openVideoLink = (videoUrl: string) => {
    if (!videoUrl) return;
    
    // Open the video in a new tab
    window.open(videoUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Course Not Found</h2>
        <Button onClick={goBackToHome}>Back to Home</Button>
      </div>
    );
  }

  // Quiz Mode
  if (showQuiz && activeQuestions.length > 0) {
    if (quizCompleted) {
      const totalQuestions = activeQuestions.length;
      const percentage = (score / totalQuestions) * 100;
      const isPassed = percentage >= 60;

      return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
          <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-center mb-6">
                {activeChapter?.title} - Quiz Complete!
              </h2>
              
              <div className="text-center mb-8">
                <div className={`text-5xl font-bold mb-2 ${isPassed ? 'text-green-500' : 'text-amber-500'}`}>
                  {score}/{totalQuestions}
                </div>
                <p className="text-gray-500">Your Score: {Math.round(percentage)}%</p>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <h3 className="text-xl font-semibold mb-3">
                  {isPassed ? "Great job!" : "Keep practicing!"}
                </h3>
                <p className="text-gray-600">
                  {isPassed 
                    ? "You've demonstrated a good understanding of the material. Keep up the great work!" 
                    : "Don't worry! Learning takes time. Review the material and try again when you're ready."}
                </p>
              </div>
              
              <Button 
                onClick={() => setShowQuiz(false)} 
                className="w-full"
                variant="default"
              >
                Return to Course
              </Button>
            </div>
          </div>
        </div>
      );
    }

    const currentQuestion = activeQuestions[currentQuestionIndex];
    
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-8">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-2">
                {activeChapter?.title} - Quiz
              </h2>
              <p className="text-sm text-gray-500">
                Question {currentQuestionIndex + 1} of {activeQuestions.length}
              </p>
              <h3 className="text-xl font-bold mt-3">{currentQuestion.question}</h3>
            </div>
            
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <div 
                  key={index} 
                  onClick={() => handleSelectAnswer(currentQuestion.id, option)}
                  className={`p-3 border rounded-lg cursor-pointer transition-all ${
                    selectedAnswers[currentQuestion.id] === option 
                      ? 'border-primary bg-primary/10' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="flex items-center justify-center h-6 w-6 rounded-full bg-gray-100 text-sm font-medium mr-3">
                      {String.fromCharCode(65 + index)}
                    </span>
                    {option}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button 
                variant="outline" 
                onClick={() => setShowQuiz(false)}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Exit Quiz
              </Button>
              <Button 
                onClick={handleNextQuestion}
                disabled={!selectedAnswers[currentQuestion.id]}
              >
                {currentQuestionIndex === activeQuestions.length - 1 
                  ? "Complete Quiz" 
                  : "Next Question"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Flashcard Mode
  if (showFlashcards && activeFlashcards.length > 0) {
    const currentFlashcard = activeFlashcards[currentFlashcardIndex];
    const isLastCard = currentFlashcardIndex === activeFlashcards.length - 1;
    
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6">
            {activeChapter?.title} - Flashcards
          </h2>
          
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <FlipCard 
                frontContent={currentFlashcard.question}
                backContent={currentFlashcard.answer}
                colorCode={currentFlashcard.color_code}
              />
            </div>
            
            <div className="p-4 flex justify-between items-center border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Card {currentFlashcardIndex + 1} of {activeFlashcards.length}
              </p>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  onClick={prevFlashcard}
                  disabled={currentFlashcardIndex === 0}
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
                {isLastCard ? (
                  <Button onClick={() => setShowFlashcards(false)}>
                    Return to Course
                  </Button>
                ) : (
                  <Button 
                    onClick={nextFlashcard}
                    disabled={isLastCard}
                  >
                    <ChevronRight className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Course Details View
  return (
    <div className="min-h-screen bg-gray-50">
      <div 
        className="bg-cover bg-center h-64 relative" 
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.7)), url(${course.thumbnailUrl})`,
        }}
      >
        <div className="container mx-auto px-4 h-full flex flex-col justify-center text-white">
          <Button 
            variant="ghost" 
            className="text-white absolute top-4 left-4 hover:bg-white/20" 
            onClick={goBackToHome}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="mt-10">
            <h1 className="text-3xl md:text-4xl font-bold">{course.title}</h1>
            <div className="flex flex-wrap gap-4 mt-3">
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                {course.level}
              </span>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                {course.category}
              </span>
              <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
                {course.duration}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-10">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Course Description</h2>
          <p className="text-gray-600 mb-8">{course.description}</p>

          {/* Chapter accordion for courses with chapters */}
          {course.chapters.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">Course Content</h2>
              <ChapterAccordion 
                chapters={course.chapters}
                onOpenVideo={openVideoLink}
                onStartQuiz={handleStartQuiz}
                onStartFlashcards={handleStartFlashcards}
              />
            </div>
          )}

          {/* Legacy content support for courses without chapters */}
          {course.chapters.length === 0 && (
            <>
              {course.video_url && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-3 rounded-full">
                        <VideoIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Course Video</h3>
                        <p className="text-gray-600 mb-4">
                          Watch the course video to enhance your learning experience
                        </p>
                        <Button onClick={() => openVideoLink(course.video_url || '')}>
                          Watch Video
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {course.quizQuestions.length > 0 && (
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-3 rounded-full">
                        <FileTextIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Course Quiz</h3>
                        <p className="text-gray-600 mb-4">
                          Test your knowledge with {course.quizQuestions.length} questions
                        </p>
                        <Button onClick={() => {
                          setActiveQuestions(course.quizQuestions);
                          setCurrentQuestionIndex(0);
                          setSelectedAnswers({});
                          setQuizCompleted(false);
                          setScore(0);
                          setShowQuiz(true);
                        }}>
                          Take Quiz
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {course.flashCards.length > 0 && (
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 bg-primary/10 p-3 rounded-full">
                        <FileTextIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Flashcards</h3>
                        <p className="text-gray-600 mb-4">
                          Review {course.flashCards.length} study cards with questions and answers
                        </p>
                        <Button onClick={() => {
                          setActiveFlashcards(course.flashCards);
                          setCurrentFlashcardIndex(0);
                          setShowFlashcards(true);
                        }}>
                          Study Flashcards
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;
