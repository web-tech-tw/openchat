export interface UseCatParams {
  status?: number;
  message?: string;
}

/**
 * Generate a cat ASCII art message as a Response or string.
 * @param [params] - Options for the cat output.
 * @param [params.status] - HTTP status to use when
 * returning a Response.
 * @param [params.message] - A message to prefix the ASCII
 * art.
 * @returns A Response object (default) or a string,
 * depending on the type parameter T.
 */
export function useCat<T extends Response | string = Response>({
  status = 200,
  message = '',
}: UseCatParams = {}): T {
  const body = (message ? `> ${message}\n---\n` : '') +
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣤⡶⢶⣦⡀\n' +
    '⠀⠀⠀⣴⡿⠟⠷⠆⣠⠋⠀⠀⠀⢸⣿\n' +
    '⠀⠀⠀⣿⡄⠀⠀⠀⠈⠀⠀⠀⠀⣾⡿\n' +
    '⠀⠀⠀⠹⣿⣦⡀⠀⠀⠀⠀⢀⣾⣿\n' +
    '⠀⠀⠀⠀⠈⠻⣿⣷⣦⣀⣠⣾⡿\n' +
    '⠀⠀⠀⠀⠀⠀⠀⠉⠻⢿⡿⠟\n' +
    '⠀⠀⠀⠀⠀⠀⠀⠀⠀⡟⠀⠀⠀⢠⠏⡆⠀⠀⠀⠀⠀⢀⣀⣤⣤⣤⣀⡀\n' +
    '⠀⠀⠀⠀⠀⡟⢦⡀⠇⠀⠀⣀⠞⠀⠀⠘⡀⢀⡠⠚⣉⠤⠂⠀⠀⠀⠈⠙⢦⡀\n' +
    '⠀⠀⠀⠀⠀⡇⠀⠉⠒⠊⠁⠀⠀⠀⠀⠀⠘⢧⠔⣉⠤⠒⠒⠉⠉⠀⠀⠀⠀⠹⣆\n' +
    '⠀⠀⠀⠀⠀⢰⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢻⠀⠀⣤⠶⠶⢶⡄⠀⠀⠀⠀⢹⡆\n' +
    '⠀⣀⠤⠒⠒⢺⠒⠀⠀⠀⠀⠀⠀⠀⠀⠤⠊⠀⢸⠀⡿⠀⡀⠀⣀⡟⠀⠀⠀⠀⢸⡇\n' +
    '⠈⠀⠀⣠⠴⠚⢯⡀⠐⠒⠚⠉⠀⢶⠂⠀⣀⠜⠀⢿⡀⠉⠚⠉⠀⠀⠀⠀⣠⠟\n' +
    '⠀⠠⠊⠀⠀⠀⠀⠙⠂⣴⠒⠒⣲⢔⠉⠉⣹⣞⣉⣈⠿⢦⣀⣀⣀⣠⡴⠟\n\n' +
    '> Believe me I can fly, I\'m singing in the sky.';

  if (typeof (undefined as unknown as T) === 'string') {
    return body as T;
  }

  return new Response(body, {
    status, headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  }) as T;
}
