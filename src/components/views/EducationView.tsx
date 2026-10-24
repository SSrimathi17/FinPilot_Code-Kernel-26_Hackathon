import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { GraduationCap, Award, CheckCircle2, Play, BookOpen, Sparkles, HelpCircle, X, ChevronRight } from "lucide-react";
import { useFinance } from "../../context/FinanceContext";
import { useAuth } from "../../context/AuthContext";
import { useUI } from "../../context/UIContext";

export const EducationView: React.FC = () => {
  const { courses, completeQuiz } = useFinance();
  const { user } = useAuth();
  const { showToast } = useUI();

  const [activeQuizCourse, setActiveQuizCourse] = useState<string | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const activeCourseObj = courses.find((c) => c.id === activeQuizCourse);

  const handleSelectOption = (questionIndex: number, optionIndex: number) => {
    if (quizSubmitted) return;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (!activeCourseObj) return;

    let scoreCount = 0;
    activeCourseObj.quizQuestions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswer) scoreCount++;
    });

    const finalPct = Math.round((scoreCount / activeCourseObj.quizQuestions.length) * 100);
    completeQuiz(activeCourseObj.id, finalPct);
    setQuizSubmitted(true);
    showToast(`Quiz completed! You scored ${finalPct}%`, "success");
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-purple-400" /> Financial Literacy Hub
          </h2>
          <p className="text-xs text-gray-400 mt-1">
            Master budgeting, debt management, fixed deposit savings, and earn verified literacy certificates.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold">
          <Award className="w-4 h-4 text-emerald-400" />
          <span>Certificates Unlocked: {(courses || []).filter((c) => c.completed).length}/{(courses || []).length}</span>
        </div>
      </div>

      {/* Courses List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="p-6 rounded-3xl bg-gray-900/80 border border-gray-800 backdrop-blur-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-bold text-purple-400 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-full uppercase">
                  {course.category}
                </span>
                <span className="text-[10px] font-semibold text-gray-400">{course.duration}</span>
              </div>

              <h3 className="text-base font-bold text-white mb-2">{course.title}</h3>
              <p className="text-xs text-gray-300 leading-relaxed mb-4">{course.description}</p>
            </div>

            <div className="pt-4 border-t border-gray-800 flex items-center justify-between">
              {course.completed ? (
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                  <CheckCircle2 className="w-4 h-4" /> Passed ({course.score}%)
                </div>
              ) : (
                <span className="text-xs text-gray-400">{course.modulesCount} Learning Modules</span>
              )}

              <button
                onClick={() => {
                  setActiveQuizCourse(course.id);
                  setSelectedAnswers({});
                  setQuizSubmitted(false);
                }}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-500/20 transition-all flex items-center gap-1.5"
              >
                {course.completed ? "Retake Quiz" : "Start Course"}
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Interactive Quiz Modal */}
      <AnimatePresence>
        {activeQuizCourse && activeCourseObj && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button
                onClick={() => setActiveQuizCourse(null)}
                className="absolute top-4 right-4 p-1.5 rounded-xl text-gray-400 hover:text-white bg-gray-800"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="flex items-center gap-2 mb-4">
                <GraduationCap className="w-5 h-5 text-purple-400" />
                <h3 className="text-base font-bold text-white">{activeCourseObj.title}</h3>
              </div>

              <div className="space-y-6">
                {activeCourseObj.quizQuestions.map((q, qIdx) => (
                  <div key={qIdx} className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800">
                    <p className="text-xs font-bold text-white mb-3">
                      Q{qIdx + 1}. {q.question}
                    </p>

                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = q.correctAnswer === oIdx;

                        let btnStyle = "bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700";
                        if (isSelected) {
                          btnStyle = "bg-purple-600/30 border-purple-500 text-purple-200 font-bold";
                        }
                        if (quizSubmitted) {
                          if (isCorrect) btnStyle = "bg-emerald-600/30 border-emerald-500 text-emerald-200 font-bold";
                          else if (isSelected && !isCorrect) btnStyle = "bg-rose-600/30 border-rose-500 text-rose-200";
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(qIdx, oIdx)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all ${btnStyle}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <p className="mt-2 text-[11px] text-gray-400 bg-gray-900 p-2 rounded-lg border border-gray-800">
                        💡 <strong>Explanation:</strong> {q.explanation}
                      </p>
                    )}
                  </div>
                ))}

                {!quizSubmitted ? (
                  <button
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(selectedAnswers).length < activeCourseObj.quizQuestions.length}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold text-xs shadow-lg disabled:opacity-50 transition-all"
                  >
                    Submit Quiz & Get Certificate
                  </button>
                ) : (
                  <div className="p-4 rounded-2xl bg-emerald-950/60 border border-emerald-500/40 text-center space-y-2">
                    <Award className="w-8 h-8 text-emerald-400 mx-auto" />
                    <h4 className="text-sm font-bold text-white">Certificate Awarded to {user.name}!</h4>
                    <p className="text-xs text-emerald-300">
                      You passed the {activeCourseObj.title} course assessment with flying colors.
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
