import { useParams, useNavigate } from 'react-router-dom';
import { usePets } from '../contexts/PetContext';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../components/ui';
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  Syringe,
  Stethoscope,
  Pill,
  FileText,
  Activity,
  Calendar,
} from 'lucide-react';
import { calculateAge, formatDate } from '../lib/utils';
import type { MedicalEventType } from '../types';

const eventIcons: Record<MedicalEventType, React.ReactNode> = {
  consultation: <Stethoscope className="w-4 h-4" />,
  vaccination: <Syringe className="w-4 h-4" />,
  deworming: <Pill className="w-4 h-4" />,
  exam: <FileText className="w-4 h-4" />,
  surgery: <Activity className="w-4 h-4" />,
  medication: <Pill className="w-4 h-4" />,
};

const eventLabels: Record<MedicalEventType, string> = {
  consultation: 'Consulta',
  vaccination: 'Vacuna',
  deworming: 'Desparasitación',
  exam: 'Examen',
  surgery: 'Cirugía',
  medication: 'Medicación',
};

export function PetProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPetById, getEventsByPetId, deletePet } = usePets();

  const pet = id ? getPetById(id) : undefined;
  const events = id ? getEventsByPetId(id) : [];

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Mascota no encontrada</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que quieres eliminar a ${pet.name}?`)) {
      await deletePet(pet.id);
      navigate('/');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate('/')} className="mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0 mx-auto md:mx-0">
              {pet.photo ? (
                <img
                  src={pet.photo}
                  alt={pet.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center text-4xl">
                  🐾
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-3xl font-bold">{pet.name}</h1>
                  <p className="text-lg text-muted-foreground capitalize">
                    {pet.breed || pet.species}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate(`/pets/${pet.id}/edit`)}>
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                  <Button variant="destructive" onClick={handleDelete}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Edad</p>
                  <p className="font-medium">{calculateAge(new Date(pet.birthDate))}</p>
                </div>
                {pet.gender && (
                  <div>
                    <p className="text-muted-foreground">Sexo</p>
                    <p className="font-medium capitalize">
                      {pet.gender === 'male' ? 'Macho' : pet.gender === 'female' ? 'Hembra' : 'Desconocido'}
                    </p>
                  </div>
                )}
                {pet.weight && (
                  <div>
                    <p className="text-muted-foreground">Peso</p>
                    <p className="font-medium">{pet.weight} kg</p>
                  </div>
                )}
                {pet.color && (
                  <div>
                    <p className="text-muted-foreground">Color</p>
                    <p className="font-medium">{pet.color}</p>
                  </div>
                )}
                {pet.microchipNumber && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Microchip</p>
                    <p className="font-medium">{pet.microchipNumber}</p>
                  </div>
                )}
              </div>

              {pet.notes && (
                <div className="mt-4 p-4 bg-secondary/50 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Notas</p>
                  <p className="text-sm">{pet.notes}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Historial Médico
            </CardTitle>
            <Button onClick={() => navigate(`/pets/${pet.id}/events/new`)}>
              <Plus className="w-4 h-4" />
              Agregar Evento
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {events.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                No hay eventos médicos registrados
              </p>
              <Button onClick={() => navigate(`/pets/${pet.id}/events/new`)}>
                <Plus className="w-4 h-4" />
                Agregar Primer Evento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="relative pl-8 pb-8 border-l-2 border-border last:border-l-0 last:pb-0"
                >
                  <div className="absolute left-0 top-0 -translate-x-1/2 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    {eventIcons[event.type]}
                  </div>

                  <div
                    className="ml-4 p-4 bg-card border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => navigate(`/pets/${pet.id}/events/${event.id}`)}
                  >
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge>{eventLabels[event.type]}</Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(new Date(event.date))}
                          </span>
                        </div>
                        <h3 className="font-semibold text-lg">{event.title}</h3>
                      </div>
                    </div>

                    {event.description && (
                      <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                    )}

                    {(event.veterinarian || event.clinic) && (
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {event.veterinarian && (
                          <span>Dr(a). {event.veterinarian}</span>
                        )}
                        {event.clinic && <span>{event.clinic}</span>}
                      </div>
                    )}

                    {event.cost && (
                      <p className="text-sm font-medium text-primary mt-2">
                        ${event.cost.toFixed(2)}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
