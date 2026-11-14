import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://irqqmpjgacfrpbjwdgzs.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JHW5SPISxFstJiu0EBzy5w_mo_1MBuW';
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('reviews')
        .select('*')
        .eq('approval_status', 'approved')
        .order('created_at', { ascending: false });

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({
        success: true,
        count: data?.length || 0,
        data: (data || []).map((r) => ({
          ...r,
          name: r.customer_name,
          status: r.approval_status
        }))
      });
    }

    if (req.method === 'POST') {
      const { name, rating, reviewText, eventType, eventLocation } = req.body || {};
      const { error } = await supabase.from('reviews').insert([
        {
          customer_name: (name || '').trim(),
          rating: Number(rating) || 5,
          review_text: (reviewText || '').trim(),
          event_type: eventType || 'Event Celebration',
          event_location: eventLocation || 'Uttarakhand',
          approval_status: 'pending'
        }
      ]);

      if (error) {
        return res.status(500).json({ success: false, error: error.message });
      }

      return res.status(200).json({
        success: true,
        message: 'Review submitted for moderation.'
      });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
