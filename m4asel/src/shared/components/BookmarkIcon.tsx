import BookmarkActive from "@/assets/images/bookmarkActive.svg";
import BookmarkInactive from "@/assets/images/bookmarkInactive.svg";

interface BookmarkIconProps {
  size?: number;
  /** Saved state → filled blue flag; otherwise the outline flag. */
  active?: boolean;
}

/** Bookmark/flag with a star, from Figma. Filled blue when active, outline otherwise. */
export default function BookmarkIcon({ size = 26, active = false }: BookmarkIconProps) {
  const Icon = active ? BookmarkActive : BookmarkInactive;
  const viewHeight = active ? 19 : 18; // each SVG's viewBox height (width is 14)
  const width = (size * 14) / viewHeight; // preserve aspect ratio
  return <Icon width={width} height={size} />;
}
