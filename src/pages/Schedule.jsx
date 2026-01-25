
import React, { useState, useEffect } from "react";
import { Course, Enrollment } from "@/entities/all";
import { User } from "@/entities/User";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, PartyPopper } from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format, addDays, startOfWeek } from "date-fns";
import { ptBR } from "date-fns/locale";

const weekDays = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];
const timeSlots = [
  "07:00", "08:00", "09:00", "10:00", "11:00", 
  "13:00", "14:00", "15:00", "16:00", "17:00"
];

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

// Feriados do Distrito Federal e Nacionais (2024-2025)
const holidays = [
  { date: "2024-01-01", name: "Confraternização Universal" },
  { date: "2024-02-13", name: "Carnaval" },
  { date: "2024-03-29", name: "Sexta-feira Santa" },
  { date: "2024-04-21", name: "Tiradentes / Fundação de Brasília" },
  { date: "2024-05-01", name: "Dia do Trabalho" },
  { date: "2024-05-30", name: "Corpus Christi" },
  { date: "2024-09-07", name: "Independência do Brasil" },
  { date: "2024-10-12", name: "Nossa Senhora Aparecida" },
  { date: "2024-10-28", name: "Dia do Servidor Público" },
  { date: "2024-11-02", name: "Finados" },
  { date: "2024-11-15", name: "Proclamação da República" },
  { date: "2024-11-20", name: "Consciência Negra" },
  { date: "2024-11-30", name: "Dia do Evangélico (DF)" },
  { date: "2024-12-25", name: "Natal" },
  { date: "2025-01-01", name: "Confraternização Universal" },
  { date: "2025-03-04", name: "Carnaval" },
  { date: "2025-04-18", name: "Sexta-feira Santa" },
  { date: "2025-04-21", name: "Tiradentes / Fundação de Brasília" },
  { date: "2025-05-01", name: "Dia do Trabalho" },
  { date: "2025-06-19", name: "Corpus Christi" },
  { date: "2025-09-07", name: "Independência do Brasil" },
  { date: "2025-10-12", name: "Nossa Senhora Aparecida" },
  { date: "2025-10-28", name: "Dia do Servidor Público" },
  { date: "2025-11-02", name: "Finados" },
  { date: "2025-11-15", name: "Proclamação da República" },
  { date: "2025-11-20", name: "Consciência Negra" },
  { date: "2025-11-30", name: "Dia do Evangélico (DF)" },
  { date: "2025-12-25", name: "Natal" }
];

const categoryColors = {
  matematica: { bg: 'var(--info)', text: 'var(--background)' },
  portugues: { bg: 'var(--success)', text: 'var(--background)' },
  ciencias: { bg: '#9B59B6', text: 'var(--background)' },
  historia: { bg: 'var(--accent-orange)', text: 'var(--background)' },
  geografia: { bg: 'var(--primary-teal)', text: 'var(--background)' },
  ingles: { bg: '#E91E63', text: 'var(--background)' },
  artes: { bg: 'var(--accent-yellow)', text: 'var(--text-primary)' },
  educacao_fisica: { bg: 'var(--error)', text: 'var(--background)' }
};

export default function SchedulePage() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [viewMode, setViewMode] = useState("weekly");
  const [currentWeek, setCurrentWeek] = useState(0);
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const userData = await User.me();
    setUser(userData);

    const enrollmentsData = await Enrollment.filter({ student_email: userData.email });
    setEnrollments(enrollmentsData);

    if (enrollmentsData.length > 0) {
      const courseIds = enrollmentsData.map(e => e.course_id);
      const coursesData = await Course.list();
      const filteredCourses = coursesData.filter(c => courseIds.includes(c.id));
      setCourses(filteredCourses);
    }
  };

  const getWeekDates = () => {
    const today = new Date();
    // 1 = Monday (startOfWeek uses 0 for Sunday by default, so we specify 1 for Monday)
    const weekStart = startOfWeek(addDays(today, currentWeek * 7), { weekStartsOn: 1 }); 
    
    return weekDays.map((dayName, index) => {
      const date = addDays(weekStart, index);
      return {
        dayName: dayName,
        date: date,
        dayNumber: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        isHoliday: isHoliday(date),
        isToday: date.toDateString() === new Date().toDateString()
      };
    });
  };

  const getClassForSlot = (day, time) => {
    const dayIndex = weekDays.indexOf(day);
    const timeIndex = timeSlots.indexOf(time);
    
    if (courses.length > 0) {
      const courseIndex = (dayIndex * 2 + Math.floor(timeIndex / 5)) % courses.length;
      return courses[courseIndex];
    }
    return null;
  };

  const isHoliday = (date) => {
    // Ensure date comparison is consistent by setting time to 00:00:00 UTC
    const dateStr = format(date, "yyyy-MM-dd");
    return holidays.find(h => h.date === dateStr);
  };

  const getDaysInMonth = (month, year) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    return firstDay === 0 ? 6 : firstDay - 1; // Ajusta para começar na segunda
  };

  const renderWeeklyView = () => {
    const weekDates = getWeekDates();
    const startDate = weekDates[0].date;
    const endDate = weekDates[weekDates.length - 1].date;

    return (
      <Card className="card-innova border-none shadow-xl">
        <CardHeader style={{ backgroundColor: 'var(--primary-teal)' }}>
          <CardTitle className="flex flex-col gap-3 text-white font-heading">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Grade Horária Semanal
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentWeek(currentWeek - 1)}
                  className="text-white hover:bg-white/20"
                >
                  ← Anterior
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentWeek(currentWeek + 1)}
                  className="text-white hover:bg-white/20"
                >
                  Próxima →
                </Button>
              </div>
            </div>
            <div className="text-sm font-normal opacity-90">
              {format(startDate, "dd/MM/yyyy", { locale: ptBR })} a {format(endDate, "dd/MM/yyyy", { locale: ptBR })}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '2px solid var(--neutral-medium)' }}>
                  <th className="p-4 text-left font-semibold min-w-[100px]" style={{ color: 'var(--text-primary)' }}>
                    Horário
                  </th>
                  {weekDates.map((dayInfo, idx) => (
                    <th key={idx} className="p-4 text-center min-w-[150px]">
                      <div className="flex flex-col gap-1">
                        <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>
                          {dayInfo.dayName}
                        </span>
                        <div className="flex items-center justify-center gap-2">
                          <span 
                            className={`text-sm px-2 py-1 rounded ${
                              dayInfo.isToday ? 'font-bold' : ''
                            }`}
                            style={dayInfo.isToday ? {
                              backgroundColor: 'var(--primary-teal)',
                              color: 'var(--background)'
                            } : {
                              color: 'var(--text-secondary)'
                            }}
                          >
                            {dayInfo.dayNumber}/{dayInfo.month + 1}
                          </span>
                          {dayInfo.isHoliday && (
                            <PartyPopper className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />
                          )}
                        </div>
                        {dayInfo.isHoliday && (
                          <Badge 
                            className="text-xs border-0 mt-1"
                            style={{ 
                              backgroundColor: 'var(--accent-orange)',
                              color: 'var(--background)'
                            }}
                          >
                            Feriado
                          </Badge>
                        )}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map(time => (
                  <tr key={time} className="border-b hover:bg-opacity-50 transition-colors" style={{ borderColor: 'var(--neutral-medium)' }}>
                    <td className="p-4 font-medium" style={{ color: 'var(--text-secondary)' }}>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {time}
                      </div>
                    </td>
                    {weekDates.map((dayInfo, idx) => {
                      const course = !dayInfo.isHoliday ? getClassForSlot(dayInfo.dayName, time) : null;
                      return (
                        <td key={`${idx}-${time}`} className="p-2">
                          {dayInfo.isHoliday ? (
                            <div 
                              className="p-3 rounded-xl text-center"
                              style={{ 
                                backgroundColor: 'rgba(255, 111, 60, 0.1)',
                                color: 'var(--accent-orange)'
                              }}
                            >
                              <p className="text-xs font-medium">{dayInfo.isHoliday.name}</p>
                            </div>
                          ) : course ? (
                            <div 
                              className="p-3 rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer"
                              style={{ 
                                backgroundColor: categoryColors[course.category]?.bg || 'var(--neutral-medium)',
                                color: categoryColors[course.category]?.text || 'var(--text-primary)'
                              }}
                            >
                              <p className="font-semibold text-sm mb-1">{course.title}</p>
                              <p className="text-xs opacity-90">{course.instructor}</p>
                            </div>
                          ) : (
                            <div className="p-3 text-center text-sm" style={{ color: 'var(--neutral-medium)' }}>-</div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMonthlyView = () => {
    const daysInMonth = getDaysInMonth(currentMonth, currentYear);
    const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
    const totalCells = Math.ceil((daysInMonth + firstDay) / 7) * 7;

    return (
      <Card className="card-innova border-none shadow-xl">
        <CardHeader style={{ backgroundColor: 'var(--primary-teal)' }}>
          <CardTitle className="flex items-center justify-between text-white font-heading">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendário Mensal
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentMonth === 0) {
                    setCurrentMonth(11);
                    setCurrentYear(currentYear - 1);
                  } else {
                    setCurrentMonth(currentMonth - 1);
                  }
                }}
                className="text-white hover:bg-white/20"
              >
                ← Mês Anterior
              </Button>
              <span className="text-sm font-semibold">
                {months[currentMonth]} {currentYear}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (currentMonth === 11) {
                    setCurrentMonth(0);
                    setCurrentYear(currentYear + 1);
                  } else {
                    setCurrentMonth(currentMonth + 1);
                  }
                }}
                className="text-white hover:bg-white/20"
              >
                Próximo Mês →
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-7 gap-2">
            {/* Cabeçalho dos dias */}
            {["Seg", "Ter", "Qua", "Qui", "Sex", "Sáb", "Dom"].map(day => (
              <div 
                key={day} 
                className="text-center font-semibold p-2 rounded-lg"
                style={{ backgroundColor: 'var(--neutral-light)', color: 'var(--text-primary)' }}
              >
                {day}
              </div>
            ))}

            {/* Dias do mês */}
            {Array.from({ length: totalCells }).map((_, index) => {
              const dayNumber = index - firstDay + 1;
              const isValidDay = dayNumber > 0 && dayNumber <= daysInMonth;
              const date = new Date(currentYear, currentMonth, dayNumber);
              const holiday = isValidDay ? isHoliday(date) : null;
              const isWeekend = date.getDay() === 0 || date.getDay() === 6;
              const isToday = isValidDay && 
                dayNumber === new Date().getDate() && 
                currentMonth === new Date().getMonth() &&
                currentYear === new Date().getFullYear();

              return (
                <div
                  key={index}
                  className={`min-h-[100px] p-2 rounded-xl border-2 transition-all ${
                    !isValidDay ? 'opacity-30' : 'hover:shadow-md cursor-pointer'
                  }`}
                  style={{
                    backgroundColor: holiday 
                      ? 'rgba(255, 111, 60, 0.1)' 
                      : isWeekend 
                      ? 'var(--neutral-light)' 
                      : 'var(--background)',
                    borderColor: isToday 
                      ? 'var(--primary-teal)' 
                      : 'var(--neutral-medium)'
                  }}
                >
                  {isValidDay && (
                    <>
                      <div className="flex items-center justify-between mb-2">
                        <span 
                          className={`text-sm font-semibold ${
                            isToday ? 'text-white px-2 py-1 rounded-full' : ''
                          }`}
                          style={isToday ? { backgroundColor: 'var(--primary-teal)' } : { color: 'var(--text-primary)' }}
                        >
                          {dayNumber}
                        </span>
                        {holiday && (
                          <PartyPopper className="w-4 h-4" style={{ color: 'var(--accent-orange)' }} />
                        )}
                      </div>
                      
                      {holiday && (
                        <div 
                          className="text-xs font-medium p-1 rounded mb-1"
                          style={{ 
                            backgroundColor: 'var(--accent-orange)',
                            color: 'var(--background)'
                          }}
                        >
                          {holiday.name}
                        </div>
                      )}

                      {!holiday && !isWeekend && courses.slice(0, 2).map((course, idx) => (
                        <div
                          key={idx}
                          className="text-xs p-1 rounded mb-1 truncate"
                          style={{
                            backgroundColor: categoryColors[course.category]?.bg || 'var(--neutral-medium)',
                            color: categoryColors[course.category]?.text || 'var(--text-primary)'
                          }}
                        >
                          {course.title}
                        </div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Legenda de Feriados */}
          <div className="mt-6 p-4 rounded-xl" style={{ backgroundColor: 'var(--neutral-light)' }}>
            <h4 className="font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
              <PartyPopper className="w-5 h-5" style={{ color: 'var(--accent-orange)' }} />
              Feriados de {months[currentMonth]} {currentYear}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {holidays
                .filter(h => {
                  const holidayDate = new Date(h.date + 'T00:00:00');
                  return holidayDate.getMonth() === currentMonth && 
                         holidayDate.getFullYear() === currentYear;
                })
                .map((holiday, idx) => {
                  const holidayDate = new Date(holiday.date + 'T00:00:00');
                  return (
                    <div 
                      key={idx} 
                      className="flex items-center gap-2 text-sm p-2 rounded-lg"
                      style={{ backgroundColor: 'var(--background)' }}
                    >
                      <span 
                        className="font-bold px-2 py-1 rounded"
                        style={{ 
                          backgroundColor: 'var(--accent-orange)',
                          color: 'var(--background)'
                        }}
                      >
                        {holidayDate.getDate()}
                      </span>
                      <span style={{ color: 'var(--text-primary)' }}>{holiday.name}</span>
                    </div>
                  );
                })}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="p-4 md:p-8" style={{ backgroundColor: 'var(--neutral-light)' }}>
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-heading font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Cronograma de Aulas
            </h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              Visualize seu horário e feriados do Distrito Federal
            </p>
          </div>

          <Tabs value={viewMode} onValueChange={setViewMode} className="w-full md:w-auto">
            <TabsList className="grid w-full grid-cols-2" style={{ backgroundColor: 'var(--background)' }}>
              <TabsTrigger value="weekly" className="data-[state=active]:bg-primary-teal">
                📅 Semanal
              </TabsTrigger>
              <TabsTrigger value="monthly" className="data-[state=active]:bg-primary-teal">
                📆 Mensal
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {viewMode === "weekly" ? renderWeeklyView() : renderMonthlyView()}

        <Card className="card-innova border-none shadow-lg">
          <CardHeader style={{ backgroundColor: 'var(--neutral-light)', borderBottom: '1px solid var(--neutral-medium)' }}>
            <CardTitle className="font-heading">Legenda de Disciplinas</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {Object.entries(categoryColors).map(([category, colors]) => (
                <div key={category} className="flex items-center gap-2">
                  <div 
                    className="w-6 h-6 rounded-lg shadow-sm" 
                    style={{ backgroundColor: colors.bg }}
                  />
                  <span className="text-sm capitalize" style={{ color: 'var(--text-primary)' }}>
                    {category.replace(/_/g, ' ')}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
