export interface TopicItem {
  name: string;
  grades: number[]; // which grades see this topic
}

export interface SubjectConfig {
  id: string;
  name: string;
  emoji: string;
  color: string; // tailwind bg class
  topics: TopicItem[];
}

export const SUBJECTS: SubjectConfig[] = [
  {
    id: "math",
    name: "Math",
    emoji: "🔢",
    color: "bg-primary/10",
    topics: [
      { name: "Counting", grades: [0, 1] },
      { name: "Addition", grades: [0, 1, 2] },
      { name: "Subtraction", grades: [0, 1, 2] },
      { name: "Shapes", grades: [0, 1] },
      { name: "Patterns", grades: [0, 1] },
      { name: "Multiplication", grades: [2, 3] },
      { name: "Division", grades: [2, 3] },
      { name: "Place Value", grades: [2, 3] },
      { name: "Telling Time", grades: [2, 3] },
      { name: "Money", grades: [2, 3] },
      { name: "Basic Fractions", grades: [2, 3] },
      { name: "Fractions", grades: [4, 5] },
      { name: "Decimals", grades: [4, 5] },
      { name: "Long Division", grades: [4, 5] },
      { name: "Order of Operations", grades: [4, 5] },
      { name: "Geometry", grades: [4, 5] },
      { name: "Area & Perimeter", grades: [4, 5] },
      { name: "Ratios", grades: [6] },
      { name: "Percentages", grades: [6] },
      { name: "Integers", grades: [6] },
      { name: "Basic Algebra", grades: [6] },
      { name: "Data & Statistics", grades: [6] },
    ],
  },
  {
    id: "reading",
    name: "Reading & Language Arts",
    emoji: "📖",
    color: "bg-secondary/10",
    topics: [
      { name: "Sight Words", grades: [0, 1] },
      { name: "Phonics", grades: [0, 1] },
      { name: "Letter Sounds", grades: [0, 1] },
      { name: "Rhyming", grades: [0, 1] },
      { name: "Simple Sentences", grades: [0, 1] },
      { name: "Reading Comprehension", grades: [2, 3] },
      { name: "Grammar", grades: [2, 3] },
      { name: "Punctuation", grades: [2, 3] },
      { name: "Vocabulary", grades: [2, 3] },
      { name: "Spelling", grades: [2, 3] },
      { name: "Main Idea & Details", grades: [4, 5] },
      { name: "Inference", grades: [4, 5] },
      { name: "Parts of Speech", grades: [4, 5] },
      { name: "Writing Sentences", grades: [4, 5] },
      { name: "Synonyms & Antonyms", grades: [4, 5] },
      { name: "Context Clues", grades: [6] },
      { name: "Figurative Language", grades: [6] },
      { name: "Essay Structure", grades: [6] },
      { name: "Root Words", grades: [6] },
      { name: "Summarizing", grades: [6] },
    ],
  },
  {
    id: "science",
    name: "Science",
    emoji: "🔬",
    color: "bg-success/10",
    topics: [
      { name: "Animals", grades: [0, 1] },
      { name: "Plants", grades: [0, 1] },
      { name: "Weather", grades: [0, 1] },
      { name: "Senses", grades: [0, 1] },
      { name: "Seasons", grades: [0, 1] },
      { name: "Life Cycles", grades: [2, 3] },
      { name: "States of Matter", grades: [2, 3] },
      { name: "Simple Machines", grades: [2, 3] },
      { name: "Habitats", grades: [2, 3] },
      { name: "Earth & Space", grades: [2, 3] },
      { name: "Ecosystems", grades: [4, 5] },
      { name: "Force & Motion", grades: [4, 5] },
      { name: "Human Body", grades: [4, 5] },
      { name: "Water Cycle", grades: [4, 5] },
      { name: "Electricity", grades: [4, 5] },
      { name: "Cells", grades: [6] },
      { name: "Energy", grades: [6] },
      { name: "Earth Science", grades: [6] },
      { name: "Scientific Method", grades: [6] },
      { name: "Chemistry Basics", grades: [6] },
    ],
  },
];

export function getTopicsForGrade(grade: number): SubjectConfig[] {
  return SUBJECTS.map((subject) => ({
    ...subject,
    topics: subject.topics.filter((t) => t.grades.includes(grade)),
  })).filter((s) => s.topics.length > 0);
}
