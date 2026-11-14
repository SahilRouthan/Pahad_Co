import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://irqqmpjgacfrpbjwdgzs.supabase.co';
const supabaseKey = 'sb_publishable_JHW5SPISxFstJiu0EBzy5w_mo_1MBuW';
const supabase = createClient(supabaseUrl, supabaseKey);

console.log('================================================================');
console.log(' PAHAD.co Production Full-Stack Verification & Integrity Test');
console.log('================================================================\n');

async function testAll() {
  let passed = 0;
  let failed = 0;

  // Test 1: Fetch Approved Reviews from Supabase
  console.log('[1/5] Testing Reviews retrieval (Supabase select)...');
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('approval_status', 'approved')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Reviews fetch failed:', error.message);
      failed++;
    } else {
      console.log(`✅ Reviews fetched successfully! Count: ${data.length}`);
      data.forEach((r, i) => console.log(`   ${i + 1}. [${r.rating}★] ${r.customer_name}: "${r.review_text.slice(0, 45)}..."`));
      passed++;
    }
  } catch (err) {
    console.error('❌ Reviews error:', err.message);
    failed++;
  }

  // Test 2: Fetch Gallery from Supabase
  console.log('\n[2/5] Testing Gallery retrieval (Supabase select)...');
  try {
    const { data, error } = await supabase
      .from('gallery')
      .select('*')
      .order('display_order', { ascending: true });

    if (error) {
      console.error('❌ Gallery fetch failed:', error.message);
      failed++;
    } else {
      console.log(`✅ Gallery fetched successfully! Count: ${data.length}`);
      data.slice(0, 3).forEach((g, i) => console.log(`   ${i + 1}. "${g.title}" (${g.category}) - ${g.image_url.slice(0, 40)}...`));
      passed++;
    }
  } catch (err) {
    console.error('❌ Gallery error:', err.message);
    failed++;
  }

  // Test 3: Submit Customer Feedback to Supabase
  console.log('\n[3/5] Testing Feedback submission (Supabase insert)...');
  try {
    const testFeedback = {
      customer_name: 'Production Health Check',
      email: 'verify@pahad.co',
      feedback_type: 'Service Quality',
      rating: 5,
      message: 'Automated verification testing real feedback insertion into Supabase PostgreSQL.',
      status: 'new'
    };

    const { error } = await supabase.from('feedback').insert([testFeedback]);
    if (error) {
      console.error('❌ Feedback submission failed:', error.message);
      failed++;
    } else {
      console.log('✅ Feedback successfully stored in Supabase "feedback" table!');
      passed++;
    }
  } catch (err) {
    console.error('❌ Feedback error:', err.message);
    failed++;
  }

  // Test 4: Submit Review for Moderation
  console.log('\n[4/5] Testing Customer Review submission (Supabase insert)...');
  try {
    const testReview = {
      customer_name: 'Kavita Rawat',
      rating: 5,
      review_text: 'Flawless execution by the PAHAD.co team for our Mussoorie celebration!',
      event_type: 'Destination Wedding',
      event_location: 'Mussoorie Hills',
      approval_status: 'pending'
    };

    const { error } = await supabase.from('reviews').insert([testReview]);
    if (error) {
      console.error('❌ Review submission failed:', error.message);
      failed++;
    } else {
      console.log('✅ Review successfully stored in Supabase with forced "pending" status.');
      passed++;
    }
  } catch (err) {
    console.error('❌ Review submission error:', err.message);
    failed++;
  }

  // Test 5: Submit Client Inquiry
  console.log('\n[5/5] Testing Inquiry submission (Supabase insert)...');
  try {
    const testInquiry = {
      customer_name: 'Aayush Negi',
      email: 'aayush.negi@example.com',
      phone: '+91 98765 12345',
      event_type: 'Destination Weddings',
      event_date: '2026-12-25',
      event_location: 'Dehradun Valley',
      budget: '₹15L - ₹20L',
      message: 'Looking for complete wedding planning & coordination for 200 guests.',
      status: 'new'
    };

    const { error } = await supabase.from('inquiries').insert([testInquiry]);
    if (error) {
      console.error('❌ Inquiry submission failed:', error.message);
      failed++;
    } else {
      console.log('✅ Inquiry successfully stored in Supabase "inquiries" table!');
      passed++;
    }
  } catch (err) {
    console.error('❌ Inquiry submission error:', err.message);
    failed++;
  }

  console.log('\n================================================================');
  console.log(` Test Summary: ${passed} Passed, ${failed} Failed`);
  console.log('================================================================\n');

  if (failed > 0) process.exit(1);
}

testAll();
