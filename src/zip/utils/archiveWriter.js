export function createArchiveWriter(compressionStream, archiveStream) {
  let writeReject = null;

  compressionStream.on("error", (err) => {
    if (writeReject) {
      writeReject(err);
      writeReject = null;
    }
  });

  archiveStream.on("error", (err) => {
    if (writeReject) {
      writeReject(err);
      writeReject = null;
    }
  });

  const write = (chunk) =>
    new Promise((resolve, reject) => {
      writeReject = reject;
      const canWrite = compressionStream.write(chunk);
      if (canWrite) {
        writeReject = null;
        resolve();
      } else {
        compressionStream.once("drain", () => {
          writeReject = null;
          resolve();
        });
      }
    });

  const writeHeader = async (header) => {
    const headerBuf = Buffer.from(JSON.stringify(header), "utf-8");
    const lenBuf = Buffer.alloc(4);
    lenBuf.writeUInt32BE(headerBuf.length, 0);

    await write(lenBuf);
    await write(headerBuf);
  };

  return { write, writeHeader };
}
