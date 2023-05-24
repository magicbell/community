import React, { ReactNode } from 'react';

export default function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-md border border-borderMuted my-4">
      <table>{children}</table>
    </div>
  );
}
