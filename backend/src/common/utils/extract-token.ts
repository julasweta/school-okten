export function extractTokenFromHeader(request: string): string | undefined {
  const [type, token] = request.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}
