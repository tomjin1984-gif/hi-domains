import { execFileSync, spawn } from "node:child_process";
import { createRequire } from "node:module";

const env = { ...process.env };
// Node does not automatically inherit macOS's system proxy as browsers do.
// Only read existing settings; never modify the system or disable TLS checks.
if (process.platform === "darwin" && !env.HTTPS_PROXY && !env.https_proxy) {
  try {
    const settings = execFileSync("scutil", ["--proxy"], { encoding: "utf8", timeout: 2000 });
    const read = (name) => settings.match(new RegExp(`^\\s*${name}\\s*:\\s*(\\S+)\\s*$`, "m"))?.[1];
    const host = read("HTTPSProxy");
    const port = Number(read("HTTPSPort"));
    if (read("HTTPSEnable") === "1" && host && /^[a-zA-Z0-9.-]+$/.test(host) && Number.isInteger(port) && port > 0 && port < 65536) {
      env.HTTPS_PROXY = `http://${host}:${port}`;
    }
  } catch { /* No readable system proxy; retain the normal network configuration. */ }
}
const usesProxy = Boolean(env.HTTPS_PROXY || env.https_proxy || env.HTTP_PROXY || env.http_proxy);
const supportsProxy = process.allowedNodeEnvironmentFlags.has("--use-env-proxy");
if (usesProxy && supportsProxy && env.NODE_USE_ENV_PROXY !== "0") {
  env.NODE_USE_ENV_PROXY = "1";
  env.NO_PROXY ??= env.no_proxy ?? "localhost,127.0.0.1,::1";
  console.log("Using the configured proxy for upstream connections.");
}
const command = process.argv[2];
if (!["dev", "start"].includes(command)) throw new Error("Expected dev or start");
const next = createRequire(import.meta.url).resolve("next/dist/bin/next");
const child = spawn(process.execPath, [next, command, ...process.argv.slice(3)], { env, stdio: "inherit" });
for (const signal of ["SIGINT", "SIGTERM"]) process.on(signal, () => child.kill(signal));
child.on("exit", (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exit(code ?? 1);
});
