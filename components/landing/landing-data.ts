export interface ServiceItem {
  name: string;
  fee: number;
  preparation?: string;
}

export interface ClinicItem {
  id: string;
  name: string;
  rating: number;
  location: string;
  phone: string;
  image: string;
  description: string;
  services: ServiceItem[];
}

export interface DoctorItem {
  id: string;
  name: string;
  rating: number;
  specialty: string;
  experience: number;
  license: string;
  phone: string;
  address: string;
  image: string;
  bio: string;
  services: ServiceItem[];
}

export interface LabItem {
  id: string;
  name: string;
  rating: number;
  location: string;
  phone: string;
  image: string;
  description: string;
  tests: ServiceItem[];
}

export const clinicsData: ClinicItem[] = [
  {
    id: 'c1',
    name: 'Zewditu Specialty Clinic',
    rating: 4.8,
    location: 'Bole Medhanialem Road',
    phone: '+251 11 661 2345',
    image:
      'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&q=80&w=800',
    description:
      'State-of-the-art facility specializing in comprehensive cardiac care and multi-specialty outpatient services.',
    services: [
      { name: 'Cardiology Consultation', fee: 1200 },
      { name: 'Pediatric Checkup', fee: 800 },
      { name: 'General Practitioner', fee: 600 },
      { name: 'Dermatology Screening', fee: 950 },
      { name: 'Health Assessment', fee: 2000 },
      { name: 'Immunization', fee: 450 },
      { name: 'Neurology Exam', fee: 1800 },
    ],
  },
  {
    id: 'c2',
    name: 'Kadisco General Hospital',
    rating: 4.6,
    location: 'Gerji',
    phone: '+251 11 629 8902',
    image:
      'https://images.unsplash.com/photo-1587350859728-117699f8a70c?auto=format&fit=crop&q=80&w=800',
    description:
      'A community-focused hospital providing high-quality medical, surgical, and emergency services.',
    services: [
      { name: 'Emergency Care', fee: 500 },
      { name: 'Orthopedic Surgery', fee: 15000 },
      { name: 'Maternity Ward', fee: 8000 },
      { name: 'Radiology', fee: 1200 },
      { name: 'Physiotherapy', fee: 750 },
    ],
  },
  {
    id: 'c3',
    name: 'Bethzatha Health Service',
    rating: 4.7,
    location: 'Kazanchis',
    phone: '+251 11 553 4411',
    image:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    description:
      'Bethzatha provides specialized medical services with a focus on patient safety and clinical excellence.',
    services: [
      { name: 'Internal Medicine', fee: 900 },
      { name: 'Surgical Consultation', fee: 1500 },
      { name: 'Ophthalmology', fee: 1100 },
      { name: 'Laboratory Testing', fee: 400 },
    ],
  },
];

export const doctorsData: DoctorItem[] = [
  {
    id: 'd1',
    name: 'Dr. Selamawit Tadesse',
    rating: 4.9,
    specialty: 'Senior Dermatologist',
    experience: 12,
    license: 'ET-MD-2012-88',
    phone: '+251 911 223 344',
    address: 'Addis Ababa, Kazanchis',
    image:
      'https://images.unsplash.com/photo-1559839734-2b71f1536783?auto=format&fit=crop&q=80&w=800',
    bio: 'Experienced specialist in cosmetic and clinical dermatology with over a decade of practice.',
    services: [
      { name: 'Skin Consultation', fee: 1000 },
      { name: 'Laser Treatment', fee: 3500 },
      { name: 'Acne Management', fee: 800 },
      { name: 'Chemical Peel', fee: 2500 },
    ],
  },
  {
    id: 'd2',
    name: 'Dr. Elias Bekele',
    rating: 4.7,
    specialty: 'Cardiologist',
    experience: 8,
    license: 'ET-MD-2016-42',
    phone: '+251 922 556 778',
    address: 'Addis Ababa, Bole',
    image:
      'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=800',
    bio: 'Dedicated cardiologist focused on preventive heart health and advanced diagnostic procedures.',
    services: [
      { name: 'ECG Analysis', fee: 1500 },
      { name: 'Stress Test', fee: 2200 },
      { name: 'Heart Surgery Consult', fee: 1800 },
    ],
  },
  {
    id: 'd3',
    name: 'Dr. Meron Abebe',
    rating: 4.8,
    specialty: 'Pediatrician',
    experience: 15,
    license: 'ET-MD-2009-12',
    phone: '+251 933 445 566',
    address: 'Addis Ababa, Tikur Anbessa',
    image:
      'https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=800',
    bio: 'Senior pediatrician specializing in infant development and infectious diseases in children.',
    services: [
      { name: 'Newborn Checkup', fee: 1200 },
      { name: 'Child Vaccination', fee: 500 },
      { name: 'Nutrition Counseling', fee: 800 },
    ],
  },
];

export const labsData: LabItem[] = [
  {
    id: 'l1',
    name: 'Arsho Advanced Medical Lab',
    rating: 4.9,
    location: 'Kazanchis',
    phone: '+251 11 551 7722',
    image:
      'https://images.unsplash.com/photo-1579152276506-448c372448ef?auto=format&fit=crop&q=80&w=800',
    description:
      'ISO-certified diagnostic laboratory providing clinical precision for over three decades.',
    tests: [
      { name: 'Full Blood Count', fee: 450, preparation: 'Fast for 8 hours' },
      { name: 'MRI Brain Scan', fee: 5500, preparation: 'No metal objects' },
      { name: 'Thyroid Panel', fee: 850, preparation: 'No specific prep' },
      { name: 'Liver Function Test', fee: 1100, preparation: 'Overnight fast' },
      { name: 'Vitamin D Level', fee: 1800, preparation: 'None' },
      { name: 'Lipid Profile', fee: 650, preparation: '12-hour fast' },
    ],
  },
  {
    id: 'l2',
    name: 'International Clinical Labs (ICL)',
    rating: 4.8,
    location: 'Bole',
    phone: '+251 11 618 5912',
    image:
      'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?auto=format&fit=crop&q=80&w=800',
    description:
      'Accredited laboratory network providing a wide range of pathology and imaging services.',
    tests: [
      { name: 'Lipid Profile', fee: 600, preparation: '12-hour fast' },
      { name: 'X-Ray Chest', fee: 900, preparation: 'Remove jewelry' },
      { name: 'DNA Paternity Test', fee: 12000, preparation: 'Appointment required' },
      { name: 'Blood Glucose', fee: 200, preparation: 'Fasting' },
    ],
  },
  {
    id: 'l3',
    name: 'Wudassie Diagnostic Center',
    rating: 4.6,
    location: 'Piassa',
    phone: '+251 11 122 3344',
    image:
      'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&q=80&w=800',
    description:
      'Reliable diagnostic services specializing in modern imaging and radiology across Addis.',
    tests: [
      { name: 'CT Scan Abdomen', fee: 4500, preparation: 'Drink contrast if advised' },
      { name: 'Ultrasound Pelvic', fee: 1200, preparation: 'Full bladder' },
      { name: 'ECG', fee: 800, preparation: 'Chest area clear' },
    ],
  },
];
