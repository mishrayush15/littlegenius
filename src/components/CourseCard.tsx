
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";

interface CourseCardProps {
  id: string | number;
  title: string;
  category: string;
  image?: string;
  thumbnailUrl?: string;
  rating?: number;
  totalLessons?: number;
  duration?: string;
  level?: string;
  featured?: boolean;
  onEnroll?: () => void;
}

const CourseCard = ({
  title,
  category,
  image,
  thumbnailUrl,
  rating = 4.5,
  totalLessons,
  duration,
  level = "Beginner",
  featured,
  onEnroll,
}: CourseCardProps) => {
  // Use thumbnailUrl (from database) if available, otherwise use image (from hardcoded data)
  const imageUrl = thumbnailUrl || (image ? `https://images.unsplash.com/${image}?auto=format&fit=crop&w=480&q=80` : "https://via.placeholder.com/480x360");

  return (
    <Card className="course-card overflow-hidden">
      <div className="relative">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-48 object-cover"
          style={{
            background: "#f3f4fa",
          }}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://via.placeholder.com/480x360?text=Image+Error";
          }}
        />
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1">
          {featured && (
            <span
              className="text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wide"
              style={{
                background:
                  "linear-gradient(90deg, #f6d365 0%, #fda085 100%)",
                color: "#a06007",
                border: "1px solid #ffe29f",
                boxShadow: "0 1px 5px 0 #fffbe5b0",
              }}
            >
              Featured
            </span>
          )}
          <span className="free-tag">Free</span>
        </div>
      </div>
      <CardContent className="p-4">
        <span className="text-xs font-semibold text-primary">{category}</span>
        <h3 className="font-bold text-lg mt-1 line-clamp-2 h-14">{title}</h3>
        <div className="flex items-center gap-1 mt-2">
          <div className="flex items-center text-yellow-500">
            <Star size={16} fill="currentColor" />
          </div>
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
          <span className="text-xs text-gray-500">
            ({Math.floor(Math.random() * 500) + 100} reviews)
          </span>
        </div>
        <div className="flex gap-3 mt-3 text-xs text-gray-500">
          {totalLessons && <span>{totalLessons} lessons</span>}
          {duration && <span>{duration}</span>}
          {(totalLessons || duration) && <span>•</span>}
          <span>{level}</span>
        </div>
        <Button className="w-full mt-4 font-medium" onClick={onEnroll}>
          Enroll Now
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
