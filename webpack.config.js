const fs = require('fs');
const klawSync = require('klaw-sync');
const path = require('path');

const entriesFolder = 'entries';
const srcEntryPath = path.resolve(__dirname, 'client', 'entries');

module.exports = {
  entry: klawSync(srcEntryPath, {
      nodir: true,
    })
    .reduce((entries, { path: p }) => {
      const entryName = path.relative(srcEntryPath, p)
        .split('.').slice(0, -1).join('.');
      entries[`${entriesFolder}/${entryName}`] = p;
      return entries;
    }, {}),
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              context: 'client',
              name: '[path][name].[ext]',
            },
          },
          'extract-loader',
          'css-loader'
        ],
      },
    ],
  },
}
