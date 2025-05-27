export interface Achievement {
  id: number;
  companyId: string;
  title: string;
  description: string;
  year: string;
  skills: number[];
}

export interface JobDuty {
  title: string;
  description: string;
}

export interface Company {
  id: string;
  name: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  location: string;
  jobTitle: string;
  jobDuties: JobDuty[];
  achievements: number[];
} 