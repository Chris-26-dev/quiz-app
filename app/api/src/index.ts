// app/api/src/index.ts
import { Hono } from "hono";
import { quizQuestions, Question } from "./data/quiz";
import { cors } from "hono/cors";

type AnswerPayload = { id: number | string; value: number | number[] | string };
type GradeResult = { id: number; correct: boolean };
type GradeResponse = { score: number; total: number; results: GradeResult[] };

const app = new Hono();
app.use("*", cors());

function isAnswerPayloadArray(u: unknown): u is AnswerPayload[] {
  if (!Array.isArray(u)) return false;
  return u.every((item) => {
    return (
      item !== null &&
      typeof item === "object" &&
      "id" in item &&
      "value" in item
    );
  });
}

function normalizeId(id: number | string) {
  return typeof id === "string" ? Number(id) : id;
}

function normalizeText(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]|_/g, "") // remove punctuation
    .replace(/\s+/g, " ");     // replace multiple spaces with single space
}

export function gradeAnswers(questions: Question[], answers: AnswerPayload[]): GradeResponse {
  const byId = new Map<number, Question>();
  questions.forEach((q) => byId.set(q.id, q));

  const results: GradeResult[] = [];
  let score = 0;

  for (const q of questions) {
    const ans = answers.find((a) => normalizeId(a.id) === q.id);
    let correct = false;

    if (!ans) {
      results.push({ id: q.id, correct: false });
      continue;
    }

    const val = ans.value;

    if (q.type === "radio") {
      correct = typeof val === "string" && val === q.choices[q.correctIndex];
    }
    else if (q.type === "checkbox") {
      if (Array.isArray(val) && val.every((v) => typeof v === "number")) {
        const a = (val as number[]).slice().map(Number).sort((a, b) => a - b);
        const b = q.correctIndexes.slice().map(Number).sort((a, b) => a - b);
        correct = a.length === b.length && a.every((v, i) => v === b[i]);
      } else {
        correct = false;
      }
    } else if (q.type === "text") {
      if (typeof val === "string") {
        correct = normalizeText(val) === normalizeText(q.correctText);
      } else {
        correct = false;
      }
    }

    if (correct) score++;
    results.push({ id: q.id, correct });
  }

  return { score, total: questions.length, results };
}

// GET /api/quiz
app.get("/api/quiz", (c) => {
  try {
    const shuffle = <T,>(arr: T[]): T[] => [...arr].sort(() => Math.random() - 0.5);

    const shuffledQuestions = shuffle(quizQuestions).map((q) => {
      if (q.type === "radio") {
        const indices = q.choices.map((_, i) => i);
        const shuffledIndices = shuffle(indices);
        const newChoices = shuffledIndices.map((i) => q.choices[i]);
        const newCorrectIndex = shuffledIndices.indexOf(q.correctIndex);

        return { ...q, choices: newChoices, correctIndex: newCorrectIndex };
      }

      if (q.type === "checkbox") {
        const indices = q.choices.map((_, i) => i);
        const shuffledIndices = shuffle(indices);
        const newChoices = shuffledIndices.map((i) => q.choices[i]);
        const newCorrectIndexes = q.correctIndexes.map((i) =>
          shuffledIndices.indexOf(i)
        );

        return { ...q, choices: newChoices, correctIndexes: newCorrectIndexes };
      }

      return q;
    });

    return c.json(shuffledQuestions);
  } catch (err) {
    return c.json({ error: "Failed to load quiz." }, 500);
  }
});


// POST /api/grade
app.post("/api/grade", async (c) => {
  try {
    const body = await c.req.json();

    if (!body || !("answers" in body)) {
      return c.json({ error: "Invalid payload - missing answers" }, 400);
    }

    const { answers, questions: sentQuestions } = body;

    if (!answers || !isAnswerPayloadArray(answers)) {
      return c.json({ error: "Invalid payload - answers must be array of {id,value}" }, 400);
    }

    // ✅ Use the sent shuffled questions instead of original quizQuestions
    const questionsToGrade = sentQuestions || quizQuestions;
    const result = gradeAnswers(questionsToGrade, answers);
    return c.json(result);

  } catch (err) {
    return c.json({ error: "Invalid request or JSON" }, 400);
  }
});


export default app;
