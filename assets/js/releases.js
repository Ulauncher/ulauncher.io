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
                .removeClass(selectStable ? 'fa-circle-o' : 'fa-dot-circle-o')
                .addClass(selectStable ? 'fa-dot-circle-o' : 'fa-circle-o');
            $('#dev-release .option-check')
                .removeClass(!selectStable ? 'fa-circle-o' : 'fa-dot-circle-o')
                .addClass(!selectStable ? 'fa-dot-circle-o' : 'fa-circle-o');

            $('#stable-release + .option-info')
                .html('<b>v' + stable.tag_name + '</b> from ' + new Date(stable.published_at).toLocaleDateString() +
                    ' <a href="' + stable.html_url + '">Release notes</a>.');
            $('#dev-release + .option-info')
                .html('<b>v' + dev.tag_name + '</b> from ' + new Date(dev.published_at).toLocaleDateString() +
                    ' <a href="' + dev.html_url + '">Release notes</a>.');

            var aurLink = selectStable ? 'https://aur.archlinux.org/packages/ulauncher/' :
                'https://aur.archlinux.org/packages/ulauncher-git/';
            $('#release-aur')
                .attr('href', aurLink)
                .text(aurLink);

            var aurShell = selectStable ? 'git clone https://aur.archlinux.org/ulauncher.git && cd ulauncher && makepkg -is' :
                'git clone https://aur.archlinux.org/ulauncher-git.git && cd ulauncher-git && makepkg -is';
            $('#aur-shell').html(aurShell);

            var ubuntuPpa = selectStable ? 'PPA: <code>ppa:agornostal/ulauncher</code>' :
                'PPA: <code>ppa:agornostal/ulauncher-dev</code>';
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
        var dlIcon = '<i class="fa fa-download"></i> ';
        $('#release-deb').html('<a href="' + r.assets.deb.url + '">' + dlIcon + r.assets.deb.name + '</a>');
        $('#release-fedora').html('<a href="' + r.assets.fedora.url + '">' + dlIcon + r.assets.fedora.name + '</a>');
        $('#release-suse').html('<a href="' + r.assets.suse.url + '">' + dlIcon + r.assets.suse.name + '</a>');
    }

    function getReleaseInfo(data, stable) {
        for (var i = 0; i < data.length; i++) {
            var item = data[i];
            var assets = getAssets(item);
            var isStable = item.name.indexOf(' ') === -1;
            if (!item.prerelease && assets && !item.draft && ((stable && isStable) || !stable)) {
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
        var suse = getAssetLink(release.assets, 'suse.rpm');
        var fedora = getAssetLink(release.assets, 'fedora.rpm');
        var deb = getAssetLink(release.assets, '.deb');

        if (suse && fedora && deb) {
            return {
                suse: suse,
                fedora: fedora,
                deb: deb
            };
        }
    }

    function getAssetLink(assets, type) {
        for (var i = 0; i < assets.length; i++) {
            if (assets[i].name.indexOf(type) > -1) {
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
