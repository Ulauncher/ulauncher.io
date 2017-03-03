/*
	Linear by TEMPLATED
    templated.co @templatedco
    Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

skel.init({
	prefix: '/assets/css/style',
	resetCSS: true,
	boxModel: 'border',
	grid: {
		gutters: 50
	},
	breakpoints: {
		'mobile': {
			range: '-480',
			lockViewport: true,
			containers: 'fluid',
			grid: {
				collapse: true,
				gutters: 10
			}
		},
		'desktop': {
			range: '481-',
			containers: 1200
		},
		'1000px': {
			range: '481-1200',
			containers: 960
		}
	}
}, {
	panels: {
		panels: {
			navPanel: {
				breakpoints: 'mobile',
				position: 'left',
				style: 'reveal',
				size: '80%',
				html: '<div data-action="navList" data-args="nav"></div>'
			}
		},
		overlays: {
			titleBar: {
				breakpoints: 'mobile',
				position: 'top-left',
				height: 44,
				width: '100%',
				html: '<span class="toggle" data-action="togglePanel" data-args="navPanel"></span>' +
 '<span class="title" data-action="copyHTML" data-args="logo"></span>'
			}
		}
	}


});

jQuery(function($) {
	$.get('https://api.github.com/repos/ulauncher/ulauncher/releases').then(function(data){
		var info = getReleaseInfo(data);
		if (!info) {
			console.error('Releases not found');
			return;
		}

		$('#release-version').html('<a href="' + info.html_url + '">v' + info.name + '</a>');
		$('#release-deb').html('<a href="' + info.assets.deb.url + '">' + info.assets.deb.name + '</a>');
		$('#release-fedora').html('<a href="' + info.assets.fedora.url + '">' + info.assets.fedora.name + '</a>');
		$('#release-targz').html('<a href="' + info.assets.targz.url + '">' + info.assets.targz.name + '</a>');
	});

	function getReleaseInfo(data) {
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			var assets = getAssets(item);
			if (!item.prerelease && assets) {
				return {
					name: item.name,
					html_url: item.html_url,
					assets: assets
				};
			}
		}
	}

	function getAssets(release) {
		var targz = getAssetLink(release.assets, '.tar.gz');
		var fedora = getAssetLink(release.assets, 'fedora.rpm');
		var deb = getAssetLink(release.assets, '.deb');

		if (targz && fedora && deb) {
			return {
				targz: targz,
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

}, jQuery);
