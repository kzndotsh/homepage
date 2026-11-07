/**
 * The JSON body of a response, typed as T. The shape is trusted, not checked:
 * the callers read every field defensively and treat a failure as missing data.
 */
export async function readJson<T>(res: Response): Promise<T> {
  // oxlint-disable-next-line typescript/no-unsafe-type-assertion -- a parsed body has no type until the caller says what it expects
  return (await res.json()) as T
}
