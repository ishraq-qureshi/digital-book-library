"use client";

import Error from "next/error";

// Renders only when `[locale]` itself doesn't match a supported locale
// (app/[locale]/layout.tsx calls notFound() before it can provide <html>).
// Every other 404 is handled by app/[locale]/not-found.tsx instead.
export default function GlobalNotFound() {
  return (
    <html lang="en">
      <body>
        <Error statusCode={404} />
      </body>
    </html>
  );
}
