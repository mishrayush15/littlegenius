
import { useState } from 'react';

interface FlipCardProps {
  frontContent: string;
  backContent: string;
  colorCode?: string;
}

const FlipCard: React.FC<FlipCardProps> = ({ frontContent, backContent, colorCode = '#f5f5f5' }) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="cursor-pointer perspective-1000 w-full h-[300px]"
      onClick={handleFlip}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`relative w-full h-full transition-transform duration-500 transform-style-preserve-3d ${
          isFlipped ? 'rotate-y-180' : ''
        }`}
        style={{
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
          transition: 'transform 0.6s'
        }}
      >
        {/* Front of card - Question */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center p-6 rounded-lg backface-hidden"
          style={{
            backgroundColor: colorCode,
            backfaceVisibility: 'hidden'
          }}
        >
          <h3 className="text-lg font-bold mb-4">Question</h3>
          <p className="text-center">{frontContent}</p>
          <div className="mt-4 text-sm text-gray-600">Click to reveal answer</div>
        </div>

        {/* Back of card - Answer */}
        <div
          className="absolute w-full h-full flex flex-col items-center justify-center p-6 rounded-lg backface-hidden rotate-y-180"
          style={{
            backgroundColor: colorCode,
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <h3 className="text-lg font-bold mb-4">Answer</h3>
          <p className="text-center">{backContent}</p>
          <div className="mt-4 text-sm text-gray-600">Click to see question again</div>
        </div>
      </div>
    </div>
  );
};

export default FlipCard;
