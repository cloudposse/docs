import React from 'react';
import { useDocsSidebar } from '@docusaurus/theme-common/internal';
import { useDocById } from '@docusaurus/theme-common/internal';

const CategoryList = ({ path }) => {
  const sidebar = useDocsSidebar();

  const findItemsByPath = (items, targetPath) => {
    for (const item of items) {
      if (item.href === targetPath) {
        return item.items || [];
      }
      if (item.items) {
        const foundItems = findItemsByPath(item.items, targetPath);
        if (foundItems.length > 0) {
          return foundItems;
        }
      }
    }
    return [];
  };

  const items = findItemsByPath(sidebar.items, path);

  return (
    <ul>
      {items.map(item => (
        <li key={item.label || item.href}>
          {item.href ? (
            <a href={item.href}>{useDocById(item.docId).title}</a>
          ) : (
            useDocById(item.docId).title
          )}
        </li>
      ))}
    </ul>
  );
};

export default CategoryList;
