const path = require('path');
const fs = require('fs');
const matter = require('gray-matter');

function getAnnouncements() {
  const announcementsDir = path.join(__dirname, '../../docs/announcements');
  const files = fs.readdirSync(announcementsDir);

  return files
    .filter(file => file.endsWith('.mdx') && file !== 'announcements.mdx')
    .map(file => {
      const content = fs.readFileSync(path.join(announcementsDir, file), 'utf8');
      const { data, content: markdown } = matter(content);
      const id = file.replace('.mdx', '');

      // Extract intro from the markdown content
      // Look for content between <Intro> and </Intro> after the import statement
      const introMatch = markdown.match(/import Intro from '@site\/src\/components\/Intro';\s*<Intro>([\s\S]*?)<\/Intro>/);
      const intro = introMatch ? introMatch[1].trim() : '';

      return {
        id,
        title: data.title,
        date: data.date,
        intro,
        permalink: `/announcements/${id}`,
      };
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));
}

module.exports = function announcementsPlugin(context, options) {
  return {
    name: 'docusaurus-announcements-plugin',
    async contentLoaded({ actions, content }) {
      const announcements = getAnnouncements();
      context.siteConfig.customFields.announcements = announcements;
    },
  };
}; 