import { usePets } from '../contexts/PetContext';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../components/ui';
import { ArrowLeft, Calendar, Check, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRelativeDate } from '../lib/utils';

export function Reminders() {
  const navigate = useNavigate();
  const { reminders, pets, updateReminder } = usePets();

  const upcomingReminders = reminders
    .filter(r => !r.completed && new Date(r.dueDate) >= new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const overdueReminders = reminders
    .filter(r => !r.completed && new Date(r.dueDate) < new Date())
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  const completedReminders = reminders
    .filter(r => r.completed)
    .sort((a, b) => new Date(b.completedAt || 0).getTime() - new Date(a.completedAt || 0).getTime())
    .slice(0, 10);

  const getPetName = (petId: string) => {
    const pet = pets.find(p => p.id === petId);
    return pet?.name || 'Desconocida';
  };

  const handleToggleComplete = async (reminderId: string, completed: boolean) => {
    await updateReminder(reminderId, {
      completed,
      completedAt: completed ? new Date() : undefined,
    });
  };

  const ReminderCard = ({ reminder }: { reminder: typeof reminders[0] }) => (
    <div className="flex items-start gap-4 p-4 bg-card border rounded-lg">
      <button
        onClick={() => handleToggleComplete(reminder.id, !reminder.completed)}
        className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          reminder.completed
            ? 'bg-primary border-primary text-primary-foreground'
            : 'border-muted-foreground hover:border-primary'
        }`}
      >
        {reminder.completed && <Check className="w-4 h-4" />}
      </button>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className={`font-semibold ${reminder.completed ? 'line-through text-muted-foreground' : ''}`}>
            {reminder.title}
          </h3>
          <Badge variant={reminder.completed ? 'secondary' : 'default'}>
            {reminder.type === 'vaccination' && 'Vacuna'}
            {reminder.type === 'medication' && 'Medicación'}
            {reminder.type === 'appointment' && 'Cita'}
            {reminder.type === 'deworming' && 'Desparasitación'}
            {reminder.type === 'other' && 'Otro'}
          </Badge>
        </div>

        {reminder.description && (
          <p className="text-sm text-muted-foreground mb-2">{reminder.description}</p>
        )}

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {getRelativeDate(new Date(reminder.dueDate))}
          </span>
          <span>•</span>
          <span>{getPetName(reminder.petId)}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      <div className="mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">Recordatorios</h1>
        <p className="text-muted-foreground">Gestiona los recordatorios de tus mascotas</p>
      </div>

      {overdueReminders.length > 0 && (
        <Card className="mb-6 border-destructive/50 bg-destructive/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-destructive">
              <Clock className="w-5 h-5" />
              Atrasados ({overdueReminders.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {overdueReminders.map(reminder => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))}
          </CardContent>
        </Card>
      )}

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Próximos ({upcomingReminders.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {upcomingReminders.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No hay recordatorios próximos
            </p>
          ) : (
            <div className="space-y-3">
              {upcomingReminders.map(reminder => (
                <ReminderCard key={reminder.id} reminder={reminder} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {completedReminders.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-muted-foreground">
              <Check className="w-5 h-5" />
              Completados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {completedReminders.map(reminder => (
              <ReminderCard key={reminder.id} reminder={reminder} />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
