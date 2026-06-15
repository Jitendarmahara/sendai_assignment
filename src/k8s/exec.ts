// Use kubectl subprocess instead of the WebSocket exec API.
// Bun's native WebSocket shims the ws package and doesn't support rejectUnauthorized,
// causing TLS failures against kind's self-signed cert. kubectl reads in-cluster
// credentials automatically from the mounted ServiceAccount token.
export async function execInPod(
  pod: string,
  command: string[]
): Promise<string> {
  const proc = Bun.spawn(
    ["kubectl", "exec", "-n", "pi-agent", pod, "-c", "sandbox", "--", ...command],
    { stdout: "pipe", stderr: "pipe" }
  );

  const [stdout, stderr, exitCode] = await Promise.all([
    new Response(proc.stdout).text(),
    new Response(proc.stderr).text(),
    proc.exited,
  ]);

  if (exitCode !== 0) {
    throw new Error(stderr.trim() || `exec exited with code ${exitCode}`);
  }

  return stdout.trim();
}
