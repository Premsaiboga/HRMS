import React from 'react';

const Footer = () => (
  <footer className="bg-light text-center text-muted py-3 mt-5">
    <div className="container">
      <small>
        &copy; {new Date().getFullYear()} HRMS System. All rights reserved.
      </small>
    </div>
  </footer>
);

export default Footer;
