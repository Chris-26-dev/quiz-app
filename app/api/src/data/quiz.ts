// app/api/src/data/quiz.ts
export type RadioQuestion = {
    id: number;
    type: "radio";
    question: string;
    choices: string[];
    correctIndex: number;
};

export type CheckboxQuestion = {
    id: number;
    type: "checkbox";
    question: string;
    choices: string[];
    correctIndexes: number[];
};

export type TextQuestion = {
    id: number;
    type: "text";
    question: string;
    correctText: string;
};

export type Question = RadioQuestion | CheckboxQuestion | TextQuestion;

export const quizQuestions: Question[] = [
    {
        id: 1,
        type: "radio",
        question: "Which hook is used to manage state in a React component?",
        choices: ["useEffect", "useState", "useContext", "useRef"],
        correctIndex: 1,
    },
    {
        id: 2,
        type: "checkbox",
        question: "Which of the following are JavaScript frameworks?",
        choices: ["React", "Vue", "Laravel", "Angular"],
        correctIndexes: [0, 1, 3],
    },
    {
        id: 3,
        type: "text",
        question: "Which JavaScript library is used for building user interfaces with components?",
        correctText: "React",
    },
    {
        id: 4,
        type: "radio",
        question: "Which company developed TypeScript?",
        choices: ["Google", "Microsoft", "Facebook", "Amazon"],
        correctIndex: 1,
    },
    {
        id: 5,
        type: "checkbox",
        question: "Select all CSS units for relative sizing:",
        choices: ["em", "px", "rem", "%"],
        correctIndexes: [0, 2, 3],
    },
    {
        id: 6,
        type: "text",
        question: "Which React hook is used to add state to a functional component?",
        correctText: "useState",
    },
    {
        id: 7,
        type: "radio",
        question: "Which HTTP method is used to retrieve data?",
        choices: ["POST", "PUT", "GET", "DELETE"],
        correctIndex: 2,
    },
    {
        id: 8,
        type: "checkbox",
        question: "Which are valid HTML elements?",
        choices: ["<section>", "<main>", "<header>", "<body-text>"],
        correctIndexes: [0, 1, 2],
    },
    {
        id: 9,
        type: "radio",
        question: "Which hook lets you reference a DOM element directly in a functional component?",
        choices: ["useEffect", "useState", "useRef", "useContext"],
        correctIndex: 2,
    },
    {
        id: 10,
        type: "text",
        question: "What is the term for passing data from a parent component to a child component?",
        correctText: "props",
    },
    {
        id: 11,
        type: "checkbox",
        question: "Which of these are valid built-in React hooks?",
        choices: ["useState", "useEffect", "useFetch", "useRef"],
        correctIndexes: [0, 1, 3],
    },
    {
        id: 12,
        type: "radio",
        question: "Which of the following is NOT a JavaScript data type?",
        choices: ["String", "Boolean", "Integer", "Undefined"],
        correctIndex: 2,
    }
];
