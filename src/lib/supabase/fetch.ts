// Keep transient upstream failures bounded. Only retry reads, never mutations.
export async function supabaseFetch(input: RequestInfo | URL, init?: RequestInit) {
  const method = (init?.method ?? (input instanceof Request ? input.method : "GET")).toUpperCase();
  const attempts = method === "GET" ? 2 : 1;
  for (let attempt = 0; attempt < attempts; attempt++) {
    const signal = AbortSignal.timeout(12_000);
    try {
      const response = await fetch(input, {
        ...init,
        signal: init?.signal ? AbortSignal.any([init.signal, signal]) : signal,
      });
      if (response.status >= 500 && attempt + 1 < attempts) {
        await response.body?.cancel();
        continue;
      }
      return response;
    } catch (error) {
      if (init?.signal?.aborted || attempt + 1 === attempts) throw error;
    }
  }
  throw new Error("Supabase connection unavailable");
}
