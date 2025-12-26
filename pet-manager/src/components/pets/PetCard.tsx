import type { Pet } from '../../types';
import { Card, CardContent } from '../ui';
import { Dog, Cat, Bird, Fish, Heart } from 'lucide-react';
import { calculateAge } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface PetCardProps {
  pet: Pet;
}

const PetIcon = ({ species }: { species: Pet['species'] }) => {
  const iconProps = { className: 'w-8 h-8 text-primary' };

  switch (species) {
    case 'dog':
      return <Dog {...iconProps} />;
    case 'cat':
      return <Cat {...iconProps} />;
    case 'bird':
      return <Bird {...iconProps} />;
    case 'fish':
      return <Fish {...iconProps} />;
    default:
      return <Heart {...iconProps} />;
  }
};

export function PetCard({ pet }: PetCardProps) {
  const navigate = useNavigate();

  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
      onClick={() => navigate(`/pets/${pet.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {pet.photo ? (
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center">
                <PetIcon species={pet.species} />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-semibold text-foreground truncate">{pet.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">
              {pet.breed || pet.species}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {calculateAge(new Date(pet.birthDate))}
            </p>
            {pet.gender && (
              <p className="text-xs text-muted-foreground mt-1 capitalize">
                {pet.gender === 'male' ? 'Macho' : pet.gender === 'female' ? 'Hembra' : 'Desconocido'}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
