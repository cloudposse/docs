import React from "react";

const DT = ({ children }) => {
  const id = children.toLowerCase().replace(/\s/g, "-");
  return (
      <dt id={id}>{children}
          <a className="hash-link" href={`#${id}`}></a>
      </dt>
  );
};

export default DT;
