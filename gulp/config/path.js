
const src = './src/';
const dst = './dist/';

export const path = {
	dst,
	src,
	style: {
		src: src + 'assets/styles/**/*.scss',
		dst: dst + 'resources/styles/'
	},
	html: {
		src: src + '**/*.html',
		dst: dst
	},
	scripts: {
		src: src + 'app/**/*.js',
		dst: dst + 'resources',
		entry: src + 'app/main.js'
	},
	server: {
        root: dst + '',
        watch: dst + '**/*.*'
    },
    images: {
    	src: src + 'assets/images/**/*',
    	dst: dst + 'resources/images/'
    }
}
