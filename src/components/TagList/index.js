import React from 'react';
import useGlobalData from '@docusaurus/useGlobalData';

const findItemsByTags = (items, tags) => {
  // Filter documents that have all the specified tags
  const filteredItems = items.filter(doc =>
    tags.every(tag => doc.tags.some(docTag => docTag.label === tag))
  );
  return filteredItems;
}

const findItemsFromGlobalMetadataByTags = (tags) => {
  const globalData = useGlobalData();
  let globalMetadata = globalData.metadata.default.aggregateMetadata;
  console.log(globalMetadata);
  return findItemsByTags(globalMetadata, tags);
}

const TagList = ({ tags }) => {
  const items = findItemsFromGlobalMetadataByTags(tags);
  console.log(items);
  return (
    <ul>
      {items.map(item => (
        <li key={item.label || item.href}>
          {item.permalink ? (
            <a href={item.permalink}>{item.title}</a>
          ) : (
            item.title
          )}
        </li>
      ))}
    </ul>
  );
};

export default TagList;
