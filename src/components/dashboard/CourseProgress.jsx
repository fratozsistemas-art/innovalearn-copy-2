import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen } from "lucide-react";

const categoryColors = {
  matematica: { bg: '#3498DB', text: '#FFFFFF' },
  portugues: { bg: '#27AE60', text: '#FFFFFF' },
  ciencias: { bg: '#9B59B6', text: '#FFFFFF' },
  historia: { bg: '#E67E22', text: '#FFFFFF' },
  geografia: { bg: '#00A99D', text: '#FFFFFF' },
  ingles: { bg: '#E91E63', text: '#FFFFFF' },
  artes: { bg: '#FFC857', text: '#2C3E50' },
  educacao_fisica: { bg: '#E74C3C', text: '#FFFFFF' }
};

export default function CourseProgress({ courses, enrollments }) {
  const getEnrollmentForCourse = (courseId) => {
    return enrollments.find(e => e.course_id === courseId);
  };

  return (
    <Card className="card-innova shadow-lg border-none">
      <CardHeader className="border-b" style={{ borderColor: 'var(--neutral-medium)', backgroundColor: 'var(--neutral-light)' }}>
        <CardTitle className="flex items-center gap-2 text-xl font-heading">
          <BookOpen className="w-5 h-5" style={{ color: 'var(--primary-teal)' }} />
          Progresso dos Cursos
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-4">
          {courses.slice(0, 5).map((course) => {
            const enrollment = getEnrollmentForCourse(course.id);
            const progress = enrollment?.progress || 0;
            const colors = categoryColors[course.category] || { bg: '#95A5A6', text: '#FFFFFF' };
            
            return (
              <div key={course.id} className="p-4 rounded-xl hover:shadow-md transition-all" style={{ backgroundColor: 'var(--neutral-light)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h4 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{course.title}</h4>
                    <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>{course.instructor}</p>
                  </div>
                  <Badge className="border-0" style={{ backgroundColor: colors.bg, color: colors.text }}>
                    {course.category}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: 'var(--text-secondary)' }}>Progresso</span>
                    <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}