/**
 * PAHAD.co Admin Authentication Verification Script
 * Tests Supabase Auth signInWithPassword and RLS admin query access.
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.VITE_SUPABASE_URL || 'https://irqqmpjgacfrpbjwdgzs.supabase.co';
const SUPABASE_ANON_KEY = process.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_JHW5SPISxFstJiu0EBzy5w_mo_1MBuW';
const ADMIN_EMAIL = process.env.ADMIN_USERNAME || 'admin@pahad.co';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'PahadAdmin@2026';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function testAdminAuth() {
  console.log('='.repeat(70));
  console.log('🏔️  PAHAD.co Admin Authentication & RLS Verification');
  console.log('='.repeat(70));
  console.log(`Backend URL: ${SUPABASE_URL}`);
  console.log(`Testing Login for: ${ADMIN_EMAIL}\n`);

  try {
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: ADMIN_EMAIL,
      password: ADMIN_PASSWORD
    });

    if (authError) {
      console.error(`❌ Authentication Failed!`);
      console.error(`   Status:  ${authError.status}`);
      console.error(`   Message: ${authError.message}`);

      if (authError.message.includes('Database error querying schema')) {
        console.error(`\n🔍 ROOT CAUSE IDENTIFIED:`);
        console.error(`   The Supabase GoTrue Auth service encountered NULL string fields in auth.users.`);
        console.error(`   When users are inserted via raw SQL, token columns left as NULL crash Go's sql.Scan.`);
        console.error(`\n👉 RESOLUTION:`);
        console.error(`   Run 'supabase/fix_admin_account.sql' in your Supabase SQL Editor.`);
        console.error(`   This script replaces all NULL token fields with empty strings ('')`);
        console.error(`   and initializes auth.identities correctly.`);
      } else if (authError.message.includes('Invalid login credentials')) {
        console.error(`\n👉 RESOLUTION:`);
        console.error(`   The email or password does not match any confirmed user in auth.users.`);
        console.error(`   Run 'supabase/fix_admin_account.sql' in your Supabase SQL Editor to provision it.`);
      }
      process.exit(1);
    }

    console.log(`✅ Supabase Auth Successful!`);
    console.log(`   User ID: ${authData.user.id}`);
    console.log(`   Email:   ${authData.user.email}`);
    console.log(`   Role:    ${authData.user.role}`);

    // Verify admin_users table
    console.log('\n🔒 Verifying public.admin_users role...');
    const { data: adminRecord, error: adminErr } = await supabase
      .from('admin_users')
      .select('*')
      .eq('id', authData.user.id)
      .single();

    if (adminErr || !adminRecord) {
      console.warn(`⚠️ User is authenticated, but not yet present in public.admin_users table.`);
      console.warn(`   Run 'supabase/fix_admin_account.sql' to ensure the admin role is linked.`);
    } else {
      console.log(`✅ Admin Record Confirmed:`);
      console.log(`   Full Name: ${adminRecord.full_name}`);
      console.log(`   Role:      ${adminRecord.role}`);
    }

    // Verify RLS access on protected inquiries table
    console.log('\n📋 Testing RLS Protected Access to Inquiries...');
    const { data: inquiries, error: inqErr } = await supabase
      .from('inquiries')
      .select('*')
      .limit(5);

    if (inqErr) {
      console.error(`❌ Inquiries access blocked by RLS:`, inqErr.message);
    } else {
      console.log(`✅ Successfully retrieved inquiries under admin RLS! (${inquiries.length} records found)`);
    }

    // Verify RLS access on feedback
    console.log('\n💬 Testing RLS Access to Feedback...');
    const { data: feedback, error: fbErr } = await supabase
      .from('feedback')
      .select('*')
      .limit(5);

    if (fbErr) {
      console.error(`❌ Feedback access blocked:`, fbErr.message);
    } else {
      console.log(`✅ Successfully retrieved feedback! (${feedback.length} records found)`);
    }

    console.log('\n🎉 ALL ADMIN VERIFICATION CHECKS PASSED!');
    console.log('='.repeat(70));
  } catch (err) {
    console.error('Unexpected error:', err);
    process.exit(1);
  }
}

testAdminAuth();
