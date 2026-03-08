import fs from "fs";

export async function writeFileToArchive(filePath, writer) {
  return new Promise((resolve, reject) => {
    const fileStream = fs.createReadStream(filePath);

    fileStream.on("data", async (chunk) => {
      fileStream.pause();
      try {
        await writer.write(chunk);
        fileStream.resume();
      } catch (err) {
        fileStream.destroy();
        reject(err);
      }
    });

    fileStream.on("end", resolve);
    fileStream.on("error", reject);
  });
}
