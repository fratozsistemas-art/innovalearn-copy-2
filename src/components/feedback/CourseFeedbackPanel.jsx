import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, Send, ChevronDown, ChevronUp } from "lucide-react";

const CourseFeedback = base44.entities.CourseFeedback;

function StarRating({ value, onChange, readOnly = false }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`w-5 h-5 transition-colors ${readOnly ? '' : 'cursor-pointer'}`}
          fill={(hovered || value) >= star ? "#FFC857" : "none"}
          stroke={(hovered || value) >= star ? "#FFC857" : "#9CA3AF"}
          onMouseEnter={() => !readOnly && setHovered(star)}
          onMouseLeave={() => !readOnly && setHovered(0)}
          onClick={() => !readOnly && onChange && onChange(star)}
        />
      ))}
    </div>
  );
}

function FeedbackForm({ courseId, user, onSubmitted }) {
  const [form, setForm] = useState({ overall_rating: 0, content_rating: 0, instructor_rating: 0, comment: "", is_anonymous: false });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (form.overall_rating === 0) return;
    setSubmitting(true);
    await CourseFeedback.create({
      course_id: courseId,
      student_email: user.email,
      student_name: form.is_anonymous ? "Anônimo" : (user.full_name || user.email),
      overall_rating: form.overall_rating,
      content_rating: form.content_rating,
      instructor_rating: form.instructor_rating,
      comment: form.comment,
      is_anonymous: form.is_anonymous,
    });
    setSubmitted(true);
    setSubmitting(false);
    onSubmitted?.();
  };

  if (submitted) {
    return (
      <div className="p-4 rounded-xl text-center bg-green-50 border border-green-200">
        <p className="text-green-700 font-semibold">✅ Obrigado pelo seu feedback!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-4 rounded-xl bg-gray-50 border">
      <h4 className="font-semibold text-gray-800">Avaliar este Curso</h4>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Avaliação Geral *</p>
          <StarRating value={form.overall_rating} onChange={(v) => setForm({ ...form, overall_rating: v })} />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Conteúdo / Materiais</p>
          <StarRating value={form.content_rating} onChange={(v) => setForm({ ...form, content_rating: v })} />
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Instrutor</p>
          <StarRating value={form.instructor_rating} onChange={(v) => setForm({ ...form, instructor_rating: v })} />
        </div>
      </div>

      <textarea
        className="w-full p-3 border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
        rows={3}
        placeholder="Compartilhe sua experiência com este curso..."
        value={form.comment}
        onChange={(e) => setForm({ ...form, comment: e.target.value })}
      />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
          <input
            type="checkbox"
            checked={form.is_anonymous}
            onChange={(e) => setForm({ ...form, is_anonymous: e.target.checked })}
            className="rounded"
          />
          Enviar anonimamente
        </label>
        <Button
          onClick={handleSubmit}
          disabled={form.overall_rating === 0 || submitting}
          className="bg-innova-teal-500 hover:bg-innova-teal-600 text-white"
        >
          <Send className="w-4 h-4 mr-2" />
          {submitting ? "Enviando..." : "Enviar Avaliação"}
        </Button>
      </div>
    </div>
  );
}

function FeedbackCard({ feedback, isStaff, onReply }) {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const [replyText, setReplyText] = useState(feedback.instructor_reply || "");
  const [saving, setSaving] = useState(false);

  const handleSaveReply = async () => {
    setSaving(true);
    await CourseFeedback.update(feedback.id, {
      instructor_reply: replyText,
      instructor_reply_at: new Date().toISOString(),
    });
    setSaving(false);
    setShowReplyForm(false);
    onReply?.();
  };

  return (
    <div className="p-4 rounded-xl border bg-white space-y-3">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-semibold text-sm text-gray-800">
            {feedback.is_anonymous ? "Aluno Anônimo" : feedback.student_name}
          </p>
          <p className="text-xs text-gray-400">{new Date(feedback.created_date).toLocaleDateString('pt-BR')}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <StarRating value={feedback.overall_rating} readOnly />
          <div className="flex gap-2 text-xs text-gray-500">
            {feedback.content_rating > 0 && <span>Conteúdo: {feedback.content_rating}★</span>}
            {feedback.instructor_rating > 0 && <span>Instrutor: {feedback.instructor_rating}★</span>}
          </div>
        </div>
      </div>

      {feedback.comment && (
        <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg">{feedback.comment}</p>
      )}

      {feedback.instructor_reply && (
        <div className="bg-teal-50 border border-teal-200 rounded-lg p-3">
          <p className="text-xs font-semibold text-teal-700 mb-1">💬 Resposta do Instrutor</p>
          <p className="text-sm text-teal-800">{feedback.instructor_reply}</p>
        </div>
      )}

      {isStaff && (
        <div>
          {!showReplyForm ? (
            <Button variant="outline" size="sm" onClick={() => setShowReplyForm(true)}>
              <MessageSquare className="w-3 h-3 mr-1" />
              {feedback.instructor_reply ? "Editar Resposta" : "Responder"}
            </Button>
          ) : (
            <div className="space-y-2">
              <textarea
                className="w-full p-2 border rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-teal-400"
                rows={2}
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                placeholder="Escreva sua resposta..."
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSaveReply} disabled={saving} className="bg-innova-teal-500 text-white">
                  {saving ? "Salvando..." : "Salvar"}
                </Button>
                <Button size="sm" variant="outline" onClick={() => setShowReplyForm(false)}>Cancelar</Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function CourseFeedbackPanel({ courseId, user }) {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [refresh, setRefresh] = useState(0);

  const isStaff = user && ['administrador', 'coordenador_pedagogico', 'instrutor'].includes(user.user_type);
  const isStudent = user && user.user_type === 'aluno';

  const hasAlreadySubmitted = feedbacks.some(f => f.student_email === user?.email);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await CourseFeedback.filter({ course_id: courseId }, '-created_date', 50);
      setFeedbacks(data);
      setLoading(false);
    };
    load();
  }, [courseId, refresh]);

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((s, f) => s + f.overall_rating, 0) / feedbacks.length).toFixed(1)
    : null;

  const displayed = showAll ? feedbacks : feedbacks.slice(0, 3);

  return (
    <div className="space-y-4 mt-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
          <Star className="w-4 h-4 text-yellow-400" fill="#FFC857" />
          Avaliações dos Alunos
          {avgRating && (
            <Badge className="bg-yellow-100 text-yellow-800 border-0">
              {avgRating} / 5 ({feedbacks.length} avaliações)
            </Badge>
          )}
        </h3>
      </div>

      {isStudent && !hasAlreadySubmitted && (
        <FeedbackForm courseId={courseId} user={user} onSubmitted={() => setRefresh(r => r + 1)} />
      )}

      {isStudent && hasAlreadySubmitted && (
        <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-sm text-blue-700">
          ✅ Você já avaliou este curso.
        </div>
      )}

      {loading ? (
        <p className="text-sm text-gray-400">Carregando avaliações...</p>
      ) : feedbacks.length === 0 ? (
        <p className="text-sm text-gray-400">Nenhuma avaliação ainda.</p>
      ) : (
        <div className="space-y-3">
          {displayed.map(fb => (
            <FeedbackCard
              key={fb.id}
              feedback={fb}
              isStaff={isStaff}
              onReply={() => setRefresh(r => r + 1)}
            />
          ))}
          {feedbacks.length > 3 && (
            <Button variant="ghost" size="sm" onClick={() => setShowAll(!showAll)} className="w-full">
              {showAll ? <><ChevronUp className="w-4 h-4 mr-1" />Mostrar menos</> : <><ChevronDown className="w-4 h-4 mr-1" />Ver todas {feedbacks.length} avaliações</>}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

// Export a lightweight summary hook for Analytics
export function useCourseFeedbackSummary(courseIds) {
  const [summaries, setSummaries] = useState({});

  useEffect(() => {
    if (!courseIds || courseIds.length === 0) return;
    const load = async () => {
      const all = await base44.entities.CourseFeedback.list('-created_date', 200);
      const map = {};
      courseIds.forEach(id => {
        const items = all.filter(f => f.course_id === id);
        map[id] = {
          count: items.length,
          avgRating: items.length > 0
            ? (items.reduce((s, f) => s + f.overall_rating, 0) / items.length).toFixed(1)
            : null,
          avgContent: items.length > 0
            ? (items.filter(f => f.content_rating > 0).reduce((s, f) => s + f.content_rating, 0) / (items.filter(f => f.content_rating > 0).length || 1)).toFixed(1)
            : null,
        };
      });
      setSummaries(map);
    };
    load();
  }, [courseIds?.join(',')]);

  return summaries;
}