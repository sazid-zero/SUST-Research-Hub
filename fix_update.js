const fs = require('fs');
const file = 'app/actions/workspace.ts';
let content = fs.readFileSync(file, 'utf8');

// Fix 1: Add journal_name, doi, year to the publication UPDATE query
const oldUpdate = 'department = COALESCE(${department || null}, department),\r\n                    updated_at = NOW()\r\n                WHERE id = ${id}\r\n            `\r\n        }';

const newUpdate = 'department = COALESCE(${department || null}, department),\r\n                    journal_name = COALESCE(${journalName || null}, journal_name),\r\n                    doi = COALESCE(${doi || null}, doi),\r\n                    year = COALESCE(${year || null}, year),\r\n                    updated_at = NOW()\r\n                WHERE id = ${id}\r\n            `\r\n        }';

if (content.includes(oldUpdate)) {
    // Only replace the one inside the publication block (second occurrence)
    // The first occurrence is in the project block
    let idx1 = content.indexOf(oldUpdate);
    let idx2 = content.indexOf(oldUpdate, idx1 + 1);
    if (idx2 !== -1) {
        content = content.substring(0, idx2) + newUpdate + content.substring(idx2 + oldUpdate.length);
        console.log('Fix 1 applied at position', idx2);
    } else {
        // Only one occurrence, replace it
        content = content.replace(oldUpdate, newUpdate);
        console.log('Fix 1 applied (single occurrence)');
    }
} else {
    console.log('Fix 1 skipped: already applied or pattern mismatch');
}

// Fix 2: publishWorkspace - add publication to permission check
const oldPerm = "isSupervisor = !!member\r\n            }\r\n            if (!isSupervisor) {\r\n                return { success: false, message: \"You are not the supervisor of this work\" }\r\n            }";

const newPerm = "isSupervisor = !!member\r\n            } else if (workspaceType === 'publication') {\r\n                const [author] = await sql`SELECT user_id FROM publication_authors WHERE publication_id = ${workspaceId} AND user_id = ${user.id}`\r\n                isSupervisor = !!author\r\n            }\r\n            if (!isSupervisor) {\r\n                return { success: false, message: \"You are not the supervisor of this work\" }\r\n            }";

if (content.includes(oldPerm)) {
    content = content.replace(oldPerm, newPerm);
    console.log('Fix 2 applied: publishWorkspace permission check');
} else {
    console.log('Fix 2 skipped');
}

// Fix 3: publishWorkspace - add publication status update  
const oldStatus = "await sql`UPDATE projects SET status = 'published', updated_at = NOW() WHERE id = ${workspaceId}`\r\n        }\r\n\r\n        // Get workspace title";

const newStatus = "await sql`UPDATE projects SET status = 'published', updated_at = NOW() WHERE id = ${workspaceId}`\r\n        } else if (workspaceType === 'publication') {\r\n            await sql`UPDATE publications SET status = 'published', updated_at = NOW() WHERE id = ${workspaceId}`\r\n        }\r\n\r\n        // Get workspace title";

if (content.includes(oldStatus)) {
    content = content.replace(oldStatus, newStatus);
    console.log('Fix 3 applied: publishWorkspace status update');
} else {
    console.log('Fix 3 skipped');
}

// Fix 4: publishWorkspace - add publication members query
const oldMembers = "members = await sql`SELECT user_id FROM project_members WHERE project_id = ${workspaceId}`\r\n        }\r\n\r\n        // Notify all team members";

const newMembers = "members = await sql`SELECT user_id FROM project_members WHERE project_id = ${workspaceId}`\r\n        } else if (workspaceType === 'publication') {\r\n            members = await sql`SELECT user_id FROM publication_authors WHERE publication_id = ${workspaceId} AND user_id IS NOT NULL`\r\n        }\r\n\r\n        // Notify all team members";

if (content.includes(oldMembers)) {
    content = content.replace(oldMembers, newMembers);
    console.log('Fix 4 applied: publishWorkspace members');
} else {
    console.log('Fix 4 skipped');
}

fs.writeFileSync(file, content);
console.log('Done.');
