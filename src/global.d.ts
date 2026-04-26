type GenericValue = number | string;

interface Aerobic {
  time: GenericValue; // in minutes
  speed: GenericValue; // in km/h
  incline: GenericValue; // in percentage
  notes?: string;
}

interface Strength {
  equipment: string;
  sets: GenericValue;
  reps: GenericValue;
  weight: GenericValue;
  notes?: string;
}

type WorkOut = Aerobic | Strength;

interface WeeklyPlan {
  date: Date;
  workouts: WorkOut[];
  notes?: string;
}

type Plans = WeeklyPlan[];
