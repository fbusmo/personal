import { usePets } from '../contexts/PetContext';
import { PetCard } from '../components/pets/PetCard';
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui';
import { Plus, Bell, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getRelativeDate } from '../lib/utils';

export function Home() {
  const { pets, loading, getUpcomingReminders } = usePets();
  const navigate = useNavigate();
  const upcomingReminders = getUpcomingReminders().slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-muted-foreground">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Mis Mascotas</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona el cuidado y salud de tus mascotas
          </p>
        </div>
        <Button onClick={() => navigate('/pets/new')} size="lg">
          <Plus className="w-5 h-5" />
          Agregar Mascota
        </Button>
      </div>

      {upcomingReminders.length > 0 && (
        <Card className="mb-8 border-primary/50 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Recordatorios Próximos
            </CardTitle>
            <CardDescription>Tienes {upcomingReminders.length} recordatorios pendientes</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingReminders.map((reminder) => (
                <div
                  key={reminder.id}
                  className="flex items-center justify-between p-3 bg-background rounded-lg border"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{reminder.title}</p>
                      {reminder.description && (
                        <p className="text-sm text-muted-foreground">{reminder.description}</p>
                      )}
                    </div>
                  </div>
                  <span className="text-sm font-medium text-primary">
                    {getRelativeDate(new Date(reminder.dueDate))}
                  </span>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => navigate('/reminders')}
            >
              Ver Todos los Recordatorios
            </Button>
          </CardContent>
        </Card>
      )}

      {pets.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mb-4">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">No tienes mascotas registradas</h2>
            <p className="text-muted-foreground mb-6 text-center max-w-md">
              Comienza agregando tu primera mascota para llevar un registro completo de su salud y cuidado
            </p>
            <Button onClick={() => navigate('/pets/new')} size="lg">
              <Plus className="w-5 h-5" />
              Agregar Primera Mascota
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      )}
    </div>
  );
}
