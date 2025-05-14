
import React, { useState } from "react";
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { FileText, Video } from "lucide-react";
import { Chapter } from "@/services/supabaseService";

interface ChapterAccordionProps {
  chapters: Chapter[];
  onOpenVideo: (url: string) => void;
  onStartQuiz: (chapterId: string) => void;
  onStartFlashcards: (chapterId: string) => void;
}

const ChapterAccordion: React.FC<ChapterAccordionProps> = ({
  chapters,
  onOpenVideo,
  onStartQuiz,
  onStartFlashcards
}) => {
  const [expandedChapter, setExpandedChapter] = useState<string | null>(
    chapters.length > 0 ? chapters[0].id : null
  );

  const handleValueChange = (value: string) => {
    setExpandedChapter(value === expandedChapter ? null : value);
  };

  if (chapters.length === 0) {
    return <div className="text-center p-4">No chapters available for this course.</div>;
  }

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      value={expandedChapter || undefined}
      onValueChange={handleValueChange}
    >
      {chapters.map((chapter) => (
        <AccordionItem key={chapter.id} value={chapter.id}>
          <AccordionTrigger className="text-left">
            <div className="flex items-center">
              <span className="text-lg font-medium">{chapter.title}</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="space-y-4 py-2">
              {chapter.description && (
                <div className="text-sm text-gray-600">
                  {chapter.description}
                </div>
              )}

              <div className="space-y-2">
                {chapter.video_url && (
                  <Button 
                    variant="outline" 
                    className="w-full flex justify-between items-center"
                    onClick={() => onOpenVideo(chapter.video_url || '')}
                  >
                    <span>Watch Lecture</span>
                    <Video className="h-4 w-4 ml-2" />
                  </Button>
                )}

                {chapter.quizQuestions.length > 0 && (
                  <Button 
                    variant="outline"
                    className="w-full flex justify-between items-center"
                    onClick={() => onStartQuiz(chapter.id)}
                  >
                    <span>Start Quiz ({chapter.quizQuestions.length} questions)</span>
                    <FileText className="h-4 w-4 ml-2" />
                  </Button>
                )}

                {chapter.flashCards.length > 0 && (
                  <Button 
                    variant="outline"
                    className="w-full flex justify-between items-center"
                    onClick={() => onStartFlashcards(chapter.id)}
                  >
                    <span>Study Flashcards ({chapter.flashCards.length} cards)</span>
                    <FileText className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
};

export default ChapterAccordion;
