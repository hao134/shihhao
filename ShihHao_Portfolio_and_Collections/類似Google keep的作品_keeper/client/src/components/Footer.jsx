import React from "react";

const ThisYear = new Date().getFullYear();

function Footer() {
  return (
    <footer>
      <p>copyright @{ThisYear}</p>
    </footer>
  );
}

export default Footer;
