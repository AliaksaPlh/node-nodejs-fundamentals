export function createStreamReader(readable) {
  let buffer = Buffer.alloc(0);
  let ended = false;
  let pendingResolve = null;
  let pendingReject = null;

  readable.on("data", (chunk) => {
    buffer = Buffer.concat([buffer, chunk]);
    if (pendingResolve) {
      const resolve = pendingResolve;
      pendingResolve = null;
      resolve();
    }
  });

  readable.on("end", () => {
    ended = true;
    if (pendingResolve) {
      const resolve = pendingResolve;
      pendingResolve = null;
      resolve();
    }
  });

  readable.on("error", (err) => {
    if (pendingReject) {
      const reject = pendingReject;
      pendingReject = null;
      reject(err);
    }
  });

  const ensureBytes = async (n) => {
    while (buffer.length < n && !ended) {
      await new Promise((resolve, reject) => {
        pendingResolve = resolve;
        pendingReject = reject;
      });
    }
    return buffer.length >= n;
  };

  const readExact = async (n) => {
    const ok = await ensureBytes(n);
    if (!ok) {
      return null;
    }
    const out = buffer.slice(0, n);
    buffer = buffer.slice(n);
    return out;
  };

  return { readExact };
}
