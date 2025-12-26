import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { usePets } from '../contexts/PetContext';
import { Button, Input, Label, Textarea, Card, CardContent, CardHeader, CardTitle } from '../components/ui';
import { ArrowLeft, Upload, X } from 'lucide-react';
import type { PetSpecies } from '../types';
import { fileToBase64 } from '../lib/utils';

export function PetForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addPet, updatePet, getPetById } = usePets();
  const isEditing = !!id;
  const existingPet = id ? getPetById(id) : undefined;

  const [formData, setFormData] = useState({
    name: '',
    species: 'dog' as PetSpecies,
    breed: '',
    birthDate: '',
    gender: 'unknown' as 'male' | 'female' | 'unknown',
    color: '',
    weight: '',
    microchipNumber: '',
    notes: '',
    photo: '',
  });

  const [photoPreview, setPhotoPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (existingPet) {
      setFormData({
        name: existingPet.name,
        species: existingPet.species,
        breed: existingPet.breed || '',
        birthDate: new Date(existingPet.birthDate).toISOString().split('T')[0],
        gender: existingPet.gender || 'unknown',
        color: existingPet.color || '',
        weight: existingPet.weight?.toString() || '',
        microchipNumber: existingPet.microchipNumber || '',
        notes: existingPet.notes || '',
        photo: existingPet.photo || '',
      });
      if (existingPet.photo) {
        setPhotoPreview(existingPet.photo);
      }
    }
  }, [existingPet]);

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setFormData({ ...formData, photo: base64 });
        setPhotoPreview(base64);
      } catch (error) {
        console.error('Error converting photo:', error);
      }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const petData = {
        name: formData.name,
        species: formData.species,
        breed: formData.breed,
        birthDate: new Date(formData.birthDate),
        gender: formData.gender,
        color: formData.color || undefined,
        weight: formData.weight ? parseFloat(formData.weight) : undefined,
        microchipNumber: formData.microchipNumber || undefined,
        notes: formData.notes || undefined,
        photo: formData.photo || undefined,
      };

      if (isEditing && id) {
        await updatePet(id, petData);
      } else {
        await addPet(petData);
      }

      navigate('/');
    } catch (error) {
      console.error('Error saving pet:', error);
      alert('Error al guardar la mascota');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Button
        variant="ghost"
        onClick={() => navigate(-1)}
        className="mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>
            {isEditing ? 'Editar Mascota' : 'Agregar Nueva Mascota'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col items-center gap-4">
              {photoPreview ? (
                <div className="relative">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData({ ...formData, photo: '' });
                      setPhotoPreview('');
                    }}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-secondary flex items-center justify-center border-4 border-dashed border-primary/50">
                  <Upload className="w-8 h-8 text-muted-foreground" />
                </div>
              )}
              <Label htmlFor="photo" className="cursor-pointer">
                <div className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors">
                  {photoPreview ? 'Cambiar Foto' : 'Subir Foto'}
                </div>
                <Input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </Label>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nombre *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="Nombre de tu mascota"
                />
              </div>

              <div>
                <Label htmlFor="species">Especie *</Label>
                <select
                  id="species"
                  value={formData.species}
                  onChange={(e) => setFormData({ ...formData, species: e.target.value as PetSpecies })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  required
                >
                  <option value="dog">Perro</option>
                  <option value="cat">Gato</option>
                  <option value="bird">Ave</option>
                  <option value="rabbit">Conejo</option>
                  <option value="hamster">Hámster</option>
                  <option value="fish">Pez</option>
                  <option value="reptile">Reptil</option>
                  <option value="other">Otro</option>
                </select>
              </div>

              <div>
                <Label htmlFor="breed">Raza</Label>
                <Input
                  id="breed"
                  value={formData.breed}
                  onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                  placeholder="Ej: Labrador, Siamés"
                />
              </div>

              <div>
                <Label htmlFor="birthDate">Fecha de Nacimiento *</Label>
                <Input
                  id="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="gender">Sexo</Label>
                <select
                  id="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | 'unknown' })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="unknown">Desconocido</option>
                  <option value="male">Macho</option>
                  <option value="female">Hembra</option>
                </select>
              </div>

              <div>
                <Label htmlFor="color">Color</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Color del pelaje/plumas"
                />
              </div>

              <div>
                <Label htmlFor="weight">Peso (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  step="0.1"
                  value={formData.weight}
                  onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                  placeholder="0.0"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="microchipNumber">Número de Microchip</Label>
                <Input
                  id="microchipNumber"
                  value={formData.microchipNumber}
                  onChange={(e) => setFormData({ ...formData, microchipNumber: e.target.value })}
                  placeholder="Número de identificación"
                />
              </div>

              <div className="col-span-2">
                <Label htmlFor="notes">Notas</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Información adicional sobre tu mascota"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(-1)}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Agregar'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
