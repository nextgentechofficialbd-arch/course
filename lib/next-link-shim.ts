
import React from 'react';

interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href: string;
}

const Link: React.FC<LinkProps> = ({ href, children, ...props }) => {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith('http') || href.startsWith('//')) return;
    if (e.metaKey || e.ctrlKey) return;
    
    e.preventDefault();
    window.history.pushState({}, '', href);
    window.dispatchEvent(new Event('popstate'));
  };

  // Fix: Use React.createElement instead of JSX tags to avoid compiler errors in a standard .ts file
  return React.createElement(
    'a',
    {
      ...props,
      href,
      onClick: handleClick
    },
    children
  );
};

export default Link;
