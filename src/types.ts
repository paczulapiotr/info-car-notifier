export type ExamsResponse = {
  organizationId: string;
  isOskVehicleReservationEnabled: boolean;
  isRescheduleReservation: boolean;
  category: string;
  schedule: {
    scheduledDays: ScheduledDay[];
  };
};

export type ScheduledDay = {
  day: string;
  scheduledHours: ScheduledHour[];
};

export type ScheduledHour = {
  time: string;
  practiceExams: Exam[];
};

export type Exam = {
  id: string;
  places: number;
  date: string;
  amount: number;
};
