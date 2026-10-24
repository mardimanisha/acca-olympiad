// Serves /public images as-is under the base path. The built-in /_next/image optimizer is skipped because the page is
// also reached through zskillup.com, whose trailing-slash redirect breaks optimizer URLs.
export default function imageLoader({ src }: { src: string }) {
  return `${process.env.NEXT_PUBLIC_ASSET_URL ?? ""}${src}`;
}
