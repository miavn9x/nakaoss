export interface Schedule {
  id: string; // _id
  code: string;
  details: {
    lang: string;
    title: string;
    content: string;
  }[];
  description?: string;
  cover?: {
    mediaCode: string;
    url: string;
  };
  startDate?: string;
  location?: string;
  createdAt?: string;
}

export interface ScheduleListItem {
  id: string; // _id
  code: string;
  details: {
    lang: string;
    title: string;
    content: string;
  }[];
  description?: string;
  cover?: {
    mediaCode: string;
    url: string;
  };
  startDate?: string;
}
