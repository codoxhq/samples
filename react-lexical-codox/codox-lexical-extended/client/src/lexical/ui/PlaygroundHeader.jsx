import React from 'react';
import logo from '../images/logo.svg';

export const PlaygroundHeader = () => {
  return (
    <header>
      <a href="https://lexical.dev" target="_blank" rel="noreferrer">
        <img src={logo} alt="Lexical Logo" />
      </a>
    </header>
  );
};
