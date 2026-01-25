import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BookOpen, User, Clock } from "lucide-react";
import { motion } from "framer-motion";

const categoryColors = {
  matematica: "bg-blue-500",
  portugues: "bg-green-500",
  ciencias: "bg-purple-500",
  historia: "bg-orange-500",
  geografia: "bg-cyan-500",
  ingles: "bg-pink-500",
  artes: "bg-yellow-500",
  educacao_fisica: "bg-red-500"
};

export default function CourseCard({ course, enrollment, onClick }) {
  const progress = enrollment?.progress || 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <Card 
        className="cursor-pointer hover:shadow-2xl transition-all duration-300 border-none overflow-hidden bg-white"
        onClick={onClick}
      >
        <div className={`h-3 ${categoryColors[course.category] || 'bg-gray-500'}`} />
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <CardTitle className="text-lg font-bold text-gray-900 mb-2">
                {course.title}
              </CardTitle>
              <p className="text-sm text-gray-600 line-clamp-2">{course.description}</p>
            </div>
            {course.thumbnail_url && (
              <img 
                src={course.thumbnail_url} 
                alt={course.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              <User className="w-4 h-4" />
              {course.instructor}
            </span>
            {course.total_lessons && (
              <span className="flex items-center gap-1">
                <BookOpen className="w-4 h-4" />
                {course.total_lessons} aulas
              </span>
            )}
          </div>

          {enrollment && (
            <div className="space-y-2 pt-2 border-t">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Seu progresso</span>
                <span className="font-semibold text-blue-900">{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <div className="flex items-center justify-between pt-2">
            <Badge className={`${categoryColors[course.category]} text-white border-0`}>
              {course.category}
            </Badge>
            {course.duration_weeks && (
              <span className="text-xs text-gray-500 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {course.duration_weeks} semanas
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}