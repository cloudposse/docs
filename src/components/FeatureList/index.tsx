import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/solid";

interface FeatureListProps {
  children: React.ReactNode;
}

const FeatureList: React.FC<FeatureListProps> = ({ children }) => {
  let listItems: React.ReactNode[] = [];

  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child) && child.props?.children) {
      listItems = React.Children.toArray(child.props.children);
    }
  });

  return (
    <ul className="space-y-2 !pl-0">
      {listItems.map((child, index) =>
        React.isValidElement(child) ? (
          <li key={index} className="flex items-start gap-3">
            {/* Check Icon */}
            <CheckCircleIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-[2px]" />

            {/* Text Container for Proper Alignment */}
            <div className="text-lg leading-[1.4]">{child.props.children}</div>
          </li>
        ) : null
      )}
    </ul>
  );
};

export default FeatureList;
