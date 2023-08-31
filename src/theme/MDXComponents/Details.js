import React from 'react';
import Details from '@theme/Details';
import {useLocation} from '@docusaurus/router';

export default function MDXDetails(props) {
  const items = React.Children.toArray(props.children);
  // Split summary item from the rest to pass it as a separate prop to the
  // Details theme component
  const summary = items.find(
    (item) => React.isValidElement(item) && item.props?.mdxType === 'summary',
  );
  const children = <>{items.filter((item) => item !== summary)}</>;

  // ugly hack starts
  // MDXComponents has been swizzled like this
  // npm run swizzle @docusaurus/theme-classic MDXComponents -- --eject
  // 
  // we want ot open <details> tag for changelog pages but not for list changelogs page
  const location = useLocation();
  const endpointPattern = /components\/changelog\/\d+\.\d+\.\d+\/?$/;
  const open=endpointPattern.test(location.pathname);
  // ugly hack ends

  return open ? (
    <Details {...props} summary={summary} open>
      {children}
    </Details>
  ) : (
    <Details {...props} summary={summary}>
      {children}
    </Details>
  );
}
