import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePets } from '../contexts/PetContext';
import { Button, Input, Label, Textarea, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { ArrowLeft } from 'lucide-react';
import type { MedicalEventType } from '../types';

export function EventForm() {
  const { petId } = useParams();
  const navigate = useNavigate();
  const { addMedicalEvent, getPetById } = usePets();
  const pet = petId ? getPetById(petId) : undefined;

  const [formData, setFormData] = useState({
    type: 'consultation' as MedicalEventType,
    title: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    veterinarian: '',
    clinic: '',
    cost: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!petId) return;

    setLoading(true);

    try {
      await addMedicalEvent({
        petId,
        type: formData.type,
        title: formData.title,
        date: new Date(formData.date),
        description: formData.description || undefined,
        veterinarian: formData.veterinarian || undefined,
        clinic: formData.clinic || undefined,
        cost: formData.cost ? parseFloat(formData.cost) : undefined,
      });

      navigate(`/pets/${petId}`);
    } catch (error) {
      console.error('Error saving event:', error);
      alert('Error al guardar el evento médico');
    } finally {
      setLoading(false);
    }
  };

  if (!pet) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-muted-foreground">Mascota no encontrada</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button variant="ghost" onClick={() => navigate(-1)} className="mb-6">
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Agregar Evento Médico - {pet.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="type">Tipo de Evento *</Label>
                <select
                  id="type"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as MedicalEventType })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="consultation">Consulta</option>
                  <option value="vaccination">Vacuna</option>
                  <option value="deworming">Desparasitación</option>
                  <option value="exam">Examen</option>
                  <option value="surgery">Cirugía</option>
                  <option value="medication">Medicación</option>
                </select>
              </div>

              <div className="col-span-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                  placeholder="Ej: Vacuna antirrábica anual"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="date">Fecha *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  required
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="description">Descripción</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detalles adicionales sobre el evento"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="veterinarian">Veterinario</Label>
                <Input
                  id="veterinarian"
                  value={formData.veterinarian}
                  onChange={(e) => setFormData({ ...formData, veterinarian: e.target.value })}
                  placeholder="Nombre del veterinario"
                />
              </div>

              <div>
                <Label htmlFor="clinic">Clínica</Label>
                <Input
                  id="clinic"
                  value={formData.clinic}
                  onChange={(e) => setFormData({ ...formData, clinic: e.target.value })}
                  placeholder="Nombre de la clínica"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="cost">Costo ($)</Label>
                <Input
                  id="cost"
                  type="number"
                  step="0.01"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button type="button" variant="outline" onClick={() => navigate(-1)} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Guardando...' : 'Agregar Evento'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
