import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Question } from '../types';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Modal } from '../components/ui/modal';
import { HelpCircle, MessageCircle, CheckCircle2, Clock, Send, ShieldCheck, Plus } from 'lucide-react';

export const QuestionsPage: React.FC = () => {
  const { currentUser, questions, askQuestion, answerQuestion } = useApp();
  const [isAskModalOpen, setIsAskModalOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [category, setCategory] = useState<Question['category']>('general');
  const [message, setMessage] = useState('');

  // Answering state for staff
  const [answeringQuestionId, setAnsweringQuestionId] = useState<string | null>(null);
  const [answerText, setAnswerText] = useState('');

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) return;

    askQuestion({
      subject,
      category,
      message,
    });

    setSubject('');
    setMessage('');
    setIsAskModalOpen(false);
  };

  const handleAnswerSubmit = (qId: string) => {
    if (!answerText.trim()) return;
    answerQuestion(qId, answerText);
    setAnsweringQuestionId(null);
    setAnswerText('');
  };

  const isStaffOrAdmin = currentUser?.role === 'staff' || currentUser?.role === 'admin';

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 space-y-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <span className="text-xs font-700 uppercase tracking-widest text-red-500">
            Community &amp; Service Inquiries
          </span>
          <h1 className="font-oswald font-700 text-3xl sm:text-4xl uppercase tracking-tight text-white mt-1">
            FREQUENTLY ASKED QUESTIONS &amp; Q&amp;A
          </h1>
          <p className="text-xs sm:text-sm text-neutral-400">
            Got a question about our 10km free callout, engine bay wash, or loyalty stamps? Ask our team directly!
          </p>
        </div>

        <Button
          variant="primary"
          onClick={() => setIsAskModalOpen(true)}
          className="shrink-0 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Ask A Question
        </Button>
      </div>

      {/* Top FAQ Knowledge Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-2">
          <h3 className="font-oswald font-700 text-lg uppercase text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-red-500" />
            Where is the Free 10km Callout Valid?
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Free mobile callout is active within 10km of Waldrif, Vereeniging. This includes Waldrif, Arcon Park, Peacehaven, Falcon Ridge, Three Rivers, and parts of Vanderbijlpark. Our mobile van brings its own water tank and high-pressure system.
          </p>
        </div>

        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5 space-y-2">
          <h3 className="font-oswald font-700 text-lg uppercase text-white flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-red-500" />
            How Does the 4th Free Wash Work?
          </h3>
          <p className="text-xs text-neutral-400 leading-relaxed">
            Every Full Wash (Sedan R80, SUV R100, Bakkie R120) earns 1 stamp linked to your car&apos;s license plate. When you reach 3 stamps, your 4th Full Wash is 100% free!
          </p>
        </div>
      </div>

      {/* Community Questions Feed */}
      <div className="space-y-4">
        <h2 className="font-oswald font-700 text-2xl uppercase tracking-wider text-white">
          Customer Questions &amp; Verified Answers ({questions.length})
        </h2>

        <div className="space-y-4">
          {questions.map((q) => (
            <div
              key={q.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-lg"
            >
              {/* Question Header */}
              <div className="flex flex-wrap items-start justify-between gap-2 border-b border-neutral-800/80 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-700 uppercase tracking-widest text-red-400 bg-red-950/60 border border-red-800/80 px-2 py-0.5 rounded">
                      {q.category}
                    </span>
                    <span
                      className={`text-[10px] font-600 uppercase px-2 py-0.5 rounded ${
                        q.status === 'answered'
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}
                    >
                      {q.status === 'answered' ? 'Answered by Staff' : 'Awaiting Reply'}
                    </span>
                  </div>
                  <h3 className="font-oswald font-700 text-xl uppercase text-white mt-1.5">
                    {q.subject}
                  </h3>
                </div>

                <div className="text-right text-xs text-neutral-500 font-mono">
                  <span>{new Date(q.created_at).toLocaleDateString()}</span>
                  <div className="text-neutral-400">By {q.customer_name}</div>
                </div>
              </div>

              {/* Message */}
              <p className="text-sm text-neutral-300 leading-relaxed">
                {q.message}
              </p>

              {/* Verified Staff Answer */}
              {q.answer ? (
                <div className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-xs text-red-400 font-700 uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Answer from {q.answered_by}
                    </span>
                    <span className="font-mono text-neutral-500 font-normal">
                      {q.answered_at ? new Date(q.answered_at).toLocaleDateString() : ''}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-200 leading-relaxed">
                    {q.answer}
                  </p>
                </div>
              ) : isStaffOrAdmin ? (
                /* Staff Answer Form */
                <div className="pt-2 border-t border-neutral-800">
                  {answeringQuestionId === q.id ? (
                    <div className="space-y-3 bg-neutral-950 p-4 rounded-xl border border-neutral-800">
                      <label className="text-xs font-700 text-red-400 uppercase tracking-wider block">
                        Reply as {currentUser?.full_name} ({currentUser?.role}):
                      </label>
                      <textarea
                        value={answerText}
                        onChange={(e) => setAnswerText(e.target.value)}
                        placeholder="Write official response here..."
                        className="w-full bg-neutral-900 border border-neutral-700 p-3 rounded-lg text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-red-600 min-h-[80px]"
                      />
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setAnsweringQuestionId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAnswerSubmit(q.id)}
                        >
                          Publish Answer
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setAnsweringQuestionId(q.id);
                        setAnswerText('');
                      }}
                      className="text-xs text-red-400"
                    >
                      <Send className="w-3.5 h-3.5 mr-1" />
                      Reply as Staff
                    </Button>
                  )}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>

      {/* Ask Question Modal */}
      <Modal
        isOpen={isAskModalOpen}
        onClose={() => setIsAskModalOpen(false)}
        title="Ask Waldrift Staff A Question"
        description="Our team in Vereeniging usually responds within 15 minutes during operating hours."
      >
        <form onSubmit={handleAskSubmit} className="space-y-4">
          <Input
            label="Question Subject"
            placeholder="e.g. Engine bay degreasing for turbo diesel"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <div>
            <label className="block text-xs font-600 text-neutral-300 uppercase tracking-wider mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Question['category'])}
              className="w-full h-10 rounded-lg bg-neutral-900 border border-neutral-800 px-3 text-sm text-neutral-100 focus:outline-none focus:border-red-600"
            >
              <option value="general">General Bay Info</option>
              <option value="pricing">Prices &amp; Packages</option>
              <option value="callout">Mobile 10km Callout</option>
              <option value="detailing">Engine &amp; Detailing</option>
              <option value="loyalty">Loyalty Card &amp; Referrals</option>
            </select>
          </div>

          <Textarea
            label="Your Question Details"
            placeholder="Describe your car or question..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            rows={4}
          />

          <div className="flex justify-end gap-2 pt-3 border-t border-neutral-800">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsAskModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Submit Question
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default QuestionsPage;
