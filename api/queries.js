import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://irqqmpjgacfrpbjwdgzs.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JHW5SPISxFstJiu0EBzy5w_mo_1MBuW';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'POST') {
      const { name, email, phone, eventType, preferredDate, eventLocation, estimatedBudget, message } = req.body || {};
      const { error } = await supabase.from('inquiries').insert([
        {
          customer_name: (name || '').trim(),
          email: (email || '').trim().toLowerCase(),
          phone: (phone || '').trim(),
          event_type: eventType || 'Destination Weddings',
          event_date: preferredDate || '',
          event_location: (eventLocation || '').trim(),
          budget: estimatedBudget || '',
          message: (message || '').trim(),
          status: 'new'
        }
      ]);

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({
        success: true,
        message: 'Inquiry submitted successfully.'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
