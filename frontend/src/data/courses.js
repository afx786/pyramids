export const COURSES = [
  { value: 'B.Tech Computer Science and Engineering', label: 'B.Tech Computer Science and Engineering' },
  { value: 'B.Tech Computer Science and Engineering (AI & ML)', label: 'B.Tech CSE (AI & ML)' },
  { value: 'B.Tech Computer Science and Engineering (Data Science)', label: 'B.Tech CSE (Data Science)' },
  { value: 'B.Tech Computer Science and Engineering (Cyber Security)', label: 'B.Tech CSE (Cyber Security)' },
  { value: 'B.Tech Information Technology (Data Science & ML)', label: 'B.Tech IT (Data Science & ML)' },
  { value: 'B.Tech Electronics and Communication Engineering', label: 'B.Tech Electronics & Communication Engineering' },
  { value: 'B.C.A. (Bachelor of Computer Applications)', label: 'B.C.A. (Bachelor of Computer Applications)' },
  { value: 'M.Tech Computer Science and Engineering (Software Engineering)', label: 'M.Tech CSE (Software Engineering)' },
  { value: 'M.Tech Computer Science and Engineering (Data Science)', label: 'M.Tech CSE (Data Science)' },
  { value: 'M.Tech Computer Science and Engineering (AI & Robotics)', label: 'M.Tech CSE (AI & Robotics)' },
  { value: 'M.Tech CSE (Working Professionals)', label: 'M.Tech CSE (Working Professionals)' },
  { value: 'M.Tech Information & Communication Technology', label: 'M.Tech ICT' },
  { value: 'M.Tech IT (Data Science & ML)', label: 'M.Tech IT (Data Science & ML)' },
  { value: 'M.Tech ECE (Wireless Communication and Networks)', label: 'M.Tech ECE (Wireless Communication)' },
  { value: 'M.Tech ECE (VLSI Design)', label: 'M.Tech ECE (VLSI Design)' },
  { value: 'M.Tech ECE (Railway Signaling, Telecommunication and RAMS)', label: 'M.Tech ECE (Railway Signaling)' },
  { value: 'M.C.A. (Artificial Intelligence)', label: 'M.C.A. (AI)' },
  { value: 'M.C.A. (Data Science)', label: 'M.C.A. (Data Science)' },
  { value: 'Integrated B.Tech-M.Tech CSE (AI & Robotics)', label: 'Integrated B.Tech-M.Tech CSE (AI & Robotics)' },
  { value: 'Integrated B.Tech-M.Tech CSE (Data Science)', label: 'Integrated B.Tech-M.Tech CSE (Data Science)' },
  { value: 'Integrated B.Tech-M.Tech CSE (Software Engineering)', label: 'Integrated B.Tech-M.Tech CSE (Software Engineering)' },
  { value: 'Integrated B.Tech-M.Tech ECE', label: 'Integrated B.Tech-M.Tech ECE' },
];

export const COURSES_BY_CATEGORY = [
  {
    category: 'Undergraduate (Bachelors)',
    courses: COURSES.slice(0, 7),
  },
  {
    category: 'Postgraduate (Masters)',
    courses: COURSES.slice(7, 18),
  },
  {
    category: 'Integrated Programmes',
    courses: COURSES.slice(18),
  },
];
