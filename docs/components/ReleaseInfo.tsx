import React, { useState, useEffect } from "react";

interface Release {
  name: string;
  tag_name: string;
  html_url: string;
  published_at: string;
  prerelease: boolean;
  draft: boolean;
  assets: Array<{
    name: string;
    browser_download_url: string;
  }>;
}

interface ReleaseInfoProps {
  type: "stable" | "dev";
}

export default function ReleaseInfo({ type }: ReleaseInfoProps) {
  const [release, setRelease] = useState<Release | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReleases = async () => {
      try {
        // Check cache first
        const cacheKey = `ulauncher_releases_${type}`;
        const cached = localStorage.getItem(cacheKey);

        if (cached) {
          const { data, expires } = JSON.parse(cached);
          if (expires > Date.now()) {
            setRelease(data);
            setLoading(false);
            return;
          }
        }

        // Fetch from GitHub API
        const response = await fetch(
          "https://api.github.com/repos/ulauncher/ulauncher/releases"
        );
        const releases: Release[] = await response.json();

        if (!response.ok) {
          throw new Error("Failed to fetch releases");
        }

        // Find the appropriate release
        const targetRelease = releases.find((release) => {
          if (release.draft) return false;

          const isStable =
            /^\d+\.\d+\.\d+$/.test(release.name || release.tag_name) &&
            !release.prerelease;
          const hasDebAsset = release.assets.some(
            (asset) =>
              asset.name.includes("ulauncher") && asset.name.includes(".deb")
          );

          return hasDebAsset && (type === "stable" ? isStable : !isStable);
        });

        if (targetRelease) {
          setRelease(targetRelease);

          // Cache for 2 minutes
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              data: targetRelease,
              expires: Date.now() + 2 * 60 * 1000,
            })
          );
        } else {
          setError("No release found");
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch release info"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchReleases();
  }, [type]);

  if (loading) {
    return (
      <div className="release-info loading">Loading release information...</div>
    );
  }

  if (error) {
    return <div className="release-info error">Error: {error}</div>;
  }

  if (!release) {
    return (
      <div className="release-info error">No release information available</div>
    );
  }

  // Format version
  let version = release.name || release.tag_name;
  if (version.charAt(0) !== "v") {
    version = `v${version}`;
  }

  // Format date
  const date = new Date(release.published_at);
  const formattedDate = date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
  });

  return (
    <div className={`release-info ${type}`}>
      <div className="release-content">
        <span className={`release-badge ${type}`}>
          {type === "stable" ? "Stable" : "Development"}
        </span>
        <strong className="version-number">{version}</strong>
        <a
          href={release.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="action-link"
        >
          📋 Release notes
        </a>
        <span className="release-date">Released {formattedDate}</span>
      </div>
    </div>
  );
}
