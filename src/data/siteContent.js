export const navigationLinks = [
  { label: 'Home', path: '/' },
  { label: 'Scanner', path: '/scanner' },
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'History', path: '/history' },
  { label: 'Resources', path: '/resources' },
  { label: 'About', path: '/about' },
  { label: 'Contact', path: '/contact' },
]

export const programStats = [
  { value: '18+', label: 'Red flags checked per link' },
  { value: '0s', label: 'Wait time' },
  { value: '100%', label: 'Free to use' },
]

export const features = [
  {
    title: 'Instant Analysis',
    description: "Just paste a URL. We'll instantly check it against common phishing tactics and tell you if it's safe.",
  },
  {
    title: 'Brand Impersonation Check',
    description: 'Scammers love to make links look like Google or PayPal. We check for typosquatting automatically.',
  },
  {
    title: 'Detailed Threat Report',
    description: "We don't just say 'it's bad'. We show you exactly which parts of the URL are suspicious.",
  },
  {
    title: 'Works everywhere',
    description: 'Use it on your phone or laptop whenever someone sends you a sketchy link on WhatsApp or email.',
  },
]

export const testimonials = [
  {
    quote: "Ankit from my college tried it and found a fake Amazon link sitting right in his spam folder. It's super handy.",
    name: 'Rahul K.',
    role: 'Student',
  },
  {
    quote: "I built this because I kept getting sketchy links on WhatsApp and wanted a quick way to verify them without clicking.",
    name: 'Ritesh Kumar Pandit',
    role: 'Developer',
  },
  {
    quote: "The breakdown of exactly why a link is bad is really helpful. Now I know what to look out for.",
    name: 'Sneha G.',
    role: 'Freelancer',
  },
]

export const highlights = [
  'Checks for IP addresses hidden in links',
  'Spots fake brand names (typosquatting)',
  'Flags weird domains like .tk or .xyz',
  'Warns you about URL shorteners',
]

export const aboutPoints = [
  'We break the URL down into pieces.',
  'We run it through an AI engine and 18+ heuristic rules to spot red flags.',
  "We give it a score from 0-100 so you know exactly how dangerous it is."
]

export const faqData = [
  {
    question: 'How does PhishGuard work?',
    answer: "Simply paste a suspicious URL into the scanner. We run it through an AI engine and 18+ heuristic rules to spot red flags.",
  },
]
