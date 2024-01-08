export function extractTokenFromHeader(request: string): string | undefined {
  const [type, token] = request.split(' ') ?? [];
  console.log(type);
  return type === 'Bearer' ? token : undefined;
}
