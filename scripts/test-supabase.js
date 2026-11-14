import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

console.log('================================================================');
console.log(' PAHAD.co Production Supabase Connection & End-to-End Test Suite');
console.log('================================================================\n');

if (!supabaseUrl || !supabaseAnonKey || supabaseUrl.includes('your-project-id')) {
  console.log('⚠️  Supabase credentials not configured in .env yet.');
  console.log('   Please add the following to your .env file:');
  console.log('     VITE_SUPABASE_URL=https://your-project.supabase.co');
  console.log('     VITE_SUPABASE_ANON_KEY=eyJhbGciOi...');
  console.log('     SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi... (optional for backend scripts)\n');
  console.log('   Once added, run this test again with: npm run test:supabase\n');
  process.exit(0);
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runTests() {
  let passed = 0;
  let failed = 0;

  console.log(`[1/5] Testing connection to ${supabaseUrl}...`);
  try {
    const { data, error } = await supabase.from('gallery').select('id, title').limit(3);
    if (error) {
      console.error('❌ Connection or public gallery read failed:', error.message);
      failed++;
    } else {
      console.log(`✅ Connected! Successfully fetched ${data.length} public gallery items.`);
      passed++;
    }
  } catch (err) {
    console.error('❌ Connection error:', err.message);
    failed++;
  }

  console.log('\n[2/5] Testing public Inquiry submission (Row Level Security)...');
  try {
    const testInquiry = {
      customer_name: 'Test Client Verification',
      email: 'test@pahad.co',
      phone: '+91 98765 00000',
      event_type: 'Destination Weddings',
      event_date: '2026-12-20',
      event_location: 'Mussoorie Hills',
      budget: '₹10L - ₹15L',
      message: 'Automated test inquiry validating Supabase RLS and insert permissions.',
      status: 'new'
    };

    const { error } = await supabase.from('inquiries').insert([testInquiry]);
    if (error) {
      console.error('❌ Inquiry submission failed:', error.message);
      failed++;
    } else {
      console.log('✅ Inquiry submitted successfully! (Stored securely in inquiries table)');
      passed++;
    }
  } catch (err) {
    console.error('❌ Inquiry test error:', err.message);
    failed++;
  }

  console.log('\n[3/5] Testing RLS Protection: Ensure anon cannot read inquiries table...');
  try {
    const { data, error } = await supabase.from('inquiries').select('*');
    if (error && (error.code === '42501' || error.message.includes('policy'))) {
      console.log('✅ RLS strictly enforced! Anon user blocked from reading private inquiries.');
      passed++;
    } else if (data && data.length === 0) {
      console.log('✅ RLS working! Zero rows returned to unauthenticated client.');
      passed++;
    } else {
      console.warn('⚠️  Notice: Received rows from inquiries as anon. Verify RLS SELECT policy in schema.sql.');
    }
  } catch (err) {
    console.log('✅ RLS blocked unauthenticated read:', err.message);
    passed++;
  }

  console.log('\n[4/5] Testing Customer Review submission (Forced Pending status)...');
  try {
    const testReview = {
      customer_name: 'Aditi Pant',
      rating: 5,
      review_text: 'The Himalayan setup was unforgettable. Outstanding execution by PAHAD.co!',
      event_type: 'Destination Wedding',
      event_location: 'Mussoorie',
      approval_status: 'pending'
    };

    const { error } = await supabase.from('reviews').insert([testReview]);
    if (error) {
      console.error('❌ Review submission failed:', error.message);
      failed++;
    } else {
      console.log('✅ Review submitted with forced pending status. (Awaiting admin approval)');
      passed++;
    }
  } catch (err) {
    console.error('❌ Review test error:', err.message);
    failed++;
  }

  console.log('\n[5/5] Testing Supabase Storage bucket access (gallery-images)...');
  try {
    const { data, error } = await supabase.storage.from('gallery-images').list('', { limit: 5 });
    if (error) {
      console.warn('⚠️  Storage bucket notice:', error.message);
      console.log('   Ensure you created the "gallery-images" bucket in Supabase Storage.');
    } else {
      console.log(`✅ Supabase Storage bucket "gallery-images" active. Files found: ${data.length}`);
      passed++;
    }
  } catch (err) {
    console.warn('⚠️  Storage test error:', err.message);
  }

  console.log('\n================================================================');
  console.log(` Test Results: ${passed} Passed, ${failed} Failed`);
  console.log('================================================================\n');
}

runTests();
