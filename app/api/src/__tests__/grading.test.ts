import { describe, it, expect } from "vitest";
import { gradeAnswers } from "../index";
import { quizQuestions, Question, RadioQuestion, CheckboxQuestion, TextQuestion } from "../data/quiz";

// ---------- Type Guards ----------
function isRadio(q: Question): q is RadioQuestion {
  return q.type === "radio";
}

function isCheckbox(q: Question): q is CheckboxQuestion {
  return q.type === "checkbox";
}

function isText(q: Question): q is TextQuestion {
  return q.type === "text";
}

// ---------- Tests ----------
describe("gradeAnswers function", () => {

  it("should return perfect score when all answers are correct", () => {
    const answers = quizQuestions.map(q => {
      if (isRadio(q)) return { id: q.id, value: q.choices[q.correctIndex] };
      if (isCheckbox(q)) return { id: q.id, value: q.correctIndexes };
      if (isText(q)) return { id: q.id, value: q.correctText };
      throw new Error("Unknown question type");
    });

    const result = gradeAnswers(quizQuestions, answers);
    expect(result.score).toBe(quizQuestions.length);
    expect(result.results.every(r => r.correct)).toBe(true);
  });

  it("should return 0 score when all answers are wrong", () => {
    const answers = quizQuestions.map(q => {
      if (isRadio(q)) return { id: q.id, value: "wrong answer" };
      if (isCheckbox(q)) return { id: q.id, value: [] };
      if (isText(q)) return { id: q.id, value: "wrong" };
      throw new Error("Unknown question type");
    });

    const result = gradeAnswers(quizQuestions, answers);
    expect(result.score).toBe(0);
    expect(result.results.every(r => !r.correct)).toBe(true);
  });

  it("should handle partially correct checkbox answers", () => {
    const checkboxQuestion = quizQuestions.find(isCheckbox);
    if (!checkboxQuestion) throw new Error("No checkbox question found");

    const answers = [{ id: checkboxQuestion.id, value: [checkboxQuestion.correctIndexes[0]] }];
    const result = gradeAnswers([checkboxQuestion], answers);
    expect(result.score).toBe(0);
    expect(result.results[0].correct).toBe(false);
  });

  it("should handle text answers case-insensitively", () => {
    const textQuestion = quizQuestions.find(isText);
    if (!textQuestion) throw new Error("No text question found");

    const answers = [{ id: textQuestion.id, value: textQuestion.correctText.toUpperCase() }];
    const result = gradeAnswers([textQuestion], answers);
    expect(result.score).toBe(1);
    expect(result.results[0].correct).toBe(true);
  });

  it("should handle missing answers and mark them incorrect", () => {
    const result = gradeAnswers(quizQuestions, []);
    expect(result.score).toBe(0);
    expect(result.results.every(r => !r.correct)).toBe(true);
  });

  it("should ignore extra answers not in the quiz", () => {
    const firstQuestion = quizQuestions.find(isRadio) || quizQuestions[0];
    let correctValue: string | number[];
    if (isRadio(firstQuestion)) correctValue = firstQuestion.choices[firstQuestion.correctIndex];
    else if (isCheckbox(firstQuestion)) correctValue = firstQuestion.correctIndexes;
    else if (isText(firstQuestion)) correctValue = firstQuestion.correctText;
    else throw new Error("Unknown question type");

    const answers = [
      { id: 999, value: "random" },
      { id: firstQuestion.id, value: correctValue }
    ];

    const result = gradeAnswers(quizQuestions, answers);
    expect(result.score).toBe(1);
  });

  it("should handle wrong answer types gracefully", () => {
    const answers = [
      { id: 1, value: 123 },
      { id: 2, value: "not an array" }
    ];
    const result = gradeAnswers(quizQuestions, answers);
    expect(result.results[0].correct).toBe(false);
    expect(result.results[1].correct).toBe(false);
  });

  it("should normalize text answers removing spaces and punctuation", () => {
    const textQuestion = quizQuestions.find(isText);
    if (!textQuestion) throw new Error("No text question found");

    const answers = [{ id: textQuestion.id, value: `  ${textQuestion.correctText}!!! ` }];
    const result = gradeAnswers([textQuestion], answers);
    expect(result.score).toBe(1);
    expect(result.results[0].correct).toBe(true);
  });

  it("should mark checkbox incorrect if extra wrong choices are selected", () => {
    const checkboxQuestion = quizQuestions.find(isCheckbox);
    if (!checkboxQuestion) throw new Error("No checkbox question found");

    const answers = [{ id: checkboxQuestion.id, value: [...checkboxQuestion.correctIndexes, 99] }];
    const result = gradeAnswers([checkboxQuestion], answers);
    expect(result.results[0].correct).toBe(false);
  });

});
