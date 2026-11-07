/** Structured data for search engines. `<` is escaped so the JSON cannot close the script tag. */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replaceAll('<', String.raw`<`),
      }}
    />
  )
}
