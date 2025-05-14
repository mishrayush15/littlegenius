import { supabase } from "@/integrations/supabase/client";

// Chapter interface
export interface Chapter {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  order_index: number;
  video_url: string | null;
  quizQuestions: QuizQuestion[];
  flashCards: FlashCard[];
}

// Course interfaces
export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: string;
  chapter_id?: string;
}

export interface FlashCard {
  id: string;
  question: string;
  answer: string;
  color_code: string;
  chapter_id?: string;
}

export interface Course {
  id: string;
  title: string;
  category: string;
  description: string;
  thumbnailUrl: string;
  video_url?: string;
  duration: string;
  level: string;
  featured?: boolean;
  quizQuestions: QuizQuestion[];
  flashCards: FlashCard[];
  chapters: Chapter[];
  created_at?: string;
}

// Fetch all courses from Supabase
export const fetchCourses = async (): Promise<Course[]> => {
  const { data: courses, error } = await supabase
    .from('courses')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error fetching courses:", error);
    throw error;
  }

  // Fetch chapters, quiz questions and flash cards for each course
  const coursesWithDetails = await Promise.all(
    courses.map(async (course) => {
      // Fetch chapters for the course
      const { data: chapters, error: chapterError } = await supabase
        .from('chapters')
        .select('*')
        .eq('course_id', course.id)
        .order('order_index', { ascending: true });

      if (chapterError) {
        console.error("Error fetching chapters:", chapterError);
      }

      const chaptersWithDetails = await Promise.all(
        (chapters || []).map(async (chapter) => {
          // Fetch quiz questions for the chapter
          const { data: quizQuestions, error: quizError } = await supabase
            .from('quiz_questions')
            .select('*')
            .eq('chapter_id', chapter.id);

          if (quizError) {
            console.error("Error fetching quiz questions for chapter:", quizError);
          }

          // Fetch flash cards for the chapter
          const { data: flashCards, error: flashCardError } = await supabase
            .from('flash_cards')
            .select('*')
            .eq('chapter_id', chapter.id);

          if (flashCardError) {
            console.error("Error fetching flash cards for chapter:", flashCardError);
          }

          // Format quiz questions
          const formattedQuizQuestions = quizQuestions?.map(q => ({
            id: q.id,
            question: q.question,
            options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
            correctAnswer: q.correctanswer,
            chapter_id: q.chapter_id
          })) || [];

          // Format flash cards
          const formattedFlashCards = flashCards?.map(f => ({
            id: f.id,
            question: f.question,
            answer: f.answer,
            color_code: f.color_code,
            chapter_id: f.chapter_id
          })) || [];

          return {
            ...chapter,
            quizQuestions: formattedQuizQuestions,
            flashCards: formattedFlashCards
          };
        })
      );

      // Also fetch any legacy quiz questions and flash cards directly linked to the course
      // (for backwards compatibility with existing data)
      const { data: legacyQuizQuestions, error: legacyQuizError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('course_id', course.id)
        .is('chapter_id', null);

      if (legacyQuizError) {
        console.error("Error fetching legacy quiz questions:", legacyQuizError);
      }

      const { data: legacyFlashCards, error: legacyFlashCardError } = await supabase
        .from('flash_cards')
        .select('*')
        .eq('course_id', course.id)
        .is('chapter_id', null);

      if (legacyFlashCardError) {
        console.error("Error fetching legacy flash cards:", legacyFlashCardError);
      }

      // Format legacy quiz questions
      const formattedLegacyQuizQuestions = legacyQuizQuestions?.map(q => ({
        id: q.id,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
        correctAnswer: q.correctanswer
      })) || [];

      // Format legacy flash cards (fixed - was duplicated and had incorrect variable references)
      const formattedLegacyFlashCards = legacyFlashCards?.map(f => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        color_code: f.color_code
      })) || [];

      return {
        ...course,
        thumbnailUrl: course.thumbnailurl || '',
        video_url: course.video_url || '',
        chapters: chaptersWithDetails || [],
        quizQuestions: formattedLegacyQuizQuestions,
        flashCards: formattedLegacyFlashCards
      };
    })
  );

  return coursesWithDetails;
};

// Fetch a specific course by ID
export const fetchCourseById = async (id: string): Promise<Course | null> => {
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    console.error("Error fetching course:", error);
    return null;
  }

  // Fetch chapters for the course
  const { data: chapters, error: chapterError } = await supabase
    .from('chapters')
    .select('*')
    .eq('course_id', id)
    .order('order_index', { ascending: true });

  if (chapterError) {
    console.error("Error fetching chapters:", chapterError);
  }

  const chaptersWithDetails = await Promise.all(
    (chapters || []).map(async (chapter) => {
      // Fetch quiz questions for the chapter
      const { data: quizQuestions, error: quizError } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('chapter_id', chapter.id);

      if (quizError) {
        console.error("Error fetching quiz questions for chapter:", quizError);
      }

      // Fetch flash cards for the chapter
      const { data: flashCards, error: flashCardError } = await supabase
        .from('flash_cards')
        .select('*')
        .eq('chapter_id', chapter.id);

      if (flashCardError) {
        console.error("Error fetching flash cards for chapter:", flashCardError);
      }

      // Format quiz questions
      const formattedQuizQuestions = quizQuestions?.map(q => ({
        id: q.id,
        question: q.question,
        options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
        correctAnswer: q.correctanswer,
        chapter_id: q.chapter_id
      })) || [];

      // Format flash cards (fixed incorrect variable references)
      const formattedFlashCards = flashCards?.map(f => ({
        id: f.id,
        question: f.question,
        answer: f.answer,
        color_code: f.color_code,
        chapter_id: f.chapter_id
      })) || [];

      return {
        ...chapter,
        quizQuestions: formattedQuizQuestions,
        flashCards: formattedFlashCards
      };
    })
  );

  // Also fetch any legacy quiz questions and flash cards directly linked to the course
  const { data: legacyQuizQuestions, error: legacyQuizError } = await supabase
    .from('quiz_questions')
    .select('*')
    .eq('course_id', id)
    .is('chapter_id', null);

  if (legacyQuizError) {
    console.error("Error fetching legacy quiz questions:", legacyQuizError);
  }

  const { data: legacyFlashCards, error: legacyFlashCardError } = await supabase
    .from('flash_cards')
    .select('*')
    .eq('course_id', id)
    .is('chapter_id', null);

  if (legacyFlashCardError) {
    console.error("Error fetching legacy flash cards:", legacyFlashCardError);
  }

  // Format legacy quiz questions
  const formattedLegacyQuizQuestions = legacyQuizQuestions?.map(q => ({
    id: q.id,
    question: q.question,
    options: Array.isArray(q.options) ? q.options : JSON.parse(q.options as string),
    correctAnswer: q.correctanswer
  })) || [];

  // Format legacy flash cards
  const formattedLegacyFlashCards = legacyFlashCards?.map(f => ({
    id: f.id,
    question: f.question,
    answer: f.answer,
    color_code: f.color_code
  })) || [];

  return {
    ...course,
    thumbnailUrl: course.thumbnailurl || '',
    video_url: course.video_url || '',
    chapters: chaptersWithDetails || [],
    quizQuestions: formattedLegacyQuizQuestions,
    flashCards: formattedLegacyFlashCards
  };
};

// Create a new course in Supabase
export const createCourse = async (courseData: Omit<Course, 'id' | 'created_at'>): Promise<Course> => {
  console.log("Creating course with data:", courseData);
  
  // First verify we have an active session
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    console.error("No active session found. User must be logged in to create courses.");
    throw new Error("Authentication required to create courses");
  }
  
  // 1. Insert the course data first
  const { data: newCourse, error } = await supabase
    .from('courses')
    .insert({
      title: courseData.title,
      category: courseData.category,
      description: courseData.description,
      thumbnailurl: courseData.thumbnailUrl, // Match database column name
      video_url: courseData.video_url, // Add video URL
      duration: courseData.duration,
      level: courseData.level,
      featured: courseData.featured || false
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating course:", error);
    throw error;
  }

  console.log("Course created successfully:", newCourse);

  // 2. Insert chapters if any
  if (courseData.chapters && courseData.chapters.length > 0) {
    for (const [index, chapter] of courseData.chapters.entries()) {
      // Insert the chapter
      const { data: newChapter, error: chapterError } = await supabase
        .from('chapters')
        .insert({
          course_id: newCourse.id,
          title: chapter.title,
          description: chapter.description,
          order_index: index,
          video_url: chapter.video_url
        })
        .select()
        .single();

      if (chapterError) {
        console.error("Error adding chapter:", chapterError);
        continue; // Skip to next chapter if there was an error
      }

      // Insert quiz questions for this chapter if any
      if (chapter.quizQuestions && chapter.quizQuestions.length > 0) {
        const quizQuestionsToInsert = chapter.quizQuestions.map(question => ({
          course_id: newCourse.id,
          chapter_id: newChapter.id,
          question: question.question,
          options: JSON.stringify(question.options), // Convert array to JSON string
          correctanswer: question.correctAnswer // Match database column name
        }));

        const { error: quizError } = await supabase
          .from('quiz_questions')
          .insert(quizQuestionsToInsert);

        if (quizError) {
          console.error(`Error adding quiz questions for chapter ${chapter.title}:`, quizError);
        } else {
          console.log(`Quiz questions added successfully for chapter ${chapter.title}.`);
        }
      }

      // Insert flash cards for this chapter if any
      if (chapter.flashCards && chapter.flashCards.length > 0) {
        const flashCardsToInsert = chapter.flashCards.map(card => ({
          course_id: newCourse.id,
          chapter_id: newChapter.id,
          question: card.question,
          answer: card.answer,
          color_code: card.color_code
        }));

        const { error: flashCardError } = await supabase
          .from('flash_cards')
          .insert(flashCardsToInsert);

        if (flashCardError) {
          console.error(`Error adding flash cards for chapter ${chapter.title}:`, flashCardError);
        } else {
          console.log(`Flash cards added successfully for chapter ${chapter.title}.`);
        }
      }
    }
  }

  // 3. If there are any legacy quiz questions (not associated with chapters), add them too
  if (courseData.quizQuestions && courseData.quizQuestions.length > 0) {
    const legacyQuizQuestionsToInsert = courseData.quizQuestions.map(question => ({
      course_id: newCourse.id,
      question: question.question,
      options: JSON.stringify(question.options),
      correctanswer: question.correctAnswer
    }));

    const { error: quizError } = await supabase
      .from('quiz_questions')
      .insert(legacyQuizQuestionsToInsert);

    if (quizError) {
      console.error("Error adding legacy quiz questions:", quizError);
    } else {
      console.log("Legacy quiz questions added successfully.");
    }
  }

  // 4. If there are any legacy flash cards (not associated with chapters), add them too
  if (courseData.flashCards && courseData.flashCards.length > 0) {
    const legacyFlashCardsToInsert = courseData.flashCards.map(card => ({
      course_id: newCourse.id,
      question: card.question,
      answer: card.answer,
      color_code: card.color_code
    }));

    const { error: flashCardError } = await supabase
      .from('flash_cards')
      .insert(legacyFlashCardsToInsert);

    if (flashCardError) {
      console.error("Error adding legacy flash cards:", flashCardError);
    } else {
      console.log("Legacy flash cards added successfully.");
    }
  }

  // 5. Fetch the complete course with chapters, quiz questions and flash cards
  return fetchCourseById(newCourse.id) as Promise<Course>;
};

// Delete a course and all its related data from Supabase
export const deleteCourse = async (courseId: string): Promise<boolean> => {
  // First verify we have an active session
  const { data: sessionData } = await supabase.auth.getSession();
  if (!sessionData.session) {
    console.error("No active session found. User must be logged in to delete courses.");
    throw new Error("Authentication required to delete courses");
  }
  
  try {
    console.log("Deleting course with ID:", courseId);
    
    // 1. Delete all flash cards associated with the course
    const { error: flashCardError } = await supabase
      .from('flash_cards')
      .delete()
      .eq('course_id', courseId);
    
    if (flashCardError) {
      console.error("Error deleting flash cards:", flashCardError);
      throw flashCardError;
    }
    
    // 2. Delete all quiz questions associated with the course
    const { error: quizError } = await supabase
      .from('quiz_questions')
      .delete()
      .eq('course_id', courseId);
    
    if (quizError) {
      console.error("Error deleting quiz questions:", quizError);
      throw quizError;
    }
    
    // 3. Delete all chapters associated with the course
    const { error: chaptersError } = await supabase
      .from('chapters')
      .delete()
      .eq('course_id', courseId);
    
    if (chaptersError) {
      console.error("Error deleting chapters:", chaptersError);
      throw chaptersError;
    }
    
    // 4. Finally delete the course itself
    const { error: courseError } = await supabase
      .from('courses')
      .delete()
      .eq('id', courseId);
    
    if (courseError) {
      console.error("Error deleting course:", courseError);
      throw courseError;
    }
    
    console.log("Course and related data deleted successfully");
    return true;
  } catch (error) {
    console.error("Error during course deletion:", error);
    return false;
  }
};
