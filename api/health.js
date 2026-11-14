export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json({
    status: 'ok',
    service: 'PAHAD.co Vercel Serverless Backend',
    database: 'Supabase PostgreSQL (irqqmpjgacfrpbjwdgzs)',
    timestamp: new Date().toISOString()
  });
}
