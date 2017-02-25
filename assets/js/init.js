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
		for (var i = 0; i < data.length; i++) {
			var item = data[i];
			if (!item.prerelease) {
				$('#release-version').html('<a href="' + item.html_url + '">v' + item.name + '</a>');
				$('#release-deb').html(getAssetLink(item.assets, '.deb'));
				$('#release-fedora').html(getAssetLink(item.assets, 'fedora.rpm'));
				$('#release-targz').html(getAssetLink(item.assets, '.tar.gz'));
				return;
			}
		}
	});

	function getAssetLink(assets, type) {
		for (var i = 0; i < assets.length; i++) {
			if (assets[i].name.indexOf(type) > -1) {
				return '<a href="' + assets[i].browser_download_url + '">' + assets[i].name + '</a>';
			}
		}

		return '<i>[Error]</i>';
	}
}, jQuery);
