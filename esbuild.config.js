require('esbuild').build({
  entryPoints: ['./dist/js/index.js'],
  bundle: true,
  platform: 'node',
  outfile: './dist/bundle/bundle.js',
  target: 'node20',
});
