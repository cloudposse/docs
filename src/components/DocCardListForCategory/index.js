import React from 'react';
import { useDocById } from '@docusaurus/theme-common/internal';
import DocCardList from '@theme/DocCardList';

function DocCardListForCategory({className, id}) {
    const doc = useDocById(id);

    if (!doc) {
      return <div>Category not found</div>;
    }

    const categoryItems = doc.items || [];

    return <DocCardList items={categoryItems} className={className} />;
}

export default DocCardListForCategory;
