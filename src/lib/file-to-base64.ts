export async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      resolve(result.includes(",") ? result.split(",")[1]! : result);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const MIME_TO_EXTENSION: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/gif": "gif",
  "image/webp": "webp",
  "application/msword": "doc",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
};

/** Extension or MIME hint for SAST gateway upload_file*_filetype fields. */
export function getFileTypeFromFile(file: File): string {
  const name = file.name.trim();
  const lastDot = name.lastIndexOf(".");
  if (lastDot > 0 && lastDot < name.length - 1) {
    return name.slice(lastDot + 1).toLowerCase();
  }

  if (file.type) {
    const fromMime = MIME_TO_EXTENSION[file.type];
    if (fromMime) {
      return fromMime;
    }
    const subtype = file.type.split("/")[1];
    if (subtype) {
      return subtype.split("+")[0]!.toLowerCase();
    }
  }

  return "bin";
}

export function nullIfEmpty(
  value: string | null | undefined
): string | null | undefined {
  if (value === "") {
    return null;
  }
  return value;
}
