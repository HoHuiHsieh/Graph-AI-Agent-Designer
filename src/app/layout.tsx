/**
 * @fileoverview Main layout component for the application.
 * Provides a consistent structure for all pages.
 * 
 * @author Hsieh,HoHui <billhsies@gmail.com>
 */
import React from 'react';
import '../styles/globals.css';

/**
 * MainLayout component wraps the application content with a standard HTML structure.
 * @param param0 
 * @returns 
 */
export default function MainLayout(props: { children: React.ReactNode }): React.ReactNode {
  const { children } = props;
  return (
    <html lang="zh-TW">
      <body>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}