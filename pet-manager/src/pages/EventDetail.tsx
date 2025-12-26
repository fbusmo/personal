import { useParams, useNavigate } from 'react-router-dom';
import { usePets } from '../contexts/PetContext';
import { Button, Card, CardContent, CardHeader, CardTitle, Badge } from '../components/ui';
import { ArrowLeft, Trash2, Calendar, DollarSign, MapPin, User } from 'lucide-react';
import { formatDate } from '../lib/utils';

const eventLabels: Record<string, string> = {
  consultation: 'Consulta',
  vaccination: 'Vacuna',
  deworming: 'Desparasitación',
  exam: 'Examen',
  surgery: 'Cirugía',
  medication: 'Medicación',
};

export function EventDetail() {
  const { petId, eventId } = useParams();
  const navigate = useNavigate();
  const { getPetById, medicalEvents, deleteMedicalEvent } = usePets();

  const pet = petId ? getPetById(petId) : undefined;
  const event = medicalEvents.find(e => e.id === eventId);

  if (!pet || !event) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <p className="text-center text-muted-foreground">Evento no encontrado</p>
      </div>
    );
  }

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      await deleteMedicalEvent(event.id);
      navigate(`/pets/${petId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" onClick={() => navigate(`/pets/${petId}`)} className="mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver al perfil de {pet.name}
      </Button>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Badge variant="default">{eventLabels[event.type]}</Badge>
                <span className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  {formatDate(new Date(event.date))}
                </span>
              </div>
              <CardTitle className="text-3xl">{event.title}</CardTitle>
            </div>
            <div className="flex gap-2">
              <Button variant="destructive" onClick={handleDelete} size="icon">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {event.description && (
            <div>
              <h3 className="font-semibold text-lg mb-2">Descripción</h3>
              <p className="text-muted-foreground whitespace-pre-wrap">{event.description}</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {event.veterinarian && (
              <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                <User className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Veterinario</p>
                  <p className="font-medium">Dr(a). {event.veterinarian}</p>
                </div>
              </div>
            )}

            {event.clinic && (
              <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Clínica</p>
                  <p className="font-medium">{event.clinic}</p>
                </div>
              </div>
            )}

            {event.cost !== undefined && (
              <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                <DollarSign className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Costo</p>
                  <p className="font-medium text-lg">${event.cost.toFixed(2)}</p>
                </div>
              </div>
            )}

            {event.nextAppointment && (
              <div className="flex items-start gap-3 p-4 bg-secondary/30 rounded-lg">
                <Calendar className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Próxima cita</p>
                  <p className="font-medium">{formatDate(new Date(event.nextAppointment))}</p>
                </div>
              </div>
            )}
          </div>

          {event.attachments && event.attachments.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3">Archivos adjuntos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {event.attachments.map((attachment) => (
                  <div key={attachment.id} className="border rounded-lg p-3">
                    {attachment.type === 'image' ? (
                      <img
                        src={attachment.data}
                        alt={attachment.name}
                        className="w-full h-32 object-cover rounded mb-2"
                      />
                    ) : (
                      <div className="w-full h-32 bg-secondary flex items-center justify-center rounded mb-2">
                        <p className="text-4xl">📄</p>
                      </div>
                    )}
                    <p className="text-sm font-medium truncate">{attachment.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {(attachment.size / 1024).toFixed(1)} KB
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              Creado el {formatDate(new Date(event.createdAt))}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
