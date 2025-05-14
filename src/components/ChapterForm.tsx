
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Video, Plus, BookOpen, FileText } from "lucide-react";
import { Chapter } from "@/services/supabaseService";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Updated ChapterData interface to match Chapter interface requirements
export interface ChapterData {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  quizQuestions: {
    id: string;
    question: string;
    options: string[];
    correctAnswer: string;
  }[];
  flashCards: {
    id: string;
    question: string;
    answer: string;
    color_code: string;
  }[];
  order_index?: number; // Added to match Chapter interface
  course_id?: string; // Added to match Chapter interface
}

interface ChapterFormProps {
  index: number;
  chapter: ChapterData;
  onUpdate: (index: number, chapter: ChapterData) => void;
  onDelete: (index: number) => void;
}

const ChapterForm: React.FC<ChapterFormProps> = ({
  index,
  chapter,
  onUpdate,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const updatedChapter = {
      ...chapter,
      [name]: value,
    };
    onUpdate(index, updatedChapter);
  };

  const handleAddFlashcard = () => {
    const newFlashcard = {
      id: `fc-${Date.now()}`,
      question: "",
      answer: "",
      color_code: "#F2FCE2"
    };
    
    const updatedChapter = {
      ...chapter,
      flashCards: [...chapter.flashCards, newFlashcard]
    };
    
    onUpdate(index, updatedChapter);
  };

  const handleUpdateFlashcard = (cardIndex: number, field: string, value: string) => {
    const updatedFlashcards = [...chapter.flashCards];
    updatedFlashcards[cardIndex] = {
      ...updatedFlashcards[cardIndex],
      [field]: value
    };
    
    const updatedChapter = {
      ...chapter,
      flashCards: updatedFlashcards
    };
    
    onUpdate(index, updatedChapter);
  };

  const handleDeleteFlashcard = (cardIndex: number) => {
    const updatedFlashcards = [...chapter.flashCards];
    updatedFlashcards.splice(cardIndex, 1);
    
    const updatedChapter = {
      ...chapter,
      flashCards: updatedFlashcards
    };
    
    onUpdate(index, updatedChapter);
  };

  const handleAddQuizQuestion = () => {
    const newQuestion = {
      id: `qq-${Date.now()}`,
      question: "",
      options: ["", "", "", ""],
      correctAnswer: ""
    };
    
    const updatedChapter = {
      ...chapter,
      quizQuestions: [...chapter.quizQuestions, newQuestion]
    };
    
    onUpdate(index, updatedChapter);
  };

  const handleUpdateQuizQuestion = (questionIndex: number, field: string, value: string | string[]) => {
    const updatedQuizQuestions = [...chapter.quizQuestions];
    updatedQuizQuestions[questionIndex] = {
      ...updatedQuizQuestions[questionIndex],
      [field]: value
    };
    
    const updatedChapter = {
      ...chapter,
      quizQuestions: updatedQuizQuestions
    };
    
    onUpdate(index, updatedChapter);
  };

  const handleUpdateQuizOption = (questionIndex: number, optionIndex: number, value: string) => {
    const updatedQuizQuestions = [...chapter.quizQuestions];
    const options = [...updatedQuizQuestions[questionIndex].options];
    options[optionIndex] = value;
    
    updatedQuizQuestions[questionIndex] = {
      ...updatedQuizQuestions[questionIndex],
      options
    };
    
    const updatedChapter = {
      ...chapter,
      quizQuestions: updatedQuizQuestions
    };
    
    onUpdate(index, updatedChapter);
  };

  const handleDeleteQuizQuestion = (questionIndex: number) => {
    const updatedQuizQuestions = [...chapter.quizQuestions];
    updatedQuizQuestions.splice(questionIndex, 1);
    
    const updatedChapter = {
      ...chapter,
      quizQuestions: updatedQuizQuestions
    };
    
    onUpdate(index, updatedChapter);
  };

  const handleAccordionChange = (value: string) => {
    setActiveTab(value === activeTab ? null : value);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">
          Chapter {index + 1}: {chapter.title || "Untitled Chapter"}
        </CardTitle>
        <Button
          variant="destructive"
          size="sm"
          onClick={() => onDelete(index)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor={`title-${chapter.id}`}>Chapter Title*</Label>
          <Input 
            id={`title-${chapter.id}`}
            name="title"
            value={chapter.title || ''}
            onChange={handleInputChange}
            placeholder="Enter chapter title"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`description-${chapter.id}`}>Description</Label>
          <Textarea
            id={`description-${chapter.id}`}
            name="description"
            value={chapter.description || ''}
            onChange={handleInputChange}
            placeholder="Enter chapter description"
            rows={3}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor={`video_url-${chapter.id}`}>Video URL</Label>
          <div className="flex">
            <Input
              id={`video_url-${chapter.id}`}
              name="video_url"
              value={chapter.video_url || ''}
              onChange={handleInputChange}
              placeholder="YouTube or Vimeo URL"
              className="flex-1"
            />
            <Button
              variant="outline"
              type="button"
              size="sm"
              className="ml-2"
              disabled={!chapter.video_url}
            >
              <Video className="h-4 w-4 mr-1" />
              Test
            </Button>
          </div>
        </div>

        <Accordion type="single" collapsible className="w-full border rounded-md" onValueChange={handleAccordionChange}>
          {/* Flashcards Section */}
          <AccordionItem value="flashcards">
            <AccordionTrigger className="px-4">
              <div className="flex items-center">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Flashcards ({chapter.flashCards.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 pb-4">
              <div className="space-y-4">
                {chapter.flashCards.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No flashcards added yet
                  </div>
                ) : (
                  chapter.flashCards.map((card, cardIndex) => (
                    <Card key={card.id} className="border border-gray-200">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Flashcard {cardIndex + 1}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteFlashcard(cardIndex)}
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`flashcard-question-${card.id}`}>Question</Label>
                            <Textarea
                              id={`flashcard-question-${card.id}`}
                              value={card.question}
                              onChange={(e) => handleUpdateFlashcard(cardIndex, "question", e.target.value)}
                              placeholder="Enter question"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`flashcard-answer-${card.id}`}>Answer</Label>
                            <Textarea
                              id={`flashcard-answer-${card.id}`}
                              value={card.answer}
                              onChange={(e) => handleUpdateFlashcard(cardIndex, "answer", e.target.value)}
                              placeholder="Enter answer"
                              className="mt-1"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`flashcard-color-${card.id}`}>Card Color</Label>
                            <div className="flex mt-1 gap-2">
                              <Input
                                id={`flashcard-color-${card.id}`}
                                type="color"
                                value={card.color_code}
                                onChange={(e) => handleUpdateFlashcard(cardIndex, "color_code", e.target.value)}
                                className="w-12 h-10 p-1"
                              />
                              <div 
                                className="flex-1 rounded-md p-2" 
                                style={{ backgroundColor: card.color_code }}
                              >
                                Preview color
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleAddFlashcard}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Flashcard
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Quiz Section */}
          <AccordionItem value="quiz">
            <AccordionTrigger className="px-4">
              <div className="flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                <span>Quiz Questions ({chapter.quizQuestions.length})</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="px-4 pt-2 pb-4">
              <div className="space-y-4">
                {chapter.quizQuestions.length === 0 ? (
                  <div className="text-center py-4 text-gray-500">
                    No quiz questions added yet
                  </div>
                ) : (
                  chapter.quizQuestions.map((question, questionIndex) => (
                    <Card key={question.id} className="border border-gray-200">
                      <CardContent className="pt-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium">Question {questionIndex + 1}</h4>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => handleDeleteQuizQuestion(questionIndex)}
                            className="h-8 w-8 p-0 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-3">
                          <div>
                            <Label htmlFor={`quiz-question-${question.id}`}>Question</Label>
                            <Textarea
                              id={`quiz-question-${question.id}`}
                              value={question.question}
                              onChange={(e) => handleUpdateQuizQuestion(questionIndex, "question", e.target.value)}
                              placeholder="Enter question"
                              className="mt-1"
                            />
                          </div>
                          
                          <div className="space-y-2">
                            <Label>Answer Options</Label>
                            {question.options.map((option, optionIndex) => (
                              <div key={optionIndex} className="flex items-center gap-2">
                                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100">
                                  {String.fromCharCode(65 + optionIndex)}
                                </div>
                                <Input
                                  value={option}
                                  onChange={(e) => handleUpdateQuizOption(questionIndex, optionIndex, e.target.value)}
                                  placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                                  className="flex-1"
                                />
                              </div>
                            ))}
                          </div>
                          
                          <div>
                            <Label htmlFor={`quiz-correct-${question.id}`}>Correct Answer</Label>
                            <select
                              id={`quiz-correct-${question.id}`}
                              value={question.correctAnswer}
                              onChange={(e) => handleUpdateQuizQuestion(questionIndex, "correctAnswer", e.target.value)}
                              className="w-full mt-1 rounded-md border border-input bg-background px-3 py-2 text-sm"
                            >
                              <option value="">Select correct answer</option>
                              {question.options.map((option, optionIndex) => (
                                <option key={optionIndex} value={option} disabled={!option.trim()}>
                                  {option ? `${String.fromCharCode(65 + optionIndex)}: ${option}` : `Option ${String.fromCharCode(65 + optionIndex)} (empty)`}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleAddQuizQuestion}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Quiz Question
                </Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default ChapterForm;
