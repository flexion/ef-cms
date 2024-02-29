#!/usr/bin/env node
/* eslint-disable import/no-default-export */
/* eslint-disable promise/no-nesting */
import { clean } from 'esbuild-plugin-clean';
import { copy } from 'esbuild-plugin-copy';
import babel from 'esbuild-plugin-babel-cached';
import esbuild from 'esbuild';
import { commonjs } from '@hyrious/esbuild-plugin-commonjs';

async function buildHandlers() {
  const buildOptions = {
    bundle: true,
    plugins: [commonjs()],
    entryPoints: [`./web-api/terraform/template/lambdas/handlers.ts`],
    format: 'esm',
    outExtension: { '.js': '.mjs' },
    minify: false,
    platform: 'node',
    external: ['@sparticuz/chromium', 'aws-crt', 'puppeteer-core'],
    loader: {
      '.node': 'file',
    },
    outdir: './web-api/terraform/template/lambdas/dist',
    plugins: [
      clean({
        patterns: [`./web-api/terraform/template/lambdas/dist/*`],
      }),
      copy({
        assets: [
          {
            from: 'node_modules/pdfjs-dist/legacy/build/*',
            to: '.',
            keepStructure: true,
          },
          { from: 'node_modules/pdf-lib/dist/*', to: '.', keepStructure: true },
          {
            from: 'shared/static/pdfs/amended-petition-form.pdf',
            to: '.',
            keepStructure: true,
          },
        ],
      }),
      babel({
        config: {
          ignore: ['node_modules'],
          plugins: [],
          presets: [
            [
              '@babel/preset-env',
              {
                targets: {
                  esmodules: true,
                },
              },
            ],
            [
              '@babel/preset-react',
              {
                runtime: 'automatic',
              },
            ],
          ],
          sourceType: 'unambiguous',
          targets: 'defaults',
        },
        filter: /\.(js|ts|jsx|tsx)$/,
      }),
    ],
    sourcemap: false,
    splitting: true,
  };

  await esbuild.build(buildOptions);
}

buildHandlers();
