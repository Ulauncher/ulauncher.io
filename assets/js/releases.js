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
                .html('<b>v' + stable.name + '</b> from ' + new Date(stable.published_at).toLocaleDateString() +
                    ' <a href="' + stable.html_url + '">Release notes</a>.');
            $('#dev-release + .option-info')
                .html('<b>v' + dev.name + '</b> from ' + new Date(dev.published_at).toLocaleDateString() +
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

            var ubuntuPpa = selectStable ? '<code>ppa:agornostal/ulauncher</code>' :
                '<code>ppa:agornostal/ulauncher-dev</code>';
            $('#ubuntu-ppa').html(ubuntuPpa);

            renderReleaseLinks(selectStable ? stable : dev);
        }

        selectRelease(stableSelected);

        $('#stable-release').click(function(){
            selectRelease(true);
        });
        $('#dev-release').click(function(){
            selectRelease(false);
        });
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
            var isStable = item.name.indexOf('beta') === -1 && item.name.indexOf(' ') === -1;
            if (!item.prerelease && assets && !item.draft && ((stable && isStable) || (!stable && !isStable))) {
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
