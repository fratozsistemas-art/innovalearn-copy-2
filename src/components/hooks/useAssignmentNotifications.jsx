import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

/**
 * Função auxiliar para criar notificação
 */
async function createAssignmentNotification(assignmentId, studentEmail, type) {
  const assignment = await base44.entities.Assignment.filter({ id: assignmentId });
  if (assignment.length === 0) throw new Error('Assignment not found');

  const task = assignment[0];
  
  let title, message, actionUrl;

  switch (type) {
    case 'created':
      title = '📝 Nova Tarefa Atribuída';
      message = `Você tem uma nova tarefa: "${task.title}". Prazo: ${new Date(task.due_date).toLocaleDateString('pt-BR')}`;
      actionUrl = `/assignments?highlight=${assignmentId}`;
      break;

    case 'due_soon':
      title = '⏰ Tarefa Vence em Breve';
      message = `A tarefa "${task.title}" vence amanhã! Não esqueça de enviar.`;
      actionUrl = `/assignments?highlight=${assignmentId}`;
      break;

    case 'graded':
      title = '✅ Tarefa Corrigida';
      message = `Sua tarefa "${task.title}" foi corrigida. Veja o feedback!`;
      actionUrl = `/assignments?highlight=${assignmentId}`;
      break;

    case 'resubmit':
      title = '🔄 Reenvio Necessário';
      message = `O professor solicitou reenvio da tarefa "${task.title}". Veja o feedback para melhorias.`;
      actionUrl = `/assignments?highlight=${assignmentId}`;
      break;

    default:
      throw new Error('Invalid notification type');
  }

  // Criar notificação
  await base44.entities.Notification.create({
    user_email: studentEmail,
    type: 'assignment_due',
    priority: type === 'due_soon' ? 'high' : 'medium',
    title,
    message,
    action_url: actionUrl,
    sent_at: new Date().toISOString()
  });

  console.log(`📧 Notificação "${type}" enviada para ${studentEmail}`);
  return { success: true };
}

/**
 * Hook para enviar notificações automáticas de tarefas
 */
export function useSendAssignmentNotification() {
  return useMutation({
    mutationFn: async ({ assignmentId, studentEmail, type }) => {
      return await createAssignmentNotification(assignmentId, studentEmail, type);
    }
  });
}

/**
 * Hook para notificar múltiplos alunos
 */
export function useBulkNotifyStudents() {
  return useMutation({
    mutationFn: async ({ assignmentId, studentEmails, type }) => {
      const promises = studentEmails.map(email => 
        createAssignmentNotification(assignmentId, email, type)
      );

      await Promise.all(promises);
      return { notified: studentEmails.length };
    }
  });
}