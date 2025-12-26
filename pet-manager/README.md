# 🐾 Pet Manager - Gestión de Mascotas

Aplicación web moderna para gestionar el cuidado y la salud de tus mascotas. Registra eventos médicos, programa recordatorios y mantén un historial completo de cada una de tus mascotas.

## ✨ Características

### Funcionalidades Core (MVP)

#### 📋 Gestión de Mascotas
- Crear perfil completo de mascota (nombre, especie, raza, fecha de nacimiento, foto)
- Visualizar lista de todas tus mascotas
- Editar información de mascotas
- Eliminar mascotas
- Calcular edad automáticamente
- Cargar foto de perfil

#### 🏥 Registro de Eventos Médicos
- **Tipos de eventos**: Consulta, Vacuna, Desparasitación, Examen, Cirugía, Medicación
- Información detallada: fecha, título, descripción
- Datos del veterinario y clínica
- Registro de costos
- Línea de tiempo visual de eventos por mascota
- Historial médico completo

#### 🔔 Sistema de Recordatorios
- Vista de recordatorios próximos
- Recordatorios atrasados destacados
- Marcar recordatorios como completados
- Categorías: Vacunación, Medicación, Citas, Desparasitación
- Fechas relativas (Hoy, Mañana, En X días)

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 con TypeScript
- **Build Tool**: Vite 7
- **Estilos**: Tailwind CSS 3
- **Componentes UI**: Componentes personalizados estilo shadcn/ui
- **Base de datos**: Dexie.js (wrapper de IndexedDB)
- **Navegación**: React Router DOM
- **Iconos**: Lucide React
- **Gestión de estado**: React Context API
- **Fechas**: date-fns

## 📁 Estructura del Proyecto

```
pet-manager/
├── src/
│   ├── components/
│   │   ├── ui/              # Componentes UI reutilizables
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Label.tsx
│   │   │   ├── Textarea.tsx
│   │   │   └── Badge.tsx
│   │   ├── pets/            # Componentes específicos de mascotas
│   │   │   └── PetCard.tsx
│   │   ├── events/          # Componentes de eventos médicos
│   │   └── layout/          # Componentes de layout
│   ├── contexts/
│   │   └── PetContext.tsx   # Context de gestión de estado
│   ├── lib/
│   │   ├── db.ts            # Configuración de Dexie/IndexedDB
│   │   └── utils.ts         # Funciones utilitarias
│   ├── pages/
│   │   ├── Home.tsx         # Página principal (lista de mascotas)
│   │   ├── PetForm.tsx      # Formulario agregar/editar mascota
│   │   ├── PetProfile.tsx   # Perfil de mascota con timeline
│   │   ├── EventForm.tsx    # Formulario de eventos médicos
│   │   └── Reminders.tsx    # Página de recordatorios
│   ├── types/
│   │   └── index.ts         # Definiciones de tipos TypeScript
│   ├── App.tsx              # Componente principal
│   ├── main.tsx             # Punto de entrada
│   └── index.css            # Estilos globales
├── public/
├── index.html
├── package.json
├── tailwind.config.js
├── tsconfig.json
└── vite.config.ts
```

## 🚀 Instalación y Uso

### Requisitos Previos
- Node.js 18+
- npm o yarn

### Instalación

1. Clona el repositorio:
```bash
git clone <repository-url>
cd pet-manager
```

2. Instala las dependencias:
```bash
npm install
```

3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

4. Abre tu navegador en `http://localhost:5173`

### Comandos Disponibles

```bash
npm run dev      # Iniciar servidor de desarrollo
npm run build    # Compilar para producción
npm run preview  # Vista previa del build de producción
npm run lint     # Ejecutar linter
```

## 📱 Pantallas del MVP

1. **Home** - Lista de mascotas + recordatorios próximos
2. **Perfil de Mascota** - Información detallada + timeline de eventos médicos
3. **Agregar/Editar Mascota** - Formulario completo con foto
4. **Agregar Evento Médico** - Formulario para registrar eventos
5. **Recordatorios** - Lista de recordatorios pendientes y completados

## 💾 Almacenamiento de Datos

La aplicación utiliza **IndexedDB** a través de Dexie.js para almacenar todos los datos localmente en el navegador:

- **Persistencia**: Los datos se mantienen incluso al cerrar el navegador
- **Sin servidor**: Toda la información se almacena localmente
- **Privacidad**: Tus datos nunca salen de tu dispositivo

### Estructura de la Base de Datos

```typescript
// Tablas
- pets          // Información de mascotas
- medicalEvents // Eventos médicos
- reminders     // Recordatorios
- settings      // Configuraciones de la app
```

## 🎨 Personalización de Estilos

Los colores y estilos se pueden personalizar modificando las variables CSS en `src/index.css`:

```css
:root {
  --primary: 221.2 83.2% 53.3%;
  --secondary: 210 40% 96.1%;
  --destructive: 0 84.2% 60.2%;
  /* ... más variables */
}
```

También puedes modificar el `tailwind.config.js` para extender el tema de Tailwind CSS.

## 🔮 Funcionalidades Futuras (Roadmap)

- [ ] Exportar historial a PDF
- [ ] Compartir perfil con veterinario
- [ ] Múltiples usuarios/familias
- [ ] Gráficos de peso y salud
- [ ] Integración con calendarios (Google Calendar, iCal)
- [ ] Backup en la nube
- [ ] Gestión de gastos y presupuesto
- [ ] Contactos de veterinarias favoritas
- [ ] Recordatorios recurrentes automáticos
- [ ] Modo oscuro
- [ ] PWA (Progressive Web App)
- [ ] Notificaciones push
- [ ] Exportar/Importar datos

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 🙏 Agradecimientos

- Tailwind CSS por el framework de estilos
- Lucide por los iconos
- Dexie.js por simplificar IndexedDB
- shadcn/ui por la inspiración en los componentes

---

Hecho con ❤️ para los amantes de las mascotas 🐶🐱🐦🐰
