const { neon } = require('@neondatabase/serverless');
const sql = neon(process.env.DATABASE_URL);

async function testNotifications() {
  try {
    console.log('Testing notifications table...');
    
    const result = await sql`
      SELECT COUNT(*) as total FROM notifications
    `;
    console.log('✓ Total notifications in DB:', result[0].total);
    
    const recentResult = await sql`
      SELECT COUNT(*) as recent FROM notifications 
      WHERE created_at > NOW() - INTERVAL '30 minutes'
    `;
    console.log('✓ Notifications in last 30 mins:', recentResult[0].recent);
    
    // Show last 5 notifications
    const lastNotifs = await sql`
      SELECT id, user_id, type, title, created_at FROM notifications 
      ORDER BY created_at DESC LIMIT 5
    `;
    console.log('✓ Last 5 notifications:', lastNotifs);
    
  } catch (error) {
    console.error('✗ Error:', error.message);
    if (error.hint) console.error('  Hint:', error.hint);
  }
  process.exit(0);
}

testNotifications();
