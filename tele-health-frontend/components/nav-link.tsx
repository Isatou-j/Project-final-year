import { Url } from 'next/dist/shared/lib/router/router';
import Link from 'next/link';
import React from 'react';

type NavLinkProps = {
  href: Url;
  children: React.ReactNode;
  className?: string;
};

const NavLink = ({ href, children, className }: NavLinkProps) => (
  <Link href={href} className={className}>
    {children}
  </Link>
);

export default NavLink;
