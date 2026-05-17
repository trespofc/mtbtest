import express from 'express';
import path from 'path';
import fs from 'fs-extra';
import cors from 'cors';
import multer from 'multer';
import { createServer as createViteServer } from 'vite';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'public', 'uploads');

// Ensure data and upload directories exist
fs.ensureDirSync(DATA_DIR);
fs.ensureDirSync(UPLOADS_DIR);

const FILES = {
  sections: path.join(DATA_DIR, 'sections.json'),
  theme: path.join(DATA_DIR, 'theme.json'),
  tournaments: path.join(DATA_DIR, 'tournaments.json'),
  seo: path.join(DATA_DIR, 'seo.json'),
  ads: path.join(DATA_DIR, 'ads.json'),
  traffic: path.join(DATA_DIR, 'traffic.json'),
  team: path.join(DATA_DIR, 'team.json'),
  socials: path.join(DATA_DIR, 'socials.json'),
  stats: path.join(DATA_DIR, 'stats.json'),
  sponsors: path.join(DATA_DIR, 'sponsors.json'),
  content: path.join(DATA_DIR, 'content.json'),
  nav: path.join(DATA_DIR, 'nav.json'),
};

// Initialize files if missing
const initialData = {
  sections: [
    { id: 'hero', type: 'normal', title: 'Dominate The Field', visible: true, order: 0, content: '' },
    { id: 'stats', type: 'normal', title: 'Our Impact', visible: true, order: 1, content: '' },
    { id: 'tournaments', type: 'tournament', title: 'Active Warfare', visible: true, order: 2, filter: 'LIVE' },
  ],
  theme: { type: 'dark', primary: '#b026ff', secondary: '#c026d3', showChampionShowcase: true, logo: '' },
  tournaments: [
    {
      id: 'tourn_live_1',
      title: 'METAL BLADE INVITATIONAL S1',
      date: '2026-05-17',
      time: '20:00 GMT+6',
      prize: '৳ 50,000',
      status: 'LIVE',
      image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2070&auto=format&fit=crop',
      desc: 'The ultimate showdown of elite squads. Only one will dominate the server.',
      rules: 'Standard ESPORTS Rules. No Hacks. Mobile Only.',
      slots: '12/12'
    },
    {
      id: 'tour_upcoming_1',
      title: 'CHAMPIONS RUSH: JUNIOR S3',
      date: '2026-05-25',
      time: '18:30 GMT+6',
      prize: '৳ 10,000',
      status: 'UPCOMING',
      image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070&auto=format&fit=crop',
      desc: 'Developing the next generation of Free Fire pros in Bangladesh.',
      rules: 'Under 18 only. Must provide ID.',
      slots: '4/48'
    },
    {
      id: 'tourn_ended_1',
      title: 'METAL CUP: WINTER FINALS',
      date: '2026-01-15',
      time: '21:00 GMT+6',
      prize: '৳ 1,00,000',
      status: 'ENDED',
      image: 'https://images.unsplash.com/photo-1533972751724-9135a84124c6?q=80&w=2070&auto=format&fit=crop',
      desc: 'A historic showdown that broke viewership records.',
      rules: 'Pro League Format.',
      slots: 'FULL'
    }
  ],
  seo: { title: 'Metal Blade Int Esports', description: 'Premier Free Fire organization from Bangladesh. Supporting local talent and dominating the battlefield.', tags: ['esports', 'free fire', 'bangladesh'], verificationHeader: '', analyticsId: '' },
  ads: { header: '', sidebar: '', footer: '' },
  traffic: { totalViews: 0, uniqueIps: [] },
  content: {
    heroTitleFirst: 'METAL',
    heroTitleLast: 'BLADE',
    heroSubTitle: 'Professional Free Fire team',
    heroBadge: 'Forged in fire, built to conquer',
    heroCtaText: 'ACTIVE WARFARE',
    heroCtaLink: '#tournaments',
    heroSecondaryCtaText: 'BECOME A PARTNER',
    heroSecondaryCtaLink: '#contact',
    footerCopyright: '© 2026 Metal Blade Int. All Rights Reserved.',
    inquiryTitle: 'Sponsorship & Inquiry.',
    inquiryDesc: "Bring your brand to the center of Bangladesh's Free Fire competitive scene. Partner with the elite.",
    inquiryButtons: [
      { label: 'Email Us', link: 'mailto:metalbladeesporg@gmail.com', type: 'Mail', primary: false },
      { label: 'Become Partner', link: '#tournaments', type: 'Zap', primary: true }
    ],
    teamSectionTitle: 'MANAGEMENT TEAM',
    teamSectionDesc: 'The visionary leaders and dedicated specialists driving our competitive excellence and organizational growth.',
  },
  nav: [
    { name: 'Home', link: '#' },
    { name: 'Tournaments', link: '#tournaments' },
    { name: 'Team', link: '#team' },
    { name: 'Social', link: '#social' },
  ],
  team: [
    { name: "MD. FARHAN ISHRAQUE", role: "FOUNDER & OWNER", desc: "Primary Strategist overseeing all operations and guiding the vision of Metal Blade Int.", img: "" },
    { name: "RAJID HASAN", role: "CO-FOUNDER", desc: "Operation Lead directing the tactical day-to-day execution.", img: "" },
    { name: "TANVIR AHMED", role: "PRODUCTION HEAD", desc: "Media Master orchestrating all our visual and technical broadcasts.", img: "" },
    { name: "FOZLE RABBI", role: "MINI TOURNAMENTS HEAD", desc: "Organizing and supervising all mini tournament operations efficiently.", img: "" },
    { name: "MAHBUBUR RAHMAN", role: "SCRIMS SYSTEM MANAGER", desc: "Handling the scrims pipeline and team coordination smoothly.", img: "" },
    { name: "NIRBAN CHAKMA", role: "CHAMPION RUSH MANAGEMENT HEAD", desc: "Managing the champion rush section with dedication and leading others of it.", img: "" },
    { name: "JIHAD HOSSAIN", role: "GFX ARTIST", desc: "The unique personality who magnetizes every banner and visual asset.", img: "" }
  ],
  stats: [
    { label: "TOURNAMENTS COMPLETED", val: "150+", icon: "Trophy" },
    { label: "ORGANIZATIONS CONNECTED", val: "25+", icon: "Network" },
    { label: "ELITE PLAYERS", val: "200+", icon: "Users" },
    { label: "FAN COMMUNITY", val: "50K+", icon: "Flame" }
  ],
  socials: [
    { platform: "FACEBOOK PAGE", link: "#", type: "Facebook" },
    { platform: "FACEBOOK GROUP", link: "#", type: "Users" },
    { platform: "YOUTUBE", link: "#", type: "Youtube" },
    { platform: "TIKTOK", link: "#", type: "Play" },
    { platform: "INSTAGRAM", link: "#", type: "Instagram" },
    { platform: "DISCORD", link: "#", type: "MessageSquare" }
  ],
  sponsors: ["ROOKIE", "ESPORTS.BD", "TECHZONE", "GPAY", "BLADE DESIGN", "DRAGON X"],
};

Object.entries(FILES).forEach(([key, filePath]) => {
  if (!fs.existsSync(filePath)) {
    fs.writeJsonSync(filePath, initialData[key as keyof typeof initialData]);
  }
});

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // Multer config for file uploads
  const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, UPLOADS_DIR);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
  });
  const upload = multer({ storage });

  // Traffic logging middleware
  app.use((req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    
    try {
      const traffic = fs.readJsonSync(FILES.traffic);
      traffic.totalViews += 1;
      const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
      if (!traffic.uniqueIps.includes(ip)) {
        traffic.uniqueIps.push(ip);
      }
      fs.writeJsonSync(FILES.traffic, traffic);
    } catch (e) {
      console.error('Traffic logging error:', e);
    }
    next();
  });

  // Auth API
  app.post('/api/admin/login', (req, res) => {
    const { email, password } = req.body;
    // Simple static credentials for local use
    if (email === 'admin@metalblade.com' && password === 'password123') {
      res.json({ success: true, token: 'fake-jwt-token' });
    } else {
      res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
  });

  // Generic Data APIs
  const dataRoutes = [
    { path: '/api/sections', file: FILES.sections },
    { path: '/api/theme', file: FILES.theme },
    { path: '/api/tournaments', file: FILES.tournaments },
    { path: '/api/seo', file: FILES.seo },
    { path: '/api/ads', file: FILES.ads },
    { path: '/api/analytics', file: FILES.traffic },
    { path: '/api/team', file: FILES.team },
    { path: '/api/socials', file: FILES.socials },
    { path: '/api/stats', file: FILES.stats },
    { path: '/api/sponsors', file: FILES.sponsors },
    { path: '/api/content', file: FILES.content },
    { path: '/api/nav', file: FILES.nav },
  ];

  dataRoutes.forEach(({ path: routePath, file }) => {
    app.get(routePath, (req, res) => {
      try {
        const data = fs.readJsonSync(file);
        res.json(data);
      } catch (err) {
        res.status(500).json({ error: 'Failed to read data' });
      }
    });

    app.post(routePath, (req, res) => {
      try {
        fs.writeJsonSync(file, req.body);
        res.json({ success: true });
      } catch (err) {
        res.status(500).json({ error: 'Failed to save data' });
      }
    });
  });

  // Special Tournament APIs (CRUD)
  app.put('/api/tournaments/:id', (req, res) => {
    try {
      const tournaments = fs.readJsonSync(FILES.tournaments);
      const index = tournaments.findIndex((t: any) => t.id === req.params.id);
      if (index !== -1) {
        tournaments[index] = { ...tournaments[index], ...req.body };
        fs.writeJsonSync(FILES.tournaments, tournaments);
        res.json({ success: true });
      } else {
        res.status(404).json({ error: 'Tournament not found' });
      }
    } catch (err) {
      res.status(500).json({ error: 'Failed to update tournament' });
    }
  });

  app.delete('/api/tournaments/:id', (req, res) => {
    try {
      let tournaments = fs.readJsonSync(FILES.tournaments);
      tournaments = tournaments.filter((t: any) => t.id !== req.params.id);
      fs.writeJsonSync(FILES.tournaments, tournaments);
      res.json({ success: true });
    } catch (err) {
      res.status(500).json({ error: 'Failed to delete tournament' });
    }
  });

  // Sitemap generator
  app.get('/sitemap.xml', (req, res) => {
    try {
      const tournaments = fs.readJsonSync(FILES.tournaments);
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>${req.protocol}://${req.get('host')}/</loc><priority>1.0</priority></url>`;
      
      tournaments.forEach((t: any) => {
        xml += `\n  <url><loc>${req.protocol}://${req.get('host')}/tournament/${t.id}</loc><priority>0.8</priority></url>`;
      });

      xml += `\n</urlset>`;
      res.header('Content-Type', 'application/xml');
      res.send(xml);
    } catch (e) {
      res.status(500).send("Error generating sitemap");
    }
  });

  // File Upload API
  app.post('/api/upload', upload.single('file'), (req, res) => {
    if (req.file) {
      res.json({ success: true, url: `/uploads/${req.file.filename}` });
    } else {
      res.status(400).json({ error: 'No file uploaded' });
    }
  });

  // Serve uploaded assets
  app.use('/uploads', express.static(UPLOADS_DIR));

  // Vite/Prod handler
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
