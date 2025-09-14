// Load Umami analytics script
(function () {
  const script = document.createElement("script");
  script.src = "https://cloud.umami.is/script.js";
  script.setAttribute(
    "data-website-id",
    "5df87492-49bc-45fe-ab12-80aa94033bc3"
  );
  script.async = true;

  script.onload = function () {
    // Check if we're on the downloads page
    if (window.location.pathname.includes("/download")) {
      // Listen for clicks on <pre> elements to track distro downloads
      document.addEventListener("click", function (event) {
        if (event.target.tagName === "PRE" || event.target.closest("pre")) {
          // Check if already downloaded
          if (localStorage.getItem("downloaded") === "true") {
            return;
          }

          const preElement =
            event.target.tagName === "PRE"
              ? event.target
              : event.target.closest("pre");
          const content = preElement.textContent.toLowerCase();

          let distro = null;

          // Detect distro based on package manager
          if (content.includes("apt ")) {
            distro = "Ubuntu";
          } else if (content.includes("dnf")) {
            distro = "Fedora";
          } else if (content.includes("pacman") || content.includes("yay")) {
            distro = "Arch Linux";
          }

          // Track the download event if distro was detected
          if (distro && typeof umami !== "undefined") {
            umami.track("Distro download", { distro: distro });
            localStorage.setItem("downloaded", "true");
          }
        }
      });
    }
  };

  document.head.appendChild(script);
})();
