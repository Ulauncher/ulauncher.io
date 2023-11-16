jQuery(function($) {

    fetchReleases().then(renderReleaseInfo);

    function fetchReleases() {
        var releasesUrl = 'https://api.github.com/repos/ulauncher/ulauncher/releases';
        return loadReleasesFromCache() || $.get(releasesUrl).then(function(releases){
            // save to cache
            localStorage.setItem('releases', JSON.stringify({
                expires: Date.now() + 2 * 60 * 1000, // cache for 2 min
                data: releases
            }));

            return releases;
        });
    }

    function renderReleaseInfo (data){
        var stable = getReleaseInfo(data, true);
        var dev = getReleaseInfo(data, false);
        if (!stable || !dev) {
            console.error('Releases not found');
            return;
        }
        const stableVer = stable.name || stable.tag_name;
        const devVer = dev.name || dev.tag_name;
        if (stableVer.charAt(0) !== "v"){
            stableVer = `v${stableVer}`
        }
        if (devVer.charAt(0) !== "v"){
            devVer = `v${devVer}`
        }

        var stableSelected = getDefaultReleaseOption() == 'stable';

        function selectRelease (selectStable) {
            setDefaultReleaseOption(selectStable ? 'stable' : 'dev');

            $('#stable-release .option-check')
                .removeClass(selectStable ? 'fa-circle' : 'fa-dot-circle')
                .addClass(selectStable ? 'fa-dot-circle' : 'fa-circle');
            $('#dev-release .option-check')
                .removeClass(!selectStable ? 'fa-circle' : 'fa-dot-circle')
                .addClass(!selectStable ? 'fa-dot-circle' : 'fa-circle');

            $('#stable-release + .option-info')
                .html('<b>' + stableVer + '</b> from ' + new Date(stable.published_at).toLocaleDateString() +
                    ' <a href="' + stable.html_url + '">Release notes</a>.');
            $('#dev-release + .option-info')
                .html('<b>' + devVer + '</b> from ' + new Date(dev.published_at).toLocaleDateString() +
                    ' <a href="' + dev.html_url + '">Release notes</a>.');

            var aurLink = selectStable ? 'https://aur.archlinux.org/packages/ulauncher/' :
                'https://aur.archlinux.org/packages/ulauncher-git/';
            $('#release-aur')
                .attr('href', aurLink)
                .text(aurLink);

            var fedoraLink = selectStable ? 'https://src.fedoraproject.org/rpms/ulauncher/' :
                'https://copr.fedorainfracloud.org/coprs/troycurtisjr/ulauncher/';
            $('#release-fedora')
                .attr('href', fedoraLink)
                .text(fedoraLink);

            $('#fedora-dev-repo').toggle(!selectStable);

            var aurShell = selectStable ? 'git clone https://aur.archlinux.org/ulauncher.git && cd ulauncher && makepkg -is' :
                'git clone https://aur.archlinux.org/ulauncher-git.git && cd ulauncher-git && makepkg -is';
            $('#aur-shell').html(aurShell);

            var launchpadPackage = selectStable ? 'ulauncher' : 'ulauncher-dev';
            $('#ubuntu-ppa').html('<code>sudo add-apt-repository universe -y && sudo add-apt-repository ppa:agornostal/' + launchpadPackage + ' -y && sudo apt update && sudo apt install ulauncher</code>');

            var debianInstructions = 'sudo apt update && sudo apt install -y gnupg\n' +
                'gpg --keyserver keyserver.ubuntu.com --recv 0xfaf1020699503176\n' +
                'gpg --export 0xfaf1020699503176 | sudo tee /usr/share/keyrings/ulauncher-archive-keyring.gpg > /dev/null\n' +
                'echo "deb [signed-by=/usr/share/keyrings/ulauncher-archive-keyring.gpg] \\\n' +
                '          http://ppa.launchpad.net/agornostal/' + launchpadPackage + '/ubuntu jammy main" \\\n' +
                '          | sudo tee /etc/apt/sources.list.d/' + launchpadPackage + '-jammy.list\n' +
                'sudo apt update && sudo apt install ulauncher';

            $('#debian-ppa').html("<pre>" + debianInstructions + "</pre>");

            renderReleaseLinks(selectStable ? stable : dev);
        }

        selectRelease(stableSelected);

        $('#stable-release').click(function(){
            selectRelease(true);
        });
        $('#dev-release').click(function(){
            selectRelease(false);
        });

        // hide dev release if it's the same as stable
        const verRegex = /^(\d+)\.(\d+)\.(\d+)/
        const stableMatch = stableVer.match(verRegex)
        const devMatch = devVer.match(verRegex)
        const stMaj = parseInt(stableMatch[1], 10)
        const stMin = parseInt(stableMatch[2], 10)
        const stPatch = parseInt(stableMatch[3], 10)
        const devMaj = parseInt(devMatch[1], 10)
        const devMin = parseInt(devMatch[2], 10)
        const devPatch = parseInt(devMatch[3], 10)
        const isDevHigher = devMaj > stMaj || (devMaj > stMaj && devMin > stMin) || (devMaj > stMaj && devMin > stMin && devPatch > stPatch)
        if (!isDevHigher && stableSelected) {
            $('.channel-options').hide();
        }
    }

    /**
     * @param  {Object} r Release object
     */
    function renderReleaseLinks (r) {
        var dlIcon = '<i class="fas fa-download"></i> ';
        $('#release-deb').html('<a href="' + r.assets.deb.url + '">' + dlIcon + r.assets.deb.name + '</a>');
        if (r.assets.suse) {
            $('.distro-icon.distro-opensuse').show();
            $('#release-suse').html('<a href="' + r.assets.suse.url + '">' + dlIcon + r.assets.suse.name + '</a>');
        } else {
            $('.distro-icon.distro-opensuse').hide();
        }
        if (r.assets.centos) {
            $('.distro-icon.distro-centos').show();
            $('#release-centos').html('<a href="' + r.assets.centos.url + '">' + dlIcon + r.assets.centos.name + '</a>');
        } else {
            $('.distro-icon.distro-centos').hide();
        }
    }

    function getReleaseInfo(data, stable) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var assets = getAssets(item);
            var isStable = /^\d+\.\d+\.\d+$/.test(item.name || item.tag_name) && !item.prerelease;
            if (assets && !item.draft && stable === isStable) {
                return {
                    name: item.name,
                    tag_name: item.tag_name,
                    html_url: item.html_url,
                    published_at: item.published_at,
                    assets: assets
                };
            }
        }
    }

    function getAssets(release) {
        var deb = getAssetLink(release.assets, '.deb');

        if (deb) {
            return { deb };
        }
    }

    function getAssetLink(assets, type) {
        for (var i = 0; i < assets.length; i++) {
            if (assets[i].name.indexOf('ulauncher') > -1 && assets[i].name.indexOf(type) > -1) {
                return {
                    url: assets[i].browser_download_url,
                    name: assets[i].name
                };
            }
        }
    }

    function loadReleasesFromCache() {
        var str = localStorage.getItem('releases');

        if (!str) {
            return;
        }

        var releases = JSON.parse(str);
        if (releases.expires < Date.now()) {
            return;
        }

        console.log('Take releases from cache');

        return $.when(releases.data);
    }

    function getDefaultReleaseOption() {
        var str = localStorage.getItem('release-option');

        return str || 'stable';
    }

    function setDefaultReleaseOption(option) {
        localStorage.setItem('release-option', option);
    }

}, jQuery);
